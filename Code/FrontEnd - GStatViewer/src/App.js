import "./styles/App.scss";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useContext, useState, lazy, Suspense } from "react";
import ReactGA from "react-ga4";
import Event from "./providers/EventProvider";
import ToastComponent from "./components/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import CookieConsent from "react-cookie-consent";
import APIHandler from "./handlers/APIHandler";
import Configuration from "./providers/ConfigProvider";
import Loading from "./components/Loading";
import logo from "./logos/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import InfoHandler from "./handlers/InfoHandler";
import useUserInfo from "./providers/UserProvider";

const Home = lazy(() => import("./pages/Home"));
const User = lazy(() => import("./pages/User"));
const Repo = lazy(() => import("./pages/Repo"));
const BulkRepo = lazy(() => import("./pages/BulkRepo"));
const Commit = lazy(() => import("./pages/Commit"));
const RepoCommit = lazy(() => import("./pages/RepoCommit"));
const Analyze = lazy(() => import("./pages/Analyze"));
const AdminLog = lazy(() => import("./pages/AdminLog"));
const Config = lazy(() => import("./pages/Config"));
const Auth = lazy(() => import("./pages/Auth"));
const Fail = lazy(() => import("./pages/Fail"));
function App() {
  const { user, loading, isAdmin, logout } = useUserInfo();
  const [toastList, setToastList] = useState([]);
  const toastTime = 5000;
  const EventHandler = useContext(Event);
  useEffect(() => {
    ReactGA.initialize("G-BF3SYBFE1X");
    EventHandler.subscribe("toast", (props) => {
      setToastList((current) => {
        current.push(<ToastComponent {...props} duration={toastTime} />);
        return [...current];
      });
      setTimeout(() => {
        setToastList((current) => {
          current.splice(0, 1);
          return [...current];
        });
      }, toastTime);
    });
    return () => {
      EventHandler.unsubscribe("toast", (props) => {
        setToastList((current) => {
          current.push(<ToastComponent {...props} duration={toastTime} />);
          return [...current];
        });
        setTimeout(() => {
          setToastList((current) => {
            current.splice(0, 1);
            return [...current];
          });
        }, toastTime);
      });
    };
    // eslint-disable-next-line
  }, []);
  const authTrigger = (type) => {
    APIHandler.getAuthUrl(type).then((url) => {
      window.location.href = url;
    });
  };
  return (
    <Router>
      <div className="d-flex flex-column justify-content-between " style={{ minHeight: "100%" }}>
        <header className="gstat-header sticky-top h-auto dark-background">
          <div className="col-sm-12 col-md-4 mx-auto py-3 px-4">
            <Suspense fallback={<Loading />}>
              <img
                alt="GStat Tracker"
                src={logo}
                loading="lazy"
                onClick={() => {
                  window.location.pathname = "/";
                }}
                className="img-fluid"
              />
            </Suspense>
          </div>
          <nav className={`navbar navbar-expand-lg alternate-background`}>
            <div className="h-75 w-100">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainNavDropdown"
                aria-controls="mainNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="mainNavDropdown">
                <ul className="navbar-nav mr-auto ps-2">
                  <li className="nav-item">
                    <Link
                      to="/"
                      className={`nav-link primary-color ${window.location.pathname === "/auth" ? "disabled" : ""}`}
                    >
                      <strong>Home</strong>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/user"
                      className={`nav-link primary-color ${window.location.pathname === "/auth" ? "disabled" : ""}`}
                    >
                      <strong>User Query</strong>
                    </Link>
                  </li>
                  {user ? (
                    <>
                      <li className="nav-item dropdown ">
                        <div
                          className={`nav-link primary-color dropdown-toggle ${
                            window.location.pathname === "/auth" ? "disabled" : ""
                          }`}
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <strong>Repository Details</strong>
                        </div>
                        <ul className="dropdown-menu alternate-background">
                          <li className="nav-item primary-color">
                            <Link
                              to="/repo"
                              className={`nav-link primary-color ${
                                window.location.pathname === "/auth" ? "disabled" : ""
                              }`}
                            >
                              Repository Query
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              to="/bulkrepo"
                              className={`nav-link primary-color ${
                                window.location.pathname === "/auth" ? "disabled" : ""
                              }`}
                            >
                              Bulk Repository Query
                            </Link>
                          </li>
                        </ul>
                      </li>

                      <li className="nav-item dropdown">
                        <div
                          className={`nav-link primary-color dropdown-toggle ${
                            window.location.pathname === "/auth" ? "disabled" : ""
                          }`}
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <strong>Commit Details</strong>
                        </div>
                        <ul className="dropdown-menu alternate-background">
                          <li className="nav-item">
                            <Link
                              to="/commit"
                              className={`nav-link primary-color ${
                                window.location.pathname === "/auth" ? "disabled" : ""
                              }`}
                            >
                              Individual Commit Query
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              to="/repocommit"
                              className={`nav-link primary-color ${
                                window.location.pathname === "/auth" ? "disabled" : ""
                              }`}
                            >
                              Repository Commits Query
                            </Link>
                          </li>
                        </ul>
                      </li>

                      <li className="nav-item">
                        <Link
                          to="/analyze"
                          className={`nav-link primary-color ${window.location.pathname === "/auth" ? "disabled" : ""}`}
                        >
                          <strong>Analyze Repository</strong>
                        </Link>
                      </li>
                      {isAdmin ? (
                        <li className="nav-item">
                          <Link
                            to="/adminlog"
                            className={`nav-link primary-color ${
                              window.location.pathname === "/auth" ? "disabled" : ""
                            }`}
                          >
                            <strong>Admin Log</strong>
                          </Link>
                        </li>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <li className="nav-item">
                        <Link
                          to="/repo"
                          className={`nav-link primary-color ${window.location.pathname === "/auth" ? "disabled" : ""}`}
                        >
                          <strong>Repository Query</strong>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to="/repocommit"
                          className={`nav-link primary-color ${window.location.pathname === "/auth" ? "disabled" : ""}`}
                        >
                          <strong>Repository Commits Query</strong>
                        </Link>
                      </li>
                    </>
                  )}

                  <li className="nav-item">
                    <Link
                      to="/config"
                      className={`nav-link primary-color ${window.location.pathname === "/auth" ? "disabled" : ""}`}
                    >
                      <strong>Configuration</strong>
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <div
                      className={`nav-link primary-color dropdown-toggle ${
                        window.location.pathname === "/auth" ? "disabled" : ""
                      }`}
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <strong>More</strong>
                    </div>
                    <ul className="dropdown-menu alternate-background">
                      <li>
                        <a
                          className="dropdown-item primary-color"
                          href="https://github.com/febkosq8/GStatTracker"
                          target="_blank"
                        >
                          About
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item primary-color"
                          href="https://github.com/apps/gstat-tracker"
                          target="_blank"
                        >
                          GitHub App
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item primary-color"
                          href="https://github.com/febkosq8/GStatTracker/issues"
                          target="_blank"
                        >
                          Report an issue
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
                <div className="ms-auto pe-3 ps-2">
                  <div className="dropdown">
                    <div
                      className={`nav-link primary-color dropdown-toggle ${
                        window.location.pathname === "/auth" ? "disabled" : ""
                      }`}
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <strong>{user ? user.login : "Login"}</strong>
                    </div>
                    {user ? (
                      <ul className="dropdown-menu dropdown-menu-lg-end alternate-background">
                        <li>
                          <a className="dropdown-item primary-color" onClick={logout} target="_blank">
                            Logout
                          </a>
                        </li>
                      </ul>
                    ) : (
                      <ul className="dropdown-menu dropdown-menu-lg-end alternate-background">
                        <li>
                          <a className="dropdown-item primary-color" onClick={() => authTrigger("new")} target="_blank">
                            New User
                            <FontAwesomeIcon
                              className="infoIcon"
                              title={InfoHandler.getInfo("newUser")}
                              icon={faCircleInfo}
                            />
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item primary-color"
                            onClick={() => authTrigger("existing")}
                            target="_blank"
                          >
                            Existing User
                            <FontAwesomeIcon
                              className="infoIcon"
                              title={InfoHandler.getInfo("existingUser")}
                              icon={faCircleInfo}
                            />
                          </a>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
        {loading ? (
          <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
            <Loading type="light" size="1x" />
            <h4 className="primary-color text-center pt-3">
              Please wait
              <br />
              Your request is being processed
            </h4>
          </div>
        ) : (
          <div className="container-fluid transition ">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/user" element={<User />} />
                <Route path="/repo" element={<Repo />} />
                <Route path="/bulkrepo" element={<BulkRepo />} />
                <Route path="/commit" element={<Commit />} />
                <Route path="/repocommit" element={<RepoCommit />} />
                <Route path="/analyze" element={<Analyze />} />
                <Route path="/adminlog" element={<AdminLog />} />
                <Route path="/config" element={<Config />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/fail" element={<Fail />} />
                <Route path="*" element={<Fail />} />
              </Routes>
            </Suspense>
          </div>
        )}
        <ToastContainer style={{ marginTop: "12%", marginRight: "2%" }} position="top-end">
          {toastList}
        </ToastContainer>
        <CookieConsent
          location="bottom"
          cookieName="PrivacyPolicyPrompt"
          expires={90}
          overlay
          style={{
            width: "400px",
            height: "200px",
            marginLeft: "38vw",
            marginBottom: "40vh"
          }}
        >
          GStat Tracker uses cookies & similar technologies to enhance the user experience & functionality. More
          infomation can be found{" "}
          <a href="https://github.com/febkosq8/GStatTracker/blob/main/PrivacyPolicy.md" target="_blank">
            here
          </a>
          .
        </CookieConsent>
        <footer className="w-100 primary-shadow primary-color d-flex flex-column align-items-center py-4 lh-1 ">
          <p>
            <strong>GStat Tracker</strong> by
            <a href="https://www.febkosq8.me" className="ms-2 btn-outline-light btn">
              Febkosq8
            </a>
          </p>
          <p>Copyright © 2022 Febkosq8</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
