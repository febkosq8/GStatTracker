const userQuery = require("../Schemas/userQuerySchema");
const axios = require("axios");
class UserHandler {
  #user;
  #perPage;
  #page;
  #loggedInUser;

  constructor(user, perPage, page, token, loggedInUser) {
    this.#user = user;
    this.#perPage = perPage;
    this.#page = page;
    this.#loggedInUser = loggedInUser;
    axios.defaults.headers.common["Authorization"] = "";
    if (token.length > 0) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }
  async getUserData(cacheTime) {
    let userData = await this.getCachedUserData(cacheTime);
    if (!userData) {
      userData = await this.getFreshUserData();
    }
    return userData;
  }
  async getCachedUserData(cacheTime) {
    if (!cacheTime) {
      cacheTime = 0;
    }
    let userData = await userQuery
      .findOne({
        loggedInUser: this.#loggedInUser,
        userId: this.#user,
        perPage: this.#perPage,
        page: this.#page,
        timeStamp: {
          $gt: new Date(
            new Date().setMinutes(new Date().getMinutes() - cacheTime)
          ),
        },
      })
      .sort({ timeStamp: -1 });
    if (!userData) {
      return null;
    } else {
      return {
        ...JSON.parse(JSON.stringify(userData)),
        isCached: true,
      };
    }
  }
  async getFreshUserData() {
    let userData = await axios.get(
      `https://api.github.com/users/${this.#user}`
    );
    let repoData;
    try {
      repoData = await axios.get(
        `https://api.github.com/search/repositories?q=user:${
          this.#user
        }&per_page=${this.#perPage}&page=${this.#page}`
      );
    } catch (error) {
      repoData = [];
    }
    repoData = await repoData.data;
    userData = await userData.data;
    let returnData = {
      isCached: false,
      repoCount: repoData?.total_count ?? 0,
      userId: userData.login,
      id: userData.id,
      url: userData.html_url,
      name: userData.name,
      createdAt: userData.created_at,
      followers: userData.followers,
      following: userData.following,
      repos: repoData?.items.map((repo) => {
        return {
          repoName: repo.name,
          repoUrl: repo.html_url,
          repoPrivate: repo.private,
          repoDescription: repo.description,
          createdAt: repo.created_at,
        };
      }),
    };
    let auditData = {
      loggedInUser: this.#loggedInUser,
      repoCount: returnData.repoCount,
      userId: returnData.userId,
      id: returnData.id,
      url: returnData.url,
      name: returnData.name,
      createdAt: returnData.createdAt,
      followers: returnData.followers,
      following: returnData.following,
      perPage: this.#perPage,
      page: this.#page,
      timeStamp: new Date().toISOString(),
      repos: returnData?.repos?.map((repo) => {
        return {
          repoName: repo?.repoName,
          repoUrl: repo?.repoUrl,
          repoPrivate: repo?.repoPrivate,
          repoDescription: repo?.repoDescription,
          createdAt: repo?.createdAt,
        };
      }),
    };
    new userQuery(auditData).save();
    return returnData;
  }
}
module.exports = UserHandler;
