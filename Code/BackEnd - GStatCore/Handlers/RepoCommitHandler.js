const repoCommitQuery = require("../Schemas/repoCommitQuerySchema");
const DateHandler = require("./DateHandler");
const axios = require("axios");
class RepoCommitHandler {
  #repoUrl;
  #perPage;
  #page;
  #loggedInUser;
  constructor(repoUrl, perPage, page, token, loggedInUser) {
    this.#repoUrl = repoUrl;
    this.#perPage = perPage;
    this.#page = page;
    this.#loggedInUser = loggedInUser;
    axios.defaults.headers.common["Authorization"] = "";
    if (token.length > 0) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }
  async getCommitsData(cacheTime) {
    let commitsData = await this.getCachedCommitsData(cacheTime);
    if (!commitsData) {
      commitsData = await this.getFreshCommitsData();
    }
    return commitsData;
  }
  async getCachedCommitsData(cacheTime) {
    if (!cacheTime) {
      cacheTime = 0;
    }
    let commitsData = await repoCommitQuery
      .findOne({
        loggedInUser: this.#loggedInUser,
        repo: this.#repoUrl,
        perPage: this.#perPage,
        page: this.#page,
        timeStamp: {
          $gt: new Date(
            new Date().setMinutes(new Date().getMinutes() - cacheTime)
          ),
        },
      })
      .sort({ timeStamp: -1 });
    if (!commitsData) {
      return null;
    } else {
      return {
        ...JSON.parse(JSON.stringify(commitsData)),
        isCached: true,
      };
    }
  }
  async getFreshCommitsData() {
    let initData = await axios.get(
      `https://api.github.com/repos/${
        this.#repoUrl
      }/commits?per_page=${1}&page=${1}`
    );
    initData = await initData.headers.link;
    let links = initData.split(",");
    let lastPage;
    links[links.length - 1].replace(
      /.&page=([0-9]*)/g,
      (extracted, matched) => {
        lastPage = Math.ceil(parseInt(matched) / this.#perPage);
      }
    );
    let commitsData = await axios.get(
      `https://api.github.com/repos/${this.#repoUrl}/commits?per_page=${
        this.#perPage
      }&page=${this.#page}`
    );
    commitsData = await commitsData.data;
    let authorList = new Set();
    commitsData.forEach((commit) => {
      if (commit?.author?.login) authorList.add(commit.author.login);
    });
    let authorListArray = Array.from(authorList);
    const getAuthorCommits = (author, date) => {
      return commitsData.filter((commit) => {
        return (
          commit?.author?.login === author &&
          DateHandler.compareDays(commit?.commit?.author?.date, date)
        );
      }).length;
    };
    let formattedGraphData = new Map();
    commitsData.forEach((commit) => {
      if (!commit?.author?.login || !commit?.commit?.author?.date) {
        return;
      }
      let date = DateHandler.getFormattedDate(commit.commit.author.date);
      if (formattedGraphData.has(date)) {
        formattedGraphData.set(date, {
          ...formattedGraphData.get(date),
          [commit.author.login]: getAuthorCommits(commit.author.login, date),
        });
      } else {
        formattedGraphData.set(date, {
          [commit.author.login]: getAuthorCommits(commit.author.login, date),
        });
      }
    });
    let graphData = [];
    formattedGraphData.forEach((value, key) => {
      graphData.push({
        date: DateHandler.getFormattedDate(key),
        ...value,
      });
    });
    let returnData = {
      isCached: false,
      authorList: authorListArray,
      graphData: graphData.reverse(),
      lastPage: lastPage,
      response: commitsData.map((commit) => {
        return {
          sha: commit.sha,
          commitDate: commit?.commit?.author?.date,
          commitAuthor: commit?.author?.login,
          commitMessage: commit?.commit?.message,
        };
      }),
    };
    let auditData = {
      loggedInUser: this.#loggedInUser,
      repo: this.#repoUrl,
      perPage: this.#perPage,
      page: this.#page,
      lastPage: returnData.lastPage,
      authorList: returnData.authorList,
      graphData: returnData.graphData,
      timeStamp: new Date().toISOString(),
      response: returnData.response.map((commit) => {
        return {
          sha: commit.sha,
          commitDate: commit.commitDate,
          commitAuthor: commit.commitAuthor,
          commitMessage: commit.commitMessage,
        };
      }),
    };
    new repoCommitQuery(auditData).save();
    return returnData;
  }
}
module.exports = RepoCommitHandler;
