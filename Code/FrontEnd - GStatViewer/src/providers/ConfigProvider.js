import React, { createContext } from "react";

import BaseConfig from "../models/Configuration";
const Configuration = createContext();
const ConfigProvider = (props) => (
  <Configuration.Provider value={BaseConfig.getInstance()}>
    {props.children}
  </Configuration.Provider>
);
export { ConfigProvider };
export default Configuration;
