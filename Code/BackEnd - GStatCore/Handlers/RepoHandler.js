const repoQuery = require("../Schemas/repoQuerySchema");
const bulkRepoQuery = require("../Schemas/bulkRepoQuerySchema");
const axios = require("axios");
class RepoHandler {
  #repoUrl;
  #isBulk;
  #loggedInUser;
  constructor(repoUrl, isBulk, token, loggedInUser) {
    this.#repoUrl = repoUrl;
    this.#isBulk = isBulk;
    this.#loggedInUser = loggedInUser;
    axios.defaults.headers.common["Authorization"] = "";
    if (token.length > 0) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }
  async getRepoData(cacheTime) {
    let repoData = await this.getCachedRepoData(cacheTime);
    if (!repoData) {
      repoData = await this.getFreshRepoData(this.#repoUrl);
    }
    return repoData;
  }
  async getCachedRepoData(cacheTime) {
    if (!cacheTime) {
      cacheTime = 0;
    }
    if (this.#isBulk) {
      let bulkRepoData = await bulkRepoQuery
        .findOne({
          loggedInUser: this.#loggedInUser,
          repo: this.#repoUrl,
          timeStamp: {
            $gt: new Date(
              new Date().setMinutes(new Date().getMinutes() - cacheTime)
            ),
          },
        })
        .sort({ timeStamp: -1 });
      if (!bulkRepoData) return null;
      bulkRepoData = JSON.parse(JSON.stringify(bulkRepoData));
      bulkRepoData["isCached"] = true;
      return bulkRepoData;
    } else {
      let data = await Promise.allSettled(
        this.#repoUrl.split(",").map(async (repo) => {
          let repoData = await repoQuery.findOne({
            loggedInUser: this.#loggedInUser,
            repo: repo,
            timeStamp: {
              $gt: new Date(
                new Date().setMinutes(new Date().getMinutes() - cacheTime)
              ),
            },
          });
          if (!repoData) return await this.getFreshRepoData(repo);
          return {
            ...repoData._doc,
            isCached: true,
          };
        })
      );
      data = data.map((data) => data.value);
      if (!this.#isBulk) {
        data = data[0];
      }
      return data;
    }
  }
  async getFreshRepoData(repoUrl) {
    let data = await Promise.allSettled(
      repoUrl.split(",").map(async (repo) => {
        let repoData = await axios.get(
          this.#isBulk
            ? `https://api.github.com/repos/${repo}/commits?per_page=1&page=1`
            : `https://api.github.com/repos/${repo}`
        );
        repoData = await repoData.data;
        if (!this.#isBulk) {
          let languageData;
          try {
            languageData = await axios.get(
              `https://api.github.com/repos/${repo}/languages`
            );
            languageData = await languageData.data;
          } catch (error) {
            languageData = {};
          }
          let contributorData;
          try {
            contributorData = await axios.get(
              `https://api.github.com/repos/${repo}/contributors`
            );
            contributorData = await contributorData.data;
          } catch (error) {
            contributorData = [];
          }
          let commitCountData;
          try {
            commitCountData = await axios.get(
              `https://api.github.com/repos/${repo}/stats/contributors`
            );
            commitCountData = await commitCountData.data;
            commitCountData = commitCountData.reduce(
              (acc, curr) => acc + curr.total,
              0
            );
          } catch (error) {
            commitCountData = "Not Available. Retry Later";
          }

          if (contributorData === "") {
            contributorData = [];
          }
          repoData = {
            isCached: false,
            repoName: repoData.name,
            repoUrl: repoData.html_url,
            createdBy: repoData.owner.login,
            createdAt: repoData.created_at,
            lastCommitOn: repoData.pushed_at,
            languages: languageData,
            totalBytes: Object.values(languageData).reduce((a, b) => a + b, 0),
            contributors: contributorData?.map((user) => {
              return {
                name: user.login,
                commits: user.contributions,
              };
            }),
            totalCommits: commitCountData,
          };
        } else {
          repoData = {
            isCached: false,
            repoName: repo,
            commitUrl: repoData[0]?.html_url,
            commitAt: repoData[0]?.commit?.author?.date,
            commitAuthor: repoData[0]?.author?.login,
            commitMessage: repoData[0]?.commit?.message,
          };
        }
        return repoData;
      })
    );
    data = data.map((data) => data.value);
    if (this.#isBulk) {
      let auditData = {
        loggedInUser: this.#loggedInUser,
        repo: repoUrl,
        timeStamp: new Date().toISOString(),
        response: data,
      };
      new bulkRepoQuery(auditData).save();
    } else {
      data = data[0];
      if (!data.languages) {
        data.languages = {};
      }
      if (Object.keys(data.languages).length === 0) {
        data.languages = { error: "No Languages Found" };
      }
      let auditData = {
        loggedInUser: this.#loggedInUser,
        repo: repoUrl,
        timeStamp: new Date().toISOString(),
        repoName: data.repoName,
        repoUrl: data.repoUrl,
        createdBy: data.createdBy,
        createdAt: data.createdAt,
        lastCommitOn: data.lastCommitOn,
        languages: data.languages,
        totalBytes: data.totalBytes,
        contributors: data.contributors,
        totalCommits: data.totalCommits,
      };
      new repoQuery(auditData).save();
    }
    return data;
  }
}
module.exports = RepoHandler;
