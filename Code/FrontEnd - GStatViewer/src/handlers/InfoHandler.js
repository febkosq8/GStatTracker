class InfoHandler {
  static getInfo(type) {
    let infoMap = {
      newUser:
        "New users to GStatTracker must follow this login method to install our GitHub App inorder to gain full access",
      existingUser:
        "Users that already have used GStatTracker before, can use this login method",
      userPage:
        "Find the list of repositories avaiable for a GitHub User. Required Input : GitHub Username (Username)",
      whatRepoIcon:
        "This shows if a repository is active or not. Configure this aspect in Configuration",
      activeRepoIcon:
        "This repository seems to be active. Configure this aspect in Configuration",
      semiActiveRepoIcon:
        "This repository falls under active category but might lose it soon. Configure this aspect in Configuration",
      inActiveRepoIcon:
        "This repository seems to be not active. Configure this aspect in Configuration",
      repoPage:
        "Find the details of a particular repository. Required Input : GitHub Repository Directory (Username/RepositoryName)",
      bulkRepoPage:
        "Find the details of multiple repositories. Required Input : GitHub Repository Directories (Username/RepositoryName)",
      commitPage:
        "Find the details of a particular commit made to a repository. Required Input : GitHub Repository Directory & Commit SHA (Username/RepositoryName, SHA)",
      repoCommitPage:
        "Find the list of commit's made to a repository. Required Input : GitHub Repository Directory (Username/RepositoryName)",
      analyzePage:
        "Analyze of a particular repository using various factors. Required Input : GitHub Repository Directory (Username/RepositoryName)",
      defaultConfig: "Set the default values of GStat Tracker",
      maxPerPage: "Set the maximum number of entries allowed per page",
      fetchedCache: "This request was fulfilled from a Server Log entry",
      cacheFetch:
        "Set the maximum amount in minutes to allowing fetching data from Server Log database when available",
      repoActive:
        "Set the maximum amount in days to classify a Repository as active based on its last commit date",
      limitStatus:
        "Get the Latest GitHub REST API limit status. The Authorised Limit is about 5000 per hour & the Unauthorised Limit is about 60 per hour",
      messageFilter:
        "Set the list of phrases to be filtered out when analyzing a repository commit messages",
      deleteLog:
        "Delete the whole log instance from the server. Warning : Data deletion is IRREVERSIBLE !",
      deleteLocal:
        "Delete the current instance for items stored in the browsers local storage",
      aboutGStat: "Know more about this application",
      page: "Sample Page Data",
    };
    return infoMap[type];
  }
}
export default InfoHandler;
