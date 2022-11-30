const analyzeQuery = require("../Schemas/analyzeQuerySchema");
const axios = require("axios");

class AnalyzeHandler {
  static instance;
  static getMessageGrade(messageLength) {
    if (messageLength >= 30) {
      return "A";
    }
    if (messageLength >= 20) {
      return "B";
    }
    if (messageLength >= 10) {
      return "C";
    }
    if (messageLength >= 5) {
      return "D";
    }
    if (messageLength > 0) {
      return "E";
    }
    return "F";
  }
  static getMessageFiltered(message, filterList) {
    let filteredMessage = message.toLowerCase();
    filterList.split(",").forEach((keyWord) => {
      filteredMessage = filteredMessage.replace(
        new RegExp(keyWord.toLowerCase()),
        ""
      );
    });
    if (message !== filteredMessage) {
      filteredMessage = filteredMessage.trim();
    }
    return filteredMessage;
  }
  static getChangeGrade(changesLength) {
    if (changesLength >= 500) {
      return "A";
    }
    if (changesLength >= 300) {
      return "B";
    }
    if (changesLength >= 100) {
      return "C";
    }
    if (changesLength >= 20) {
      return "D";
    }
    if (changesLength > 0) {
      return "E";
    }
    return "F";
  }
  static getCommitGrade(messageGrade, changeGrade) {
    let messageGradeValue = messageGrade.charCodeAt(0);
    let changeGradeValue = changeGrade.charCodeAt(0);
    let commitGradeValue = (messageGradeValue + changeGradeValue) / 2;
    return String.fromCharCode(commitGradeValue);
  }
  static getRepoGrade(commitGradeList) {
    let gradeSum = 0;
    commitGradeList.forEach((commitGrade) => {
      gradeSum += commitGrade.charCodeAt(0);
    });
    return String.fromCharCode(gradeSum / commitGradeList.length);
  }
  static getAuthorDetails(commitData) {
    let authorDetails = {};
    commitData.forEach((commit) => {
      if (authorDetails[commit?.commitAuthor] === undefined) {
        authorDetails[commit?.commitAuthor] = {
          commitCount: 0,
          commitGrades: [],
          commitSHA: "",
          commitDate: "",
        };
      }
      authorDetails[commit?.commitAuthor].commitCount++;
      authorDetails[commit?.commitAuthor].commitGrades.push(
        commit?.commitGrade
      );
      if (
        authorDetails[commit?.commitAuthor].commitSHA === "" &&
        authorDetails[commit?.commitAuthor].commitDate === ""
      ) {
        authorDetails[commit?.commitAuthor].commitSHA = commit?.sha;
        authorDetails[commit?.commitAuthor].commitDate = commit?.commitDate;
      }
    });
    Object.entries(authorDetails).forEach(([author, authorData]) => {
      authorDetails[author].commitGrades = this.getRepoGrade(
        authorData.commitGrades
      );
    });
    return authorDetails;
  }

  static async getGradeData(
    repoUrl,
    messageFilterList,
    cacheTime,
    token,
    loggedInUser
  ) {
    axios.defaults.headers.common["Authorization"] = "";
    if (token.length > 0) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    let gradeData = await this.getCachedAnalyzeData(
      repoUrl,
      messageFilterList,
      cacheTime,
      loggedInUser
    );
    if (!gradeData) {
      gradeData = await this.getFreshAnalyzeData(
        repoUrl,
        messageFilterList,
        loggedInUser
      );
    }
    return gradeData;
  }
  static async getCachedAnalyzeData(
    repoUrl,
    messageFilterList,
    cacheTime,
    loggedInUser
  ) {
    if (!cacheTime) {
      cacheTime = 0;
    }
    let analyzeData = await analyzeQuery
      .findOne({
        loggedInUser: loggedInUser,
        repo: repoUrl,
        filterList: messageFilterList,
        timeStamp: {
          $gt: new Date(
            new Date().setMinutes(new Date().getMinutes() - cacheTime)
          ),
        },
      })
      .sort({ timeStamp: -1 });
    if (!analyzeData) {
      return null;
    } else {
      return {
        ...JSON.parse(JSON.stringify(analyzeData)),
        isCached: true,
      };
    }
  }
  static async getFreshAnalyzeData(repoUrl, messageFilterList, loggedInUser) {
    let commitsData = await axios.get(
      `https://api.github.com/repos/${repoUrl}/commits?per_page=100`
    );
    commitsData = await commitsData.data;
    const shaList = commitsData.map((commit) => commit.sha);
    const commitData = await Promise.all(
      shaList.map(async (sha) => {
        try {
          const response = await axios.get(
            `https://api.github.com/repos/${repoUrl}/commits/${sha}`
          );
          const data = await response.data;
          return data;
        } catch (error) {
          let errorData = {
            sha: sha,
            error: "Error",
          };
          return errorData;
        }
      })
    );
    let data = commitData?.map((commit) => {
      let filteredMessage, messageGrade, changeGrade;
      if (!commit.error) {
        filteredMessage = this.getMessageFiltered(
          commit?.commit?.message,
          messageFilterList
        );
        messageGrade = this.getMessageGrade(filteredMessage.length);
        changeGrade = this.getChangeGrade(commit.stats.total);
        return {
          sha: commit?.sha,
          commitAuthor: commit?.author?.login,
          commitDate: commit?.commit?.author?.date,
          commitMessage: commit?.commit?.message,
          filteredMessage: filteredMessage,
          totalChanges: commit?.stats?.total,
          messageGrade: messageGrade,
          changeGrade: changeGrade,
          commitGrade: this.getCommitGrade(messageGrade, changeGrade),
        };
      } else {
        return {
          sha: commit?.sha,
          commitAuthor: commit?.error,
          commitDate: commit?.error,
          commitMessage: commit?.error,
          filteredMessage: commit?.error,
          totalChanges: commit?.error,
          messageGrade: commit?.error,
          changeGrade: commit?.error,
          commitGrade: commit?.error,
        };
      }
    });
    const repoGrade = this.getRepoGrade(
      data.map((commit) => commit?.commitGrade)
    );
    let returnData = {
      isCached: false,
      repoData: data,
      repoGrade: repoGrade,
      authorDetails: this.getAuthorDetails(data),
    };
    let auditData = {
      loggedInUser: loggedInUser,
      repo: repoUrl,
      timeStamp: new Date().toISOString(),
      filterList: messageFilterList,
      repoData: returnData.repoData,
      repoGrade: returnData.repoGrade,
      authorGrades: returnData.authorGrades,
      authorDetails: returnData.authorDetails,
    };
    new analyzeQuery(auditData).save();
    return returnData;
  }
}
module.exports = AnalyzeHandler;
