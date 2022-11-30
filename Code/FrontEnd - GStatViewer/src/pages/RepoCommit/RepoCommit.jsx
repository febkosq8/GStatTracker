import React from "react";
import "./RepoCommit.scss";
import { useEffect, useContext } from "react";
import APIHandler from "../../handlers/APIHandler";
import Event from "../../providers/EventProvider";
import Loading from "../../components/Loading";
import randomColor from "randomcolor";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import Configuration from "../../providers/ConfigProvider";
import DateHandler from "../../handlers/DateHandler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import InfoHandler from "../../handlers/InfoHandler";
import useUserInfo from "../../providers/UserProvider";

function RepoCommit() {
  document.title = "Repository Commit's Query | GStat Tracker";
  const { user, loading, isAdmin, logout } = useUserInfo();
  const EventHandler = useContext(Event);
  const Config = useContext(Configuration);
  const [fetchListData, setFetchListData] = React.useState(false);
  const [repoUrl, setRepoUrl] = React.useState(new URLSearchParams(document.location.search).get("repoUrl") ?? "");
  const [perPage, setPerPage] = React.useState(localStorage.getItem("perPage"));
  const [page, setPage] = React.useState(1);
  const repoForm = React.useRef(null);
  const repoInputRef = React.useRef(null);
  const [filteredAuthor, setFilteredAuthor] = React.useState("");
  const [filteredData, setFilteredData] = React.useState([]);
  const { isLoading: commitsDataLoading, data: commitsData } = useQuery(
    ["commits", repoUrl, perPage, page],
    () => APIHandler.getRepoCommit(repoUrl, perPage, page, Config.getConfig("logTime")),
    {
      onSuccess: (data) => {
        setFilteredAuthor("");
        if (repoUrl !== "" && data.error) {
          EventHandler.publish("toast", {
            message: data.error,
            type: "danger"
          });
        }
        if (repoUrl !== "" && data.isCached == true) {
          EventHandler.publish("toast", {
            message: InfoHandler.getInfo("fetchedCache"),
            type: "info"
          });
        }
        setFetchListData(false);
      },
      refetchOnWindowFocus: false,
      enabled: repoUrl !== "" && fetchListData
    }
  );
  useEffect(() => {
    if (commitsData && commitsData.response) {
      const filtered = commitsData.response.filter(
        (item) => item.commitAuthor === filteredAuthor || filteredAuthor === ""
      );
      setFilteredData(filtered);
    }
  }, [commitsDataLoading, commitsData, filteredAuthor]);
  useEffect(() => {
    repoInputRef.current.value = repoUrl;
    if (repoUrl !== "") {
      handleSubmit();
    }
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setFetchListData(true);
    setRepoUrl((curr) => repoInputRef.current.value);
  };
  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100 transition p-3 mx-auto col">
      <form ref={repoForm} className="w-100 row g-3 justify-content-center" onSubmit={handleSubmit}>
        <div className="mb-3 col-sm-12 col-md-7">
          <label className="primary-color form-label">
            Search for all commits in a repository
            <FontAwesomeIcon className="infoIcon" title={InfoHandler.getInfo("commitsPage")} icon={faCircleInfo} />
          </label>
          <div className="input-group">
            <h6 className="input-group-text dark-background primary-color needs-validation text-decoration-none mb-0">
              github.com/
            </h6>
            <input
              className={`form-control dark-background primary-color`}
              ref={repoInputRef}
              type="text"
              name="repoUrl"
              title="Enter the GitHub Repository Directory"
              placeholder="GitHub Repository Directory"
              required
            />
            <button type="submit" className="btn btn-primary" style={{ width: "5rem" }}>
              {fetchListData ? <Loading type="light" size="sm" /> : "Search"}
            </button>
          </div>
        </div>
        <div className="col-sm-12 col-md-2">
          <label className="primary-color form-label">Max Entries Per Page</label>
          <select
            className="form-select dark-background primary-color"
            value={perPage}
            onChange={(e) => {
              setPerPage((current) => e.target.value);
              setFetchListData(true);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        {commitsData?.response ? (
          <>
            <div className="col-sm-12 col-md-4">
              <label className="primary-color form-label">Showing Page</label>
              <nav className="w-100">
                <ul className="pagination input-group w-100" style={{ cursor: "pointer" }}>
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <a
                      className="page-link "
                      onClick={() => {
                        setPage((current) => current - 1);
                        setFetchListData(true);
                      }}
                    >
                      Previous
                    </a>
                  </li>
                  <select
                    className="form-select dark-background primary-color h-50"
                    value={page}
                    onChange={(e) => {
                      setPage((current) => parseInt(e.target.value));
                      setFetchListData(true);
                    }}
                  >
                    {Array.from(Array(Math.min(commitsData?.lastPage, 1000 / perPage)).keys()).map((i) => (
                      <option key={i} value={i + 1} selected={page === i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <p className="input-group-text dark-background primary-color h-50">
                    of {Math.min(commitsData?.lastPage, 1000 / perPage)}
                  </p>
                  <li
                    className={`page-item ${
                      page === Math.min(commitsData?.lastPage, 1000 / perPage) ? "disabled" : ""
                    }`}
                  >
                    <a
                      className="page-link"
                      onClick={() => {
                        setPage((current) => current + 1);
                        setFetchListData(true);
                      }}
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="col-sm-12 col-md-4 h-75">
              <label className="primary-color form-label">Filter by Author</label>
              <select
                className="form-select dark-background primary-color h-50"
                value={filteredAuthor}
                onChange={(e) => setFilteredAuthor((current) => e.target.value)}
              >
                <option key={0} value="">
                  All Authors
                </option>
                {commitsData.authorList.map((author, index) => (
                  <option key={index + 1} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : null}
      </form>
      {!commitsDataLoading && !!commitsData?.response && commitsData.response.length > 0 ? (
        <div className="dark-background primary-border primary-color row card mt-3 col-sm-12 col-md-8 w-100 gap-3 p-3 w-100 shadow-lg">
          <p>Currently showing a total of {filteredData.length} commits</p>
          <div className="w-100">
            <strong>Commits Graph:</strong>
            <button
              className="btn btn-sm btn-primary ms-2 "
              style={{ height: "fit-content" }}
              data-bs-toggle="collapse"
              data-bs-target="#commits"
              aria-controls="commits"
            >
              Show/Hide
            </button>
            <div id="commits" className="collapse">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={commitsData.graphData}>
                  <XAxis dataKey="date" />
                  <YAxis
                    label={{
                      value: "Commits",
                      angle: -90,
                      position: "insideMiddle",
                      fill: "#e5d4ed"
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  {commitsData.authorList.map((author) => {
                    return (
                      <Line
                        type="monotone"
                        dataKey={`${author}`}
                        stroke={`${randomColor({
                          luminosity: "bright"
                        })}`}
                        animationDuration={3000}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <ul className="list-group w-100 gap-3 mx-auto pe-0">
            {filteredData.map((commit) => (
              <li
                className="dark-background primary-border primary-color primary-shadow list-group-item text-truncate border border-dark w-100"
                key={commit.sha}
              >
                <div className="my-4 p-3 w-100 d-flex flex-column gap-3">
                  <div className="d-flex flex-row gap-3 w-100 flex-wrap">
                    <strong>SHA :</strong>
                    {user ? (
                      <a
                        className="fw-light text-wrap"
                        style={{ width: "90%" }}
                        href={`/commit?repoUrl=${repoUrl}&sha=${commit.sha}`}
                      >
                        {commit.sha}
                      </a>
                    ) : (
                      <>{commit.sha} (Login Required)</>
                    )}
                  </div>
                  <div
                    data-date={DateHandler.getTimeAgo(new Date(commit.commitDate).toISOString())}
                    className="d-flex flex-row gap-3 tooltip-custom"
                  >
                    <strong>Date :</strong>
                    <span className="fw-light">{new Date(commit.commitDate).toLocaleString()}</span>
                  </div>
                  <div className="d-flex flex-row gap-3">
                    <strong>Author :</strong>{" "}
                    {commit.commitAuthor ? (
                      <a className="fw-light" href={`/user?username=${commit.commitAuthor}`}>
                        {commit.commitAuthor}
                      </a>
                    ) : (
                      <>Not Available</>
                    )}
                  </div>
                  <p className="d-flex flex-row gap-3 flex-wrap w-100">
                    <strong>Commit Message :</strong>
                    <span className="text-wrap w-75">{commit.commitMessage}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default RepoCommit;
