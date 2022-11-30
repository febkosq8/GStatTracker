const router = require("express").Router();
const axios = require("axios");
const RepoCommitHandler = require("../Handlers/RepoCommitHandler");
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
    const perPage = req.query.perPage;
    const page = req.query.page;
    const logTime = req.query.logTime;
    let data = await new RepoCommitHandler(
      repoUrl,
      perPage,
      page,
      token,
      loggedInUser
    ).getCommitsData(logTime);
    res.send(data);
  } catch (error) {
    const msg = ErrorManager.getErrorMessage(
      error.response,
      "System Failure : Unable to acquire Commit data from GitHub API"
    );
    res.send({ error: msg });
  }
});

module.exports = router;
