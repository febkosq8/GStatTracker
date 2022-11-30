const router = require("express").Router();
const UserQuery = require("../Schemas/userQuerySchema");
const RepoQuery = require("../Schemas/repoQuerySchema");
const BulkRepoQuery = require("../Schemas/bulkRepoQuerySchema");
const CommitQuery = require("../Schemas/commitQuerySchema");
const RepoCommitQuery = require("../Schemas/repoCommitQuerySchema");
const AnalyzeQuery = require("../Schemas/analyzeQuerySchema");
const LoggedUserQuery = require("../Schemas/loggedUserSchema");
const ErrorManager = require("../Managers/ErrorManager");
const passport = require("passport");
const AuthHandler = require("../Handlers/AuthHandler");
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const valid = await AuthHandler.getInstance().validateUser(req, res);
      if (valid) {
        const data = await UserQuery.find();
        res.send(data);
      }
    } catch (error) {
      const msg = ErrorManager.getErrorMessage(
        error.response,
        "System Failure : Error in fetching User logs"
      );
      res.send({ error: msg });
    }
  }
);
router.get(
  "/repo",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const valid = await AuthHandler.getInstance().validateUser(req, res);
      if (valid) {
        const data = await RepoQuery.find();
        res.send(data);
      }
    } catch (error) {
      const msg = ErrorManager.getErrorMessage(
        error.response,
        "System Failure : Error in fetching Repository logs"
      );
      res.send({ error: msg });
    }
  }
);
router.get(
  "/bulkRepo",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const valid = await AuthHandler.getInstance().validateUser(req, res);
      if (valid) {
        const data = await BulkRepoQuery.find();
        res.send(data);
      }
    } catch (error) {
      const msg = ErrorManager.getErrorMessage(
        error.response,
        "System Failure : Error in fetching Bulk Repository logs"
      );
      res.send({ error: msg });
    }
  }
);
router.get(
  "/commit",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const valid = await AuthHandler.getInstance().validateUser(req, res);
      if (valid) {
        const data = await CommitQuery.find();
        res.send(data);
      }
    } catch (error) {
      const msg = ErrorManager.getErrorMessage(
        error.response,
        "System Failure : Error in fetching Commit logs"
      );
      res.send({ error: msg });
    }
  }
);
router.get(
  "/repoCommit",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const valid = await AuthHandler.getInstance().validateUser(req, res);
      if (valid) {
        const data = await RepoCommitQuery.find();
        res.send(data);
      }
    } catch (error) {
      const msg = ErrorManager.getErrorMessage(
        error.response,
        "System Failure : Error in fetching Repository Commit logs"
      );
      res.send({ error: msg });
    }
  }
);
router.get(
  "/analyze",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const valid = await AuthHandler.getInstance().validateUser(req, res);
      if (valid) {
        const data = await AnalyzeQuery.find();
        res.send(data);
      }
    } catch (error) {
      const msg = ErrorManager.getErrorMessage(
        error.response,
        "System Failure : Error in fetching Analyze logs"
      );
      res.send({ error: msg });
    }
  }
);
router.get(
  "/loggedUsers",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const valid = await AuthHandler.getInstance().validateUser(req, res);
      if (valid) {
        const data = await LoggedUserQuery.find();
        res.send(data);
      }
    } catch (error) {
      const msg = ErrorManager.getErrorMessage(
        error.response,
        "System Failure : Error in fetching Logged Users logs"
      );
      res.send({ error: msg });
    }
  }
);

router.get("/count", async (req, res) => {
  try {
    const userCount = await UserQuery.countDocuments();
    const repoCount = await RepoQuery.countDocuments();
    const bulkRepoCount = await BulkRepoQuery.countDocuments();
    const commitCount = await CommitQuery.countDocuments();
    const repoCommitCount = await RepoCommitQuery.countDocuments();
    const analyzeCount = await AnalyzeQuery.countDocuments();
    const loggedUserCount = await LoggedUserQuery.countDocuments();
    const totalCount =
      userCount +
      repoCount +
      bulkRepoCount +
      commitCount +
      repoCommitCount +
      analyzeCount +
      loggedUserCount;
    res.send({
      userCount: userCount,
      repoCount: repoCount,
      bulkRepoCount: bulkRepoCount,
      commitCount: commitCount,
      repoCommitCount: repoCommitCount,
      analyzeCount: analyzeCount,
      loggedUserCount: loggedUserCount,
      totalCount: totalCount,
    });
  } catch (error) {
    const msg = ErrorManager.getErrorMessage(
      error.response,
      "System Failure : Error in fetching Audit Data Count"
    );
    res.send({ error: msg });
  }
});
module.exports = router;
