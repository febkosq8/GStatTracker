const { Schema, model } = require("mongoose");

const repoQuerySchema = new Schema({
  loggedInUser: String,
  repo: String,
  timeStamp: Date,
  repoName: String,
  repoUrl: String,
  createdBy: String,
  createdAt: Date,
  lastCommitOn: Date,
  languages: { type: Object, default: undefined,required: true },
  totalBytes: Object,
  contributors: [
    {
      name: String,
      commits: Number,
    },
  ],
  totalCommits: String,
});

module.exports = model("RepoQuery", repoQuerySchema);
