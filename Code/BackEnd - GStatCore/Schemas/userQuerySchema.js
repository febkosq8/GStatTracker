const { Schema, model } = require("mongoose");

const userQuerySchema = new Schema({
  loggedInUser: String,
  repoCount: String,
  userId: String,
  id: String,
  url: String,
  name: String,
  createdAt: Date,
  followers: String,
  following: String,
  perPage: String,
  page: String,
  timeStamp: Date,
  repos: [
    {
      repoName: String,
      repoUrl: String,
      repoPrivate: Boolean,
      repoDescription: String,
      createdAt: Date,
    },
  ],
});

module.exports = model("UserQuery", userQuerySchema);
