import React, { useContext } from "react";
import "./Config.scss";
import APIHandler from "../../handlers/APIHandler";
import { useQuery } from "@tanstack/react-query";
import Accordion from "../../components/Accordion";
import Configuration from "../../providers/ConfigProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faTrashAlt,
  faPlus,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import DateHandler from "../../handlers/DateHandler";
import DeleteButton from "../../components/DeleteButton";
import FlagHandler from "../../handlers/FlagHandler";
import InfoHandler from "../../handlers/InfoHandler";
import useUserInfo from "../../providers/UserProvider";
import { useEffect, useState } from "react";
function Config() {
  document.title = "Configuration | GStat Tracker";
  const { user, loading, isAdmin, logout } = useUserInfo();
  const DefaultConfig = useContext(Configuration);
  const [logTime, setLogTime] = React.useState(
    DefaultConfig.getConfig("logTime")
  );
  const [rateData, setRateData] = useState(null);
  useQuery(["rateData"]);
  const getUser = async () => {
    const user = await APIHandler.getUser();
    return user;
  };
  const getRateData = async () => {
    const data = await APIHandler.getRateLimit();
    setRateData(data);
    return data;
  };
  const [activeTime, setActiveTime] = React.useState(
    DefaultConfig.getConfig("activeTime")
  );
  const [editMode, setEditMode] = React.useState([]);

  const [messageFilterList, setMessageFilterList] = React.useState(
    JSON.parse(DefaultConfig.getConfig("messageFilterList"))
  );
  useEffect(() => {
    setEditMode((current) => {
      return messageFilterList.map(() => false);
    });
    getRateData();
  }, []);
  const [newMessageFilterItem, setNewMessageFilterItem] = React.useState("");
  const logTimeRef = React.useRef(null);

  const activeTimeRef = React.useRef(null);
  const [perPage, setPerPage] = React.useState(
    DefaultConfig.getConfig("perPage")
  );

  const { isLoading: serverStatusLoading, data: serverStatus } = useQuery(
    ["status"],
    APIHandler.checkStatus
  );

  return (
    <div className="d-flex flex-column align-items-end w-100 p-5">
      <div className="d-flex flex-row gap-4">
        <button className="btn btn-dark" type="button" disabled>
          <h6>Server Status </h6>
          {!serverStatusLoading ? (
            FlagHandler.getStatus(serverStatus)
          ) : (
            <div className="spinner-grow spinner-grow-sm"></div>
          )}
        </button>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center w-100">
        <div className="d-flex flex-column justify-content-start align-items-center col-md-6 col-sm-12">
          <Accordion
            data={[
              {
                title: (
                  <div className="d-flex w-100 pe-4 align-items-center flex-row justify-content-between">
                    <h6>Default Configuration</h6>
                    <FontAwesomeIcon
                      icon={faCircleInfo}
                      title={InfoHandler.getInfo("defaultConfig")}
                    />
                  </div>
                ),
                content: (
                  <div className="w-auto">
                    <label className="fw-bold form-label">
                      Max entries per page
                      <FontAwesomeIcon
                        className="infoIcon"
                        title={InfoHandler.getInfo("maxPerPage")}
                        icon={faCircleInfo}
                      />
                    </label>

                    <select
                      className="form-select dark-background primary-color"
                      value={perPage}
                      onChange={(e) => {
                        DefaultConfig.setConfig("perPage", e.target.value);
                        setPerPage((current) => e.target.value);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <label className="fw-bold form-label">
                      Time allowed to fetch from Server Log Database
                      <FontAwesomeIcon
                        className="infoIcon"
                        icon={faCircleInfo}
                        title={InfoHandler.getInfo("cacheFetch")}
                      />
                    </label>

                    <input
                      className={`form-control`}
                      ref={logTimeRef}
                      type="text"
                      name="logTime"
                      value={logTime}
                      placeholder="Default is 0 (Disabled)"
                      onChange={(e) => {
                        DefaultConfig.setConfig("logTime", e.target.value);
                        setLogTime((current) => e.target.value);
                      }}
                    />
                    <label className="fw-bold form-label">
                      Mark an repository as active
                      <FontAwesomeIcon
                        className="infoIcon"
                        icon={faCircleInfo}
                        title={InfoHandler.getInfo("repoActive")}
                      />
                    </label>
                    <input
                      className={`form-control`}
                      ref={activeTimeRef}
                      type="text"
                      name="activeTime"
                      value={activeTime}
                      placeholder="Default is 7"
                      onChange={(e) => {
                        DefaultConfig.setConfig("activeTime", e.target.value);
                        setActiveTime((current) => e.target.value);
                      }}
                    />
                  </div>
                ),
                visible: true,
              },
              {
                title: (
                  <div className="d-flex w-100 pe-4 align-items-center flex-row justify-content-between">
                    <h6>Github API Status</h6>
                    <FontAwesomeIcon
                      icon={faCircleInfo}
                      title={InfoHandler.getInfo("limitStatus")}
                    />
                  </div>
                ),
                content: (
                  <div className="p-4 w-100">
                    <p>
                      <strong>Max Limit : </strong> {rateData?.maxLimit}
                    </p>
                    <p>
                      <strong>Used Limit : </strong> {rateData?.usedLimit}
                    </p>
                    <p>
                      <strong>Remaining Limit : </strong>{" "}
                      {rateData?.remainingLimit}
                    </p>
                    <p
                      data-date={
                        rateData?.resetLimit
                          ? DateHandler.getTimeAgo(
                              new Date(rateData?.resetLimit)?.toISOString()
                            )
                          : ""
                      }
                      className="tooltip-custom"
                    >
                      <strong>Limit Resets on : </strong>
                      {new Date(rateData?.resetLimit)?.toLocaleString()}
                    </p>
                  </div>
                ),
                visible: true,
              },
              {
                title: (
                  <div className="d-flex w-100 pe-4 align-items-center flex-row justify-content-between">
                    <h6>Commit Message Filter</h6>
                    <FontAwesomeIcon
                      icon={faCircleInfo}
                      title={InfoHandler.getInfo("messageFilter")}
                    />
                  </div>
                ),
                content: (
                  <ol className="list-group  w-100">
                    {messageFilterList.length > 0 &&
                      messageFilterList.map((repo, index) => (
                        <li
                          className="list-group-item dark-background primary-border primary-color w-100"
                          key={index}
                        >
                          <div className="d-flex flex-row dark-background primary-border primary-color w-100 justify-content-between">
                            {editMode?.[index] ? (
                              <input
                                type="text"
                                className="form-control"
                                value={repo}
                                onBlur={() => {
                                  setEditMode((current) => {
                                    const newCurrent = [...current];
                                    newCurrent[index] = false;
                                    return newCurrent;
                                  });
                                  DefaultConfig.setConfig(
                                    "messageFilterList",
                                    JSON.stringify(messageFilterList)
                                  );
                                }}
                                onChange={(e) =>
                                  setMessageFilterList((current) => {
                                    current[index] = e.target.value;
                                    return [...current];
                                  })
                                }
                              />
                            ) : (
                              <p>{repo}</p>
                            )}
                            <div className="d-flex flex-row align-items-center gap-2">
                              <button
                                className="btn"
                                disabled={editMode.some((e) => e === true)}
                                onClick={() => {
                                  setEditMode((curr) => {
                                    const newCurrent = [...curr];
                                    newCurrent[index] = true;
                                    return newCurrent;
                                  });
                                }}
                              >
                                <FontAwesomeIcon icon={faPen} />
                              </button>
                              <button
                                className="btn"
                                disabled={editMode.some((e) => e === true)}
                                onClick={() => {
                                  setMessageFilterList((curr) => {
                                    curr.splice(index, 1);
                                    DefaultConfig.setConfig(
                                      "messageFilterList",
                                      JSON.stringify(curr)
                                    );
                                    return structuredClone(curr);
                                  });
                                  setNewMessageFilterItem("");
                                }}
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    <li className="list-group-item dark-background primary-border primary-color w-100">
                      <div className="d-flex flex-row w-100 justify-content-between gap-2">
                        <input
                          type="text"
                          className="form-control"
                          value={newMessageFilterItem}
                          onChange={(e) =>
                            setNewMessageFilterItem((curr) => e.target.value)
                          }
                        />
                        {newMessageFilterItem !== "" && (
                          <button
                            className="btn"
                            onClick={() => {
                              setMessageFilterList((curr) => {
                                curr.push(newMessageFilterItem);
                                DefaultConfig.setConfig(
                                  "messageFilterList",
                                  JSON.stringify(curr)
                                );
                                return structuredClone(curr);
                              });
                              setNewMessageFilterItem("");
                              setEditMode((current) => {
                                return messageFilterList.map(() => false);
                              });
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        )}
                      </div>
                    </li>
                  </ol>
                ),
                visible: true,
              },
              {
                title: (
                  <div className="d-flex w-100 pe-4 align-items-center flex-row justify-content-between">
                    <h6>Delete Log</h6>
                    <FontAwesomeIcon
                      icon={faCircleInfo}
                      title={InfoHandler.getInfo("deleteLog")}
                    />
                  </div>
                ),
                content: (
                  <div className="w-100 h-100 row g-3">
                    <div className="col-sm-12 col-md-6 g-2">
                      <DeleteButton
                        className="w-100"
                        text={"User Log"}
                        type={"user"}
                        scope="log"
                      />
                      <DeleteButton
                        className="w-100"
                        text={"Repository Log"}
                        type={"repo"}
                        scope="log"
                      />
                      <DeleteButton
                        className="w-100"
                        text={"Bulk Repository Log"}
                        type={"bulkRepo"}
                        scope="log"
                      />
                      <DeleteButton
                        className="w-100"
                        text={"Logged Users Log"}
                        type={"loggedUsers"}
                        scope="log"
                      />
                    </div>

                    <div className="col-sm-12 col-md-6 g-2">
                      <DeleteButton
                        className="w-100"
                        text={"Individual Commit Log"}
                        type={"commit"}
                        scope="log"
                      />
                      <DeleteButton
                        className="w-100"
                        text={"Repository Commit Log"}
                        type={"repoCommit"}
                        scope="log"
                      />
                      <DeleteButton
                        className="w-100"
                        text={"Analyze Log"}
                        type={"analyze"}
                        scope="log"
                      />
                    </div>
                  </div>
                ),
                visible: isAdmin,
              },
              {
                title: (
                  <div className="d-flex w-100 pe-4 align-items-center flex-row justify-content-between">
                    <h6>Delete Local Storage</h6>
                    <FontAwesomeIcon
                      icon={faCircleInfo}
                      title={InfoHandler.getInfo("deleteLocal")}
                    />
                  </div>
                ),
                content: (
                  <div className="col-sm-12 col-md-6 row g-3">
                    <DeleteButton
                      className="w-100"
                      text={"Default Configuration"}
                      type={"config"}
                      scope="local"
                    />

                    <DeleteButton
                      className="w-100"
                      text={"Github Token"}
                      type={"token"}
                      scope="local"
                    />

                    <DeleteButton
                      className="w-100"
                      text={"Stored Lists"}
                      type={"list"}
                      scope="local"
                    />
                  </div>
                ),
                visible: true,
              },
              {
                title: (
                  <div className="d-flex w-100 pe-4 align-items-center flex-row justify-content-between">
                    <h6>About GStat Tracker</h6>
                    <FontAwesomeIcon
                      icon={faCircleInfo}
                      title={InfoHandler.getInfo("aboutGStat")}
                    />
                  </div>
                ),
                content: (
                  <div className="p-4 w-100">
                    <p>
                      Current Version : <strong>1.5.0.pub</strong>
                    </p>
                    <p>
                      Latest Change in this version :{" "}
                      <strong>Mobile Ready Pages & Public release</strong>
                    </p>
                  </div>
                ),
                visible: true,
              },
            ]}
            className="w-100"
          />
        </div>
      </div>
    </div>
  );
}

export default Config;
