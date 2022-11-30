import React from "react";
import "./BulkRepo.scss";
import { useContext, useEffect } from "react";
import APIHandler from "../../handlers/APIHandler";
import Event from "../../providers/EventProvider";
import Loading from "../../components/Loading";
import { useQuery } from "@tanstack/react-query";
import Configuration from "../../providers/ConfigProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlus, faCheckCircle, faExclamationCircle, faPen } from "@fortawesome/free-solid-svg-icons";
import DateHandler from "../../handlers/DateHandler";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import FlagHandler from "../../handlers/FlagHandler";
import InfoHandler from "../../handlers/InfoHandler";
import useUserInfo from "../../providers/UserProvider";

function BulkRepo() {
  document.title = "Bulk Repository Query | GStat Tracker";
  const { user, loading, isAdmin, logout } = useUserInfo();
  const EventHandler = useContext(Event);
  const Config = useContext(Configuration);
  const [repoList, setRepoList] = React.useState(JSON.parse(Config.getConfig("repoList")));
  const bRepoFormRef = React.useRef(null);
  const [newRepoItem, setNewRepoItem] = React.useState("");
  const [activeTime] = React.useState(Config.getConfig("activeTime"));
  const [fetchData, setFetchData] = React.useState(false);
  const [editMode, setEditMode] = React.useState([]);
  useEffect(() => {
    setEditMode((current) => {
      return repoList.map(() => false);
    });
  }, []);
  const { isLoading: bRepoDataLoading, data: bRepoData } = useQuery(
    ["repo", repoList],
    () => APIHandler.getRepoData(repoList.join(","), Config.getConfig("logTime"), true),
    {
      onSuccess: (data) => {
        if (repoList.length > 0 && data.error) {
          EventHandler.publish("toast", {
            message: data.error,
            type: "danger"
          });
        }
        if (repoList.length > 0 && data.isCached === true) {
          EventHandler.publish("toast", {
            message: InfoHandler.getInfo("fetchedCache"),
            type: "info"
          });
        }
      },
      onSettled: (data) => {
        setFetchData(false);
      },
      refetchOnWindowFocus: false,
      enabled: repoList.length > 0 && fetchData && !!user?.login
    }
  );
  if (loading) {
    return <Loading />;
  }
  if (!user?.login) {
    window.location.pathname = "/fail";
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100 p-3 col-md-6 col-sm-12 gap-5 mx-auto">
      <div className="d-flex flex-column justify-content-center align-items-center transition">
        <form ref={bRepoFormRef} className="primary-color input-group needs-validation row">
          <ol className="list-group col-sm-12 col-md-12 pe-0">
            <div className="input-group w-100">
              <label className="primary-color form-label">
                Search for multiple repository details
                <FontAwesomeIcon className="infoIcon" title={InfoHandler.getInfo("bulkRepoPage")} icon={faCircleInfo} />
              </label>

              {repoList.length > 0 &&
                repoList.map((repo, index) => (
                  <li
                    className="list-group-item dark-background primary-color primary-border primary-shadow w-100"
                    key={index}
                  >
                    <div className="d-flex flex-row w-100 justify-content-between">
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
                            Config.setConfig("repoList", JSON.stringify(repoList));
                          }}
                          onChange={(e) =>
                            setRepoList((current) => {
                              current[index] = e.target.value;
                              return [...current];
                            })
                          }
                        />
                      ) : (
                        <p>{repo}</p>
                      )}
                      <div className="d-flex flex-row align-items-center gap-2">
                        {bRepoDataLoading ? (
                          fetchData ? (
                            <Loading size="sm" />
                          ) : (
                            <></>
                          )
                        ) : (
                          <FontAwesomeIcon
                            icon={
                              (bRepoData?.response ? bRepoData?.response : bRepoData)[index] === null
                                ? faExclamationCircle
                                : faCheckCircle
                            }
                            className={
                              (bRepoData?.response ? bRepoData?.response : bRepoData)[index] === null
                                ? "text-danger"
                                : "text-success"
                            }
                          />
                        )}
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
                            setRepoList((curr) => {
                              curr.splice(index, 1);
                              Config.setConfig("repoList", JSON.stringify(curr));
                              return structuredClone(curr);
                            });
                            setNewRepoItem("");
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              <li className="list-group-item dark-background primary-color primary-shadow w-100">
                <div className="d-flex  flex-row w-100 justify-content-between gap-2">
                  <input
                    type="text"
                    className="form-control dark-background primary-color primary-shadow"
                    value={newRepoItem}
                    onChange={(e) => setNewRepoItem((curr) => e.target.value)}
                  />
                  {newRepoItem !== "" && (
                    <button
                      className="btn"
                      onClick={() => {
                        setRepoList((curr) => {
                          curr.push(newRepoItem);
                          Config.setConfig("repoList", JSON.stringify(curr));
                          return structuredClone(curr);
                        });
                        setNewRepoItem("");
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  )}
                </div>
              </li>
            </div>
          </ol>
          <button
            type="button"
            className="btn btn-primary btn-lg w-100"
            style={{
              borderTopLeftRadius: "0px",
              borderTopRightRadius: "0px",
              borderBottomLeftRadius: "5px",
              borderBottomRightRadius: "5px"
            }}
            onClick={() => {
              setFetchData(true);
            }}
          >
            {fetchData && bRepoDataLoading ? <Loading type="light" size="sm" /> : "Search"}
          </button>
        </form>
      </div>
      {!bRepoDataLoading && !!bRepoData ? (
        <ul className="list-group gap-3  mx-auto col-md-6 w-100">
          <div className="card dark-background primary-border primary-color p-4 gap-3 w-100">
            {(bRepoData.response ? bRepoData.response : bRepoData).map((repo) => {
              if (repo !== null)
                return (
                  <li
                    className="list-group-item dark-background primary-border primary-color border w-100"
                    key={repo.repoName}
                  >
                    <div className="my-2 p-2 form-group w-100">
                      <div className="d-flex flex-row gap-3 justify-content-between">
                        <p>
                          <strong>Repository Name : </strong>{" "}
                          <a href={`/repo?repoUrl=${repo.repoName}`}>{repo.repoName}</a>
                        </p>
                        <h6 title={InfoHandler.getInfo(FlagHandler.getActiveType(repo.commitAt, activeTime))}>
                          {FlagHandler.getFlag(repo.commitAt, activeTime)}
                        </h6>
                      </div>
                      <div className="d-flex flex-row gap-3">
                        <p
                          data-date={DateHandler.getTimeAgo(new Date(repo.commitAt).toISOString())}
                          className="tooltip-custom"
                        >
                          <strong>Last Commit at : </strong> {new Date(repo.commitAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="d-flex flex-row gap-3">
                        <p>
                          <strong>Last Commit Author : </strong>{" "}
                          <a href={`/user?username=${repo.commitAuthor}`}>{repo.commitAuthor}</a>
                        </p>
                      </div>
                      <div className="d-flex flex-row gap-3">
                        <p>
                          <strong>Last Commit Message : </strong> {repo.commitMessage}
                        </p>
                      </div>
                      <div className="d-flex flex-row gap-3">
                        <p className=" w-100 text-wrap">
                          <strong>Last Commit URL : </strong> <a href={repo.commitUrl}>{repo.commitUrl}</a>
                        </p>
                      </div>
                    </div>
                  </li>
                );
              else return <></>;
            })}
          </div>
        </ul>
      ) : (
        <></>
      )}
    </div>
  );
}

export default BulkRepo;
