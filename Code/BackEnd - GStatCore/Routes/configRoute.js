const router = require("express").Router();
const ErrorManager = require("../Managers/ErrorManager");
const axios = require("axios");
const UserQuery = require("../Schemas/userQuerySchema");
const RepoQuery = require("../Schemas/repoQuerySchema");
const BulkRepoQuery = require("../Schemas/bulkRepoQuerySchema");
const CommitQuery = require("../Schemas/commitQuerySchema");
const RepoCommitQuery = require("../Schemas/repoCommitQuerySchema");
const AnalyzeQuery = require("../Schemas/analyzeQuerySchema");
const LoggedUserQuery = require("../Schemas/loggedUserSchema");
const passport = require("passport");
const AuthHandler = require("../Handlers/AuthHandler");
router.get("/rateLimit", async (req, res) => {
  try {
    const token = AuthHandler.getInstance().getToken(req);
    axios.defaults.headers.common["Authorization"] = "";
    if (token.length > 0)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    let rateLimitData = await axios.get(`https://api.github.com/rate_limit`);
    // https://api.github.com/rate_limit
    rateLimitData = await rateLimitData.data;
    let unix_timestamp = rateLimitData.rate.reset;
    let unix_date = new Date(unix_timestamp * 1000);
    let data = {
      maxLimit: rateLimitData.rate.limit,
      usedLimit: rateLimitData.rate.used,
      remainingLimit: rateLimitData.rate.remaining,
      resetLimit: unix_date,
    };
    res.json(data);
  } catch (error) {
    const msg = ErrorManager.getErrorMessage(
      error.response,
      "System Failure : Unable to acquire RateLimit data from GitHub API"
    );
    res.send({ error: msg });
  }
});
router.get(
  "/deleteLog",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const type = req.query.type;
    let logModelMap = {
      user: UserQuery,
      repo: RepoQuery,
      bulkRepo: BulkRepoQuery,
      commit: CommitQuery,
      repoCommit: RepoCommitQuery,
      analyze: AnalyzeQuery,
      loggedUsers: LoggedUserQuery,
    };
    if (type in logModelMap) {
      let deleteCount = await logModelMap[type].deleteMany();
      res.send({ deleteCount: deleteCount });
    } else {
      res.send({ error: "No type specified" });
    }
  }
);

module.exports = router;
