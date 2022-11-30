const { Schema, model } = require("mongoose");

const repocommitQuerySchema = new Schema({
  loggedInUser: String,
  repo: String,
  perPage: String,
  page: String,
  lastPage: String,
  authorList: Array,
  graphData: Array,
  timeStamp: Date,
  response: [
    {
      sha: String,
      commitAuthor: String,
      commitDate: Date,
      commitMessage: String,
    },
  ],
});

module.exports = model("RepoCommitQuery", repocommitQuerySchema);
