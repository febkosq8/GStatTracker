const router = require("express").Router();
const UserHandler = require("../Handlers/UserHandler");
const ErrorManager = require("../Managers/ErrorManager");
const axios = require("axios");
const passport = require("passport");
const AuthHandler = require("../Handlers/AuthHandler");
router.get("/", async (req, res) => {
  try {
    const token = AuthHandler.getInstance().getToken(req);
    const { login: loggedInUser } = await AuthHandler.getInstance().getUser(
      token
    );
    const userName = req.query.user;
    const perPage = req.query.perPage;
    const page = req.query.page;
    const logTime = req.query.logTime;
    let data = await new UserHandler(
      userName,
      perPage,
      page,
      token,
      loggedInUser
    ).getUserData(logTime);
    res.send(data);
  } catch (error) {
    const msg = ErrorManager.getErrorMessage(
      error.response,
      "System Failure : Unable to acquire User data from GitHub API"
    );
    res.send({ error: msg });
  }
});

module.exports = router;
