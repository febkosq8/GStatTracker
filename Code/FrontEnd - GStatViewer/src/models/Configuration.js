class BaseConfig {
  static #instance;
  static getInstance() {
    if (!BaseConfig.#instance) {
      BaseConfig.#instance = new BaseConfig();
    }
    return BaseConfig.#instance;
  }
  #config;
  #initLocalStorage(key, value) {
    localStorage.setItem(key, value);
    return value;
  }
  constructor() {
    this.#config = {
      perPage: localStorage.getItem("perPage")
        ? localStorage.getItem("perPage")
        : this.#initLocalStorage("perPage", 25),
      logTime: localStorage.getItem("logTime")
        ? localStorage.getItem("logTime")
        : this.#initLocalStorage("logTime", 0),
      activeTime: localStorage.getItem("activeTime")
        ? localStorage.getItem("activeTime")
        : this.#initLocalStorage("activeTime", 7),
      repoList: localStorage.getItem("repoList")
        ? localStorage.getItem("repoList")
        : this.#initLocalStorage("repoList", JSON.stringify([])),
      messageFilterList: localStorage.getItem("messageFilterList")
        ? localStorage.getItem("messageFilterList")
        : this.#initLocalStorage("messageFilterList", JSON.stringify([])),
    };
  }
  getConfig(key) {
    return this.#config[key];
  }
  setConfig(key, value) {
    this.#config[key] = value;
    localStorage.setItem(key, value);
  }
  deleteConfig(key) {
    localStorage.removeItem(key);
  }
}
export default BaseConfig;
