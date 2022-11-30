const router = require("express").Router();
const axios = require("axios");
const RepoHandler = require("../Handlers/RepoHandler");
const ErrorManager = require("../Managers/ErrorManager");
const passport = require("passport");
const AuthHandler = require("../Handlers/AuthHandler");
router.get("/", async (req, res) => {
  try {
    const token = AuthHandler.getInstance().getToken(req);
    const { login: loggedInUser } = await AuthHandler.getInstance().getUser(
      token
    );
    const repoUrl = req.query.repoUrl;
    const logTime = req.query.logTime;
    const isBulk = req.query.isBulk === "true";
    let data = await new RepoHandler(
      repoUrl,
      isBulk,
      token,
      loggedInUser
    ).getRepoData(logTime);
    res.send(data);
  } catch (error) {
    const msg = ErrorManager.getErrorMessage(
      error.response,
      "System Failure : Unable to acquire Repo data from GitHub API"
    );
    res.send({ error: msg });
  }
});

module.exports = router;
