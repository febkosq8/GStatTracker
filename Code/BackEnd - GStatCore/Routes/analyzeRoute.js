const router = require("express").Router();
const ErrorManager = require("../Managers/ErrorManager");
const AnalyzeHandler = require("../Handlers/AnalyzeHandler");
const axios = require("axios");
const passport = require("passport");
const AuthHandler = require("../Handlers/AuthHandler");
router.get(
  "/analyzeRepo",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const token = AuthHandler.getInstance().getToken(req);
      const { login: loggedInUser } = await AuthHandler.getInstance().getUser(
        token
      );
      const repoUrl = req.query.repoUrl;
      const messageFilterList = req.query.messageFilterList;
      const logTime = req.query.logTime;
      let data = await AnalyzeHandler.getGradeData(
        repoUrl,
        messageFilterList,
        logTime,
        token,
        loggedInUser
      );
      res.send(data);
    } catch (error) {
      const msg = ErrorManager.getErrorMessage(
        error.response,
        "System Failure : Unable to acquire Repo data from GitHub API"
      );
      res.send({ error: msg });
    }
  }
);

module.exports = router;
