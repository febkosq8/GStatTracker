import React from "react";
import "./User.scss";
import { useEffect, useContext } from "react";
import APIHandler from "../../handlers/APIHandler";
import Event from "../../providers/EventProvider";
import Loading from "../../components/Loading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Configuration from "../../providers/ConfigProvider";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DateHandler from "../../handlers/DateHandler";
import InfoHandler from "../../handlers/InfoHandler";
import useUserInfo from "../../providers/UserProvider";

function User() {
  document.title = "User Query | GStat Tracker";
  const { user, loading, isAdmin, logout } = useUserInfo();
  const EventHandler = useContext(Event);
  const Config = useContext(Configuration);
  const queryClient = useQueryClient();
  const [username, setUser] = React.useState(new URLSearchParams(document.location.search).get("username") ?? "");
  const [perPage, setPerPage] = React.useState(Config.getConfig("perPage"));
  const [page, setPage] = React.useState(1);
  const [fetchListData, setFetchListData] = React.useState(false);
  const userSearchFormRef = React.useRef(null);
  const userSearchInputRef = React.useRef(null);
  const { isLoading: userDataLoading, data: userData } = useQuery(
    ["user", username, perPage, page],
    () => APIHandler.getUserRepoList(username, perPage, page, Config.getConfig("logTime")),
    {
      onSuccess: (data) => {
        if (username !== "" && data.error) {
          EventHandler.publish("toast", {
            message: data.error,
            type: "danger"
          });
        }
        if (username !== "" && data.isCached === true) {
          EventHandler.publish("toast", {
            message: InfoHandler.getInfo("fetchedCache"),
            type: "info"
          });
        }
        setFetchListData(false);
      },
      refetchOnWindowFocus: false,
      enabled: username !== "" && fetchListData
    }
  );
  useEffect(() => {
    userSearchInputRef.current.value = username;
    if (username !== "") {
      handleSubmit();
    }
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setFetchListData(true);
    setUser((curr) => userSearchInputRef.current.value);
  };
  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100 transition p-3">
      <div className="d-flex flex-column justify-content-center align-items-start transition w-100">
        <form ref={userSearchFormRef} className="w-100 row g-3 justify-content-center" onSubmit={handleSubmit}>
          <div className="mb-3 col-sm-12 col-md-5 ">
            <label className="primary-color form-label">
              Search for user repositories
              <FontAwesomeIcon className="infoIcon" title={InfoHandler.getInfo("userPage")} icon={faCircleInfo} />
            </label>

            <div className="input-group">
              <input
                ref={userSearchInputRef}
                className={`form-control dark-background primary-color`}
                type="text"
                name="username"
                title="Enter the Github username"
                placeholder="GitHub Username"
                required
              />
              <button type="submit" className="btn btn-primary" style={{ width: "5rem" }}>
                {fetchListData ? <Loading type="dark" size="sm" /> : "Search"}
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
          {userData?.repos ? (
            <div className="col-sm-12 col-md-8">
              <label className="primary-color form-label">Showing Page</label>
              <nav className="w-100">
                <ul className="pagination input-group w-100 " style={{ cursor: "pointer" }}>
                  <li className={` page-item ${page === 1 ? "disabled" : ""}`}>
                    <a
                      className="page-link"
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
                    {Array.from(Array(Math.min(Math.ceil(userData?.repoCount / perPage), 1000 / perPage)).keys()).map(
                      (i) => (
                        <option key={i} value={i + 1} selected={page === i + 1}>
                          {i + 1}
                        </option>
                      )
                    )}
                  </select>
                  <p className="input-group-text dark-background primary-color">
                    of {Math.min(Math.ceil(userData?.repoCount / perPage), 1000 / perPage)}
                  </p>
                  <li
                    className={`page-item ${
                      page === Math.min(Math.ceil(userData?.repoCount / perPage), 1000 / perPage) ? "disabled" : ""
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
          ) : null}
        </form>
      </div>
      {!userDataLoading && !!userData && userData.name ? (
        <div className=" dark-background primary-border primary-color card m-auto p-3 col-12 col-md-8">
          <p>
            <strong>Username :</strong> <a href={userData.url}>{userData.userId}</a>
          </p>
          <p>
            <strong>Name :</strong> {userData.name ? userData.name : "Not Available"}
          </p>
          <p>
            <strong>User ID :</strong> {userData.id}
          </p>
          <p data-date={DateHandler.getTimeAgo(new Date(userData.createdAt).toISOString())} className="tooltip-custom">
            <strong>Profile Creation Date :</strong> {new Date(userData.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Followers :</strong> {userData.followers} / <strong>Following :</strong> {userData.following}
          </p>
          <p>
            <strong>Total Number of Repositories : </strong> {userData.repoCount}
          </p>
          {userData?.repos ? (
            <>
              <p>
                Currently showing <strong>{userData?.repos?.length}</strong> Repositories
              </p>
              <ul className="list-group gap-3 w-100">
                {userData?.repos?.map((repo) => (
                  <li
                    className="dark-background primary-border primary-color primary-shadow list-group-item border border-dark p-1"
                    key={repo.id}
                  >
                    <p className="text-truncate w-100">
                      <strong>Repository : </strong>
                      <a href={`/repo?repoUrl=${username}/${repo.repoName}`}>{repo.repoName}</a>
                    </p>
                    <p className="text-truncate w-100">
                      <strong>Visibility : </strong>
                      {repo.repoPrivate ? "Private" : "Public"}
                    </p>
                    <p
                      data-date={DateHandler.getTimeAgo(new Date(repo.createdAt).toISOString())}
                      className="tooltip-custom"
                    >
                      <strong>Created at : </strong>
                      {new Date(repo.createdAt).toLocaleString()}
                    </p>
                    <p className="text-wrap w-100">
                      <strong>Description : </strong>
                      {repo.repoDescription ? repo.repoDescription : "Not Available"}
                    </p>
                    <p className="text-wrap w-100">
                      <strong>URL : </strong> <a href={repo.repoUrl}>{repo.repoUrl}</a>
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <strong>No Repository Data Available</strong>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default User;
