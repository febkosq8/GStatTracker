const { Schema, model } = require("mongoose");

const bulkRepoQuerySchema = new Schema({
  loggedInUser: String,
  repo: String,
  timeStamp: Date,
  response: [
    {
      repoName: String,
      commitUrl: String,
      commitAt: Date,
      commitAuthor: String,
      commitMessage: String,
    },
  ],
});

module.exports = model("BulkRepoQuery", bulkRepoQuerySchema);
