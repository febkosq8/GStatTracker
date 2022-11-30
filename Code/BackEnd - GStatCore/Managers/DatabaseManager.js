const mongoose = require("mongoose");
require("dotenv").config();
class DatabaseManager {
  static init() {
    let dbURL = process.env.DB_URL;
    mongoose.connect(dbURL);
    mongoose.connection.on("open", () => {
      console.log(
        "GStatCore | Notice : Successfully connected to MongoDB instance."
      );
    });
  }
}
module.exports = DatabaseManager;
