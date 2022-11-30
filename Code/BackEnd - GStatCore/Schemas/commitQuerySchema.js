const { Schema, model } = require("mongoose");

const commitQuerySchema = new Schema({
  loggedInUser: String,
  repo: String,
  sha: String,
  timeStamp: Date,
  response: {
    sha: String,
    repoUrl: String,
    commitAuthor: String,
    commitDate: Date,
    commitMessage: String,
    additions: String,
    deletions: String,
    totalChanges: String,
    files: [
      {
        name: String,
        url: String,
        changeType: String,
        additions: String,
        deletions: String,
        totalChanges: String,
      },
    ],
  },
});

module.exports = model("CommitQuery", commitQuerySchema);
