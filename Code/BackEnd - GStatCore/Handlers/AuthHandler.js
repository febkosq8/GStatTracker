const crypto = require("crypto");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const AdminList = require("../Schemas/adminListSchema");
class AuthHandler {
  instance;
  init() {
    const JwtStrategy = require("passport-jwt").Strategy;
    const ExtractJwt = require("passport-jwt").ExtractJwt;
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");
    opts.secretOrKey = process.env.JWT_SECRET;
    passport.use(
      new JwtStrategy(opts, function (jwt_payload, done) {
        if (jwt_payload.token) {
          return done(null, jwt_payload.token);
        }
        return done(null, false);
      })
    );
  }
  static getInstance() {
    if (!AuthHandler.instance) {
      AuthHandler.instance = new AuthHandler();
    }
    return AuthHandler.instance;
  }
  constructor() {}
  getState() {
    return crypto.randomUUID();
  }
  async checkAdmin(user, email, id) {
    const adminList = await AdminList.find();
    return adminList.some((admin) => admin.username === user && admin.email === `${email}` && admin.id === id);
  }
  async retrieveToken(code, state) {
    try {
      const client_id = process.env.GITHUB_CLIENT_ID;
      const client_secret = process.env.GITHUB_CLIENT_SECRET;
      const ghToken = await axios.post(
        `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&state=${state}`
      );
      let token = await ghToken.data;
      token = new URLSearchParams(token).get("access_token");
      return token;
    } catch (error) {
      console.error("Error : Unable to acquire user token from GitHub API");
      throw error;
    }
  }
  async getUser(token) {
    try {
      if (!token) {
        return { login: "anonymous" };
      }
      const user = await axios.get(`https://api.github.com/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      let data = await user.data;
      let returndata = {
        login: data.login,
        id: data.id,
        email: data.email,
        id: data.id
      };
      return returndata;
    } catch (error) {
      console.error("Error : Unable to acquire user login data from GitHub API");
      throw error;
    }
  }
  getToken(req) {
    if (req.headers.authorization.split(" ")[1] === "null") return "";
    let token = AuthHandler.getInstance().verifyJwt(req.headers.authorization.split(" ")[1]).token;

    return token;
  }
  getJwt(token) {
    const jwtSecret = process.env.JWT_SECRET;
    return jwt.sign(token, jwtSecret);
  }
  verifyJwt(token) {
    const jwtSecret = process.env.JWT_SECRET;
    return jwt.verify(token, jwtSecret);
  }
  async validateUser(req, res) {
    const token = AuthHandler.getInstance().getToken(req);
    const { login, email, id } = await AuthHandler.getInstance().getUser(token);
    const isAdmin = await AuthHandler.getInstance().checkAdmin(login, email, id);
    if (!isAdmin) res.sendStatus(401);
    return isAdmin;
  }
}
module.exports = AuthHandler;
