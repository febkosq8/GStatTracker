const router = require("express").Router();
const axios = require("axios");
const CommitHandler = require("../Handlers/CommitHandler");
const ErrorManager = require("../Managers/ErrorManager");
const passport = require("passport");
const AuthHandler = require("../Handlers/AuthHandler");
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const token = AuthHandler.getInstance().getToken(req);
      const { login: loggedInUser } = await AuthHandler.getInstance().getUser(
        token
      );
      const repoUrl = req.query.repoUrl;
      const sha = req.query.sha;
      const logTime = req.query.logTime;
      let data = await new CommitHandler(
        repoUrl,
        sha,
        token,
        loggedInUser
      ).getCommitData(logTime);
      res.send(data);
    } catch (error) {
      const msg = ErrorManager.getErrorMessage(
        error.response,
        "System Failure : Unable to acquire Commit data from GitHub API"
      );
      res.send({ error: msg });
    }
  }
);

module.exports = router;
