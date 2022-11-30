class RouteManager {
  static init(app) {
    app.use("/repo", require("../Routes/repoRoute"));
    app.use("/user", require("../Routes/userRoute"));
    app.use("/audit", require("../Routes/auditRoute"));
    app.use("/commit", require("../Routes/commitRoute"));
    app.use("/repoCommit", require("../Routes/repoCommitRoute"));
    app.use("/config", require("../Routes/configRoute"));
    app.use("/analyze", require("../Routes/analyzeRoute"));
    app.use("/auth", require("../Routes/authRoute"));
    app.get("*", (req, res) => {
      res.sendFile(__dirname+"/error.html");
    });
  }
}
module.exports = RouteManager;
