import axios from "axios";
axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "https://g-stat-core.herokuapp.com"
    : "http://localhost:3030";
class APIHandler {
  static getHeaders() {
    return {
      Authorization: `JWT ${localStorage.getItem("token")}`,
    };
  }

  static async getUserRepoList(userName, perPage, page, logTime) {
    const response = await axios.get(
      `/user?user=${userName}&perPage=${perPage}&page=${page}&logTime=${logTime}`,
      {
        headers: APIHandler.getHeaders(),
      }
    );
    const data = await response.data;
    return data;
  }

  static async getRepoData(repoUrl, logTime, isBulk = false) {
    const response = await axios.get(
      `/repo?repoUrl=${repoUrl}&logTime=${logTime}&isBulk=${isBulk}`,
      {
        headers: APIHandler.getHeaders(),
      }
    );
    const data = await response.data;
    return data;
  }

  static async getCommit(repoUrl, sha, logTime) {
    const response = await axios.get(
      `/commit?repoUrl=${repoUrl}&sha=${sha}&logTime=${logTime}`,
      {
        headers: APIHandler.getHeaders(),
      }
    );
    const data = await response.data;
    return data;
  }

  static async getRepoCommit(repoUrl, perPage, page, logTime) {
    const response = await axios.get(
      `/repoCommit?repoUrl=${repoUrl}&perPage=${perPage}&page=${page}&logTime=${logTime}`,
      {
        headers: APIHandler.getHeaders(),
      }
    );
    const data = await response.data;
    return data;
  }

  static async logQuery(type) {
    if (type) {
      const response = await axios.get(`/audit/${type}`, {
        headers: APIHandler.getHeaders(),
      });
      const data = await response.data;
      return data;
    } else {
      return "No type specified";
    }
  }

  static async getAnalyze(repoUrl, messageFilterList, logTime) {
    const response = await axios.get(
      `/analyze/analyzeRepo?repoUrl=${repoUrl}&messageFilterList=${messageFilterList}&logTime=${logTime}`,
      {
        headers: APIHandler.getHeaders(),
      }
    );
    const data = await response.data;
    return data;
  }

  static async getRateLimit() {
    const response = await axios.get(`/config/rateLimit`, {
      headers: APIHandler.getHeaders(),
    });
    const data = await response.data;
    return data;
  }

  static async checkAdmin() {
    const response = await axios.get(`/auth/checkAdmin`, {
      headers: APIHandler.getHeaders(),
    });
    const data = await response.data;
    return data;
  }

  static async getLogsCount() {
    const response = await axios.get(`/audit/count`, {
      headers: APIHandler.getHeaders(),
    });
    const data = await response.data;
    return data;
  }

  static async deleteLog(type) {
    await axios.get(`/config/deleteLog?type=${type}`, {
      headers: APIHandler.getHeaders(),
    });
  }

  static async checkStatus() {
    try {
      const response = await axios.get(`/auth/status`);
      const status = await response.status;
      return status;
    } catch (error) {
      return 500;
    }
  }

  static async getAuthUrl(type) {
    const response = await axios.get(`/auth/authUrl?type=${type}`);
    const data = await response.data;
    return data;
  }

  static async getAuthToken(code, state) {
    const response = await axios.get(
      `/auth/processAuth?code=${code}&state=${state}`
    );
    const data = await response.data;
    return data;
  }

  static async getUser() {
    const response = await axios.get(`/auth/user`, {
      headers: APIHandler.getHeaders(),
    });
    const data = await response.data;
    return data;
  }

  static async logout() {
    const response = await axios.get(`/auth/logout`, {
      headers: APIHandler.getHeaders(),
    });
    const data = await response.data;
    return data;
  }
}
export default APIHandler;
