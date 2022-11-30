const { Int32 } = require("mongodb");
const { Schema, model } = require("mongoose");

const adminListSchema = new Schema({
  username: String,
  email: String,
  id: Number,
});

module.exports = model("AdminList", adminListSchema);
