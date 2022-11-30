const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const DatabaseManager = require("./Managers/DatabaseManager");
const RouteManager = require("./Managers/RouteManager");
const AuthHandler = require("./Handlers/AuthHandler");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3030;
require("dotenv").config();
app.use(bodyParser.json());
app.use(cors());
AuthHandler.getInstance().init();
app.listen(PORT, () => {
	console.log(`GStatCore | Notice : Server started on ${PORT}.`);
	DatabaseManager.init();
	RouteManager.init(app);
});
