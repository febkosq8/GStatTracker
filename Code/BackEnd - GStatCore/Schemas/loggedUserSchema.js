const { Schema, model } = require("mongoose");

const loggedUserSchema = new Schema({
  username: String,
  id: String,
  email: String,
  status: String,
  timeStamp: Date,
});

module.exports = model("LoggedUser", loggedUserSchema);
