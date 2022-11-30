const { Schema, model } = require("mongoose");

const analyzeQuerySchema = new Schema({
  loggedInUser: String,
  repo: String,
  timeStamp: Date,
  filterList: String,
  repoData: Array,
  repoGrade: String,
  authorDetails: Object,
});

module.exports = model("AnalyzeQuery", analyzeQuerySchema);
