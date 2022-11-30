const commitQuery = require("../Schemas/commitQuerySchema");
const axios = require("axios");
class CommitHandler {
  #repoUrl;
  #sha;
  #loggedInUser;
  constructor(repoUrl, sha, token, loggedInUser) {
    this.#repoUrl = repoUrl;
    this.#sha = sha;
    this.#loggedInUser = loggedInUser;
    axios.defaults.headers.common["Authorization"] = "";
    if (token.length > 0) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }
  async getCommitData(cacheTime) {
    let commitData = await this.getCachedCommitData(cacheTime);
    if (!commitData) {
      commitData = await this.getFreshCommitData();
    }
    return commitData;
  }
  async getCachedCommitData(cacheTime) {
    if (!cacheTime) {
      cacheTime = 0;
    }
    let commitData = await commitQuery
      .findOne({
        loggedInUser: this.#loggedInUser,
        repo: this.#repoUrl,
        sha: this.#sha,
        timeStamp: {
          $gt: new Date(
            new Date().setMinutes(new Date().getMinutes() - cacheTime)
          ),
        },
      })
      .sort({ timeStamp: -1 });
    if (!commitData) {
      return null;
    } else {
      return {
        ...JSON.parse(JSON.stringify(commitData)).response,
        isCached: true,
      };
    }
  }
  async getFreshCommitData() {
    let commitData = await axios.get(
      `https://api.github.com/repos/${this.#repoUrl}/commits/${this.#sha}`
    );
    commitData = await commitData.data;
    let returnData = {
      isCached: false,
      sha: commitData?.sha,
      commitDate: commitData?.commit?.author?.date,
      commitAuthor: commitData?.author?.login,
      commitMessage: commitData?.commit?.message,
      additions: commitData?.stats?.additions,
      deletions: commitData?.stats?.deletions,
      totalChanges: commitData?.stats?.total,
      files: commitData?.files.map((file) => {
        return {
          name: file.filename,
          url: file.blob_url,
          changeType: file.status,
          additions: file.additions,
          deletions: file.deletions,
          totalChanges: file.changes,
        };
      }),
    };
    let auditData = {
      loggedInUser: this.#loggedInUser,
      sha: this.#sha,
      repo: this.#repoUrl,
      timeStamp: new Date().toISOString(),
      response: {
        sha: returnData.sha,
        repoUrl: this.#repoUrl,
        commitDate: returnData.commitDate,
        commitAuthor: returnData.commitAuthor,
        commitMessage: returnData.commitMessage,
        additions: returnData.additions,
        deletions: returnData.deletions,
        totalChanges: returnData.totalChanges,
        files: returnData.files.map((file) => {
          return {
            name: file.name,
            url: file.url,
            changeType: file.changeType,
            additions: file.additions,
            deletions: file.deletions,
            totalChanges: file.totalChanges,
          };
        }),
      },
    };
    new commitQuery(auditData).save();
    return returnData;
  }
}
module.exports = CommitHandler;
