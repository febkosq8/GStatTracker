const router = require("express").Router();
const ErrorManager = require("../Managers/ErrorManager");
const axios = require("axios");
const passport = require("passport");
const AuthHandler = require("../Handlers/AuthHandler");
const loggedUserQuery = require("../Schemas/loggedUserSchema");
const { Admin } = require("mongodb");

router.get(
  "/checkAdmin",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const token = AuthHandler.getInstance().getToken(req);
      const { login, email, id } = await AuthHandler.getInstance().getUser(
        token
      );
      const ifAdmin = await AuthHandler.getInstance().checkAdmin(
        login,
        email,
        id
      );
      res.send(ifAdmin);
    } catch (error) {
      const msg = ErrorManager.getErrorMessage(
        error.response,
        "System Failure : Error in fetching Admin List"
      );
      res.send({ error: msg });
    }
  }
);

router.get("/status", async (req, res) => {
  try {
    res.sendStatus(200);
  } catch {
    return res.sendStatus(503);
  }
});

router.get("/authUrl", async (req, res) => {
  const reqType = req.query.type;
  let authUrl = `https://github.com/apps/gstat-tracker/installations/new?state=${AuthHandler.getInstance().getState()}`;
  if (reqType === "existing") {
    authUrl = `https://github.com/login/oauth/authorize?client_id=${
      process.env.GITHUB_CLIENT_ID
    }&state=${AuthHandler.getInstance().getState()}`;
  }
  res.send(authUrl);
});

router.get("/processAuth", async (req, res) => {
  try {
    const code = req.query.code;
    const state = req.query.state;
    const token = await AuthHandler.getInstance().retrieveToken(code, state);
    const jwt = AuthHandler.getInstance().getJwt({ token: token });
    const user = await AuthHandler.getInstance().getUser(token);
    userData = {
      username: user.login,
      id: user.id,
      email: user.email,
      status: "login",
      timeStamp: new Date().toISOString(),
    };
    new loggedUserQuery(userData).save();
    res.send(jwt);
  } catch (error) {
    console.error(
      "Error : Unable to acquire user authentication from GitHub API"
    );
    throw error;
  }
});
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const token = AuthHandler.getInstance().getToken(req);
      const user = await AuthHandler.getInstance().getUser(token);
      return res.json(user);
    } catch (e) {
      return res.send(null);
    }
  }
);
router.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const token = AuthHandler.getInstance().getToken(req);
      const user = await AuthHandler.getInstance().getUser(token);
      userData = {
        username: user.login,
        id: user.id,
        email: user.email,
        status: "logout",
        timeStamp: new Date().toISOString(),
      };
      setTimeout(() => {
        new loggedUserQuery(userData).save();
        return res.sendStatus(200);
      }, 1000);
    } catch (e) {
      return res.send(null);
    }
  }
);
module.exports = router;
