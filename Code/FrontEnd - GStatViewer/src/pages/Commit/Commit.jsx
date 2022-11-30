import React from "react";
import "./Commit.scss";
import { useEffect, useContext } from "react";
import APIHandler from "../../handlers/APIHandler";
import Event from "../../providers/EventProvider";
import Loading from "../../components/Loading";
import { useMutation, useQuery } from "@tanstack/react-query";
import Configuration from "../../providers/ConfigProvider";
import DateHandler from "../../handlers/DateHandler";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoHandler from "../../handlers/InfoHandler";
import useUserInfo from "../../providers/UserProvider";

function Commit() {
  document.title = "Individual Commit Query | GStat Tracker";
  const { user, loading, isAdmin, logout } = useUserInfo();
  const EventHandler = useContext(Event);
  const Config = useContext(Configuration);
  const [fetchListData, setFetchListData] = React.useState(false);
  const [repoUrl, setRepoUrl] = React.useState(new URLSearchParams(document.location.search).get("repoUrl") ?? "");
  const [sha, setSha] = React.useState(new URLSearchParams(document.location.search).get("sha") ?? "");

  const repoFormRef = React.useRef(null);
  const repoInputRef = React.useRef(null);
  const shaInputRef = React.useRef(null);
  const { isLoading: commitDataLoading, data: commitData } = useQuery(
    ["commit", repoUrl, sha],
    () => APIHandler.getCommit(repoUrl, sha, Config.getConfig("logTime")),
    {
      onSuccess: (data) => {
        if (repoUrl !== "" && sha !== "" && data.error) {
          EventHandler.publish("toast", {
            message: data.error,
            type: "danger"
          });
        }
        if (repoUrl !== "" && sha !== "" && data.isCached === true) {
          EventHandler.publish("toast", {
            message: InfoHandler.getInfo("fetchedCache"),
            type: "info"
          });
        }
        setFetchListData(false);
      },
      refetchOnWindowFocus: false,
      enabled: repoUrl !== "" && sha !== "" && fetchListData && !loading && !!user?.login
    }
  );
  useEffect(() => {
    repoInputRef.current.value = repoUrl;
    shaInputRef.current.value = sha;
    if (repoUrl !== "" && sha !== "") {
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
    setSha((curr) => shaInputRef.current.value);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100 transition p-3 col-sm-12 col-md-8 mx-auto ">
      <form ref={repoFormRef} className="needs-validation row " onSubmit={handleSubmit}>
        <label className="primary-color form-label">
          Search for a specific repository commit
          <FontAwesomeIcon className="infoIcon" title={InfoHandler.getInfo("commitPage")} icon={faCircleInfo} />
        </label>
        <div className="input-group">
          <a className="input-group-text dark-background primary-color pe-none text-decoration-none">github.com/</a>
          <input
            className="form-control dark-background primary-color"
            ref={repoInputRef}
            type="text"
            name="repoUrl"
            title="Enter the GitHub Repository Directory"
            placeholder="GitHub Repo Directory"
            required
          />
          <input
            className="form-control dark-background primary-color"
            ref={shaInputRef}
            type="text"
            name="sha"
            title="Enter the Commit SHA"
            placeholder="SHA"
            required
          />
          <button type="submit" className="btn btn-primary" style={{ width: "5rem" }}>
            {fetchListData ? <Loading type="light" size="sm" /> : "Search"}
          </button>
        </div>
      </form>
      {!commitDataLoading && !!commitData?.files ? (
        <div className="dark-background primary-border primary-color card mt-3 w-100 p-1  shadow-lg ">
          <div className="my-2 p-2 col d-flex flex-column gap-3 w-100">
            <div className="d-flex flex-row gap-3 w-100">
              <strong>SHA :</strong>
              <span className="w-75 text-wrap">{commitData.sha}</span>
            </div>
            <div className="d-flex flex-row gap-3 w-100 ">
              <strong>Repository :</strong>
              <a className="fw-light text-wrap" href={`/repo?repoUrl=${repoUrl}`}>
                {repoUrl}
              </a>
            </div>
            <div
              data-date={DateHandler.getTimeAgo(new Date(commitData.commitDate).toISOString())}
              className="d-flex flex-row gap-3 tooltip-custom"
            >
              <strong>Date :</strong>
              <span className="fw-light">{new Date(commitData.commitDate).toLocaleString()}</span>
            </div>
            <div className="d-flex flex-row gap-3 text-truncate">
              <strong>Author :</strong>{" "}
              {commitData.commitAuthor ? (
                <a className="fw-light" href={`/user?username=${commitData.commitAuthor}`}>
                  {commitData.commitAuthor}
                </a>
              ) : (
                <>Not Available</>
              )}
            </div>
            <div className="d-flex flex-row gap-3 w-100">
              <strong className="text-nowrap">Message :</strong>
              <span className="text-wrap fw-light">{commitData.commitMessage}</span>
            </div>
            <div className="d-flex flex-row gap-3 ">
              <strong>Additions :</strong> {commitData.additions}
            </div>
            <div className="d-flex flex-row gap-3">
              <strong>Deletions :</strong> {commitData.deletions}
            </div>
            <div className="d-flex flex-row gap-3">
              <strong>Total Changes :</strong> {commitData.totalChanges}
            </div>
            <div className="table-responsive">
              <table className="primary-border primary-color table table-bordered table-hover caption-top">
                <caption>
                  <strong className="primary-color">Files Change History</strong>
                </caption>
                <thead>
                  <tr>
                    <td>
                      <strong>File Name</strong>
                    </td>
                    <td>
                      <strong>Change Type</strong>
                    </td>
                    <td>
                      <strong>Additions</strong>
                    </td>
                    <td>
                      <strong>Deletions</strong>
                    </td>
                    <td>
                      <strong>Total Changes</strong>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {commitData.files.map((file) => {
                    return (
                      <tr>
                        <td>
                          <a href={file.url}>{file.name}</a>
                        </td>
                        <td>{file.changeType}</td>
                        <td>{file.additions}</td>
                        <td>{file.deletions}</td>
                        <td>{file.totalChanges}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Commit;
