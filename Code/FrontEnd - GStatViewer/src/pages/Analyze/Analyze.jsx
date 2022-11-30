import React from "react";
import "./Analyze.scss";
import { useEffect, useContext } from "react";
import APIHandler from "../../handlers/APIHandler";
import Event from "../../providers/EventProvider";
import Loading from "../../components/Loading";
import { useMutation, useQuery } from "@tanstack/react-query";
import Accordion from "../../components/Accordion";
import Configuration from "../../providers/ConfigProvider";
import DateHandler from "../../handlers/DateHandler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import InfoHandler from "../../handlers/InfoHandler";
import useUserInfo from "../../providers/UserProvider";

function Analyze() {
  document.title = "Analyze Repository | GStat Tracker";
  const { user, loading, isAdmin, logout } = useUserInfo();
  const EventHandler = useContext(Event);
  const Config = useContext(Configuration);
  const [fetchListData, setFetchListData] = React.useState(false);
  const [repoUrl, setRepoUrl] = React.useState(
    new URLSearchParams(document.location.search).get("repoUrl") ?? ""
  );
  const [messageFilterList, setMessageFilterList] = React.useState(
    JSON.parse(Config.getConfig("messageFilterList"))
  );
  const repoFormRef = React.useRef(null);
  const repoInputRef = React.useRef(null);
  const { isLoading: gradeDataLoading, data: gradeData } = useQuery(
    ["grade", repoUrl],
    () =>
      APIHandler.getAnalyze(
        repoUrl,
        messageFilterList,
        Config.getConfig("logTime")
      ),
    {
      onSuccess: (data) => {
        if (repoUrl !== "" && data.error) {
          EventHandler.publish("toast", {
            message: data.error,
            type: "danger",
          });
        }
        if (repoUrl !== "" && data.isCached === true) {
          EventHandler.publish("toast", {
            message: InfoHandler.getInfo("fetchedCache"),
            type: "info",
          });
        }
        setFetchListData(false);
      },
      refetchOnWindowFocus: false,
      enabled: repoUrl !== "" && fetchListData && !loading && !!user?.login,
    }
  );

  useEffect(() => {
    repoInputRef.current.value = repoUrl;
    if (repoUrl !== "") {
      handleSubmit();
    }
  }, []);
  if (loading) {
    return <Loading />;
  }
  if (!user?.login) {
    window.location.pathname = "/fail";
  }
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setFetchListData(true);
    setRepoUrl((curr) => repoInputRef.current.value);
  };
  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100 col-md-8 col-sm-12 transition p-3 mx-auto">
      <form
        ref={repoFormRef}
        className="input-group needs-validation w-100"
        onSubmit={handleSubmit}
      >
        <label className="primary-color form-label">
          Analyze a specific repository
          <FontAwesomeIcon
            className="infoIcon"
            title={InfoHandler.getInfo("gradePage")}
            icon={faCircleInfo}
          />
        </label>

        <div className="input-group">
          <input
            className="w-25 form-control dark-background primary-color"
            ref={repoInputRef}
            type="text"
            name="repoUrl"
            title="Enter the GitHub Repository Directory"
            placeholder="GitHub Repo Directory"
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "5rem" }}
          >
            {fetchListData ? <Loading type="light" size="sm" /> : "Search"}
          </button>
        </div>
      </form>
      {!gradeDataLoading && !!gradeData && gradeData?.repoData?.length > 0 ? (
        <div className="dark-background primary-border primary-color card mt-3 w-100 p-2">
          <div>
            <span>
              A total of latest <strong>{gradeData?.repoData?.length}</strong>{" "}
              commits from{" "}
              <a className="fw-light" href={`/repo?repoUrl=${repoUrl}`}>
                {repoUrl}
              </a>{" "}
              were analyzed.
            </span>
            <br></br>
            <p>
              This repository's overall Grade is{" "}
              <strong>{gradeData.repoGrade}</strong>
            </p>
          </div>
          <Accordion
            data={[
              {
                title: "Statistics per Author",
                content: Object.entries(gradeData.authorDetails).map(
                  ([key, value]) => {
                    return value.commitDate === "Error" ? (
                      <></>
                    ) : (
                      <div className=" ps-2 pt-2 d-flex flex-column flex-wrap w-100 card dark-background primary-border mb-2">
                        <div className="d-flex flex-row gap-3 w-100">
                          <p>
                            <strong>Author : </strong>
                          </p>
                          {key !== "undefined" ? (
                            <a
                              className="fw-light"
                              href={`/user?username=${key}`}
                            >
                              {key}
                            </a>
                          ) : (
                            <>Not Available</>
                          )}
                        </div>
                        <p className="w-100 d-flex flex-row flex-wrap w-100">
                          <strong>Latest Commit SHA :</strong>
                          <a
                            className="text-wrap w-75"
                            href={`/commit?repoUrl=${repoUrl}&sha=${value.commitSHA}`}
                          >
                            {value.commitSHA}
                          </a>
                        </p>
                        <div
                          data-date={DateHandler.getTimeAgo(
                            new Date(value.commitDate).toISOString()
                          )}
                          className="d-flex flex-row gap-3 tooltip-custom"
                        >
                          <p>
                            <strong>Latest Commit Date : </strong>{" "}
                            {new Date(value.commitDate).toLocaleString()}
                          </p>
                        </div>
                        <div className="d-flex flex-row gap-3">
                          <p>
                            <strong>Total Unique Commits : </strong>
                            {value.commitCount}
                          </p>
                        </div>
                        <div className="d-flex flex-row gap-3">
                          <p>
                            <strong>Average Commit Grade : </strong>{" "}
                            {value.commitGrades}
                          </p>
                        </div>
                      </div>
                    );
                  }
                ),
              },
              {
                title: "Statistics per Commit",
                content: gradeData.repoData.map((commit) => (
                  <div className="ps-2 pt-2 d-flex flex-column flex-wrap w-100 card dark-background primary-border mb-2">
                    <p className="d-flex flex-row flex-wrap gap-3 w-100">
                      <strong>SHA : </strong>
                      <a
                        className="text-wrap w-75"
                        href={`/commit?repoUrl=${repoUrl}&sha=${commit.sha}`}
                      >
                        {commit.sha}
                      </a>
                    </p>
                    {commit.commitDate === "Error" ? (
                      <strong>Commit Data Not Available</strong>
                    ) : (
                      <>
                        <div className="d-flex flex-row gap-3">
                          <p>
                            <strong>Author :</strong>{" "}
                          </p>
                          {commit.commitAuthor ? (
                            <>
                              <a
                                className="fw-light"
                                href={`/user?username=${commit.commitAuthor}`}
                              >
                                {commit.commitAuthor}
                              </a>
                            </>
                          ) : (
                            <>Not Available</>
                          )}
                        </div>
                        <div className="d-flex flex-row gap-3">
                          <strong>Date : </strong>
                          <p
                            data-date={DateHandler.getTimeAgo(
                              new Date(commit.commitDate).toISOString()
                            )}
                            className="fw-light tooltip-custom"
                          >
                            {new Date(commit.commitDate).toLocaleString()}
                          </p>
                        </div>
                        <p className="d-flex flex-row gap-3 flex-wrap w-100">
                          <strong>Message : </strong>
                          <span className="text-wrap w-75">
                            {commit.commitMessage}
                          </span>
                        </p>
                        <div
                          data-date={commit.filteredMessage}
                          className="d-flex flex-row gap-3 tooltip-custom"
                        >
                          <strong>Message Grade : </strong>
                          <p className="fw-light">{commit.messageGrade}</p>
                        </div>
                        <div className="d-flex flex-row gap-3">
                          <p>
                            <strong>Total Changes : </strong>{" "}
                            {commit.totalChanges}
                          </p>
                        </div>
                        <div className="d-flex flex-row gap-3">
                          <p>
                            <strong>Changes Grade : </strong>{" "}
                            {commit.changeGrade}
                          </p>
                        </div>
                        <div className="d-flex flex-row gap-3">
                          <p>
                            <strong>Commit Grade : </strong>{" "}
                            {commit.commitGrade}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )),
              },
            ]}
            className="w-100"
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Analyze;
