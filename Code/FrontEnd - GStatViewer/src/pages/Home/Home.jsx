import React from "react";
import "./Home.scss";
import { useNavigate } from "react-router-dom";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUserInfo from "../../providers/UserProvider";

function Home() {
  document.title = "Home | GStat Tracker";
  const { user, loading, isAdmin, logout } = useUserInfo();
  const Nav = useNavigate();
  return (
    <div className="d-flex flex-row h-100 w-100 justify-content-center align-items-center">
      <div className="d-flex flex-column h-100 gap-2 p-3">
        <div className="card dark-background primary-border">
          <div className="card-body">
            <h3 className="card-title primary-color">About GStat Tracker</h3>
            <hr className="primary-border" />
            <div className="card-text primary-color">
              This application is built on top of GitHub REST API to offer a
              wide range of tools that include various detailed statistics for a
              GitHub user and their repositories.
            </div>
          </div>
        </div>
        <div className="card dark-background primary-border">
          <div className="card-body">
            <h3 className="card-title primary-color">Features</h3>
            <hr className="primary-border" />
            <ul
              className="card-text primary-color list-group ps-4"
              style={{ listStyleType: "circle" }}
            >
              <li>
                {" "}
                Get information about a user
                <a href={`/user`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a>
              </li>
              <li>
                {" "}
                Get information about specific repository
                <a href={`/repo`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a>
              </li>
              <li>
                {" "}
                Get an overview on multiple repositories
                <a href={`/bulkrepo`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a>
              </li>
              <li>
                {" "}
                Get information on a particular commit
                <a href={`/commit`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a>
              </li>
              <li>
                {" "}
                Get an overview on all the commits made to a repository
                <a href={`/repocommit`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a>
              </li>
              <li>
                {" "}
                Analyze a particular repository
                <a href={`/analyze`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a>
              </li>
              <li>
                {" "}
                Configure various aspects of the application
                <a href={`/config`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a>
              </li>
              <li>
                {" "}
                Authentication System allowing the application to access private
                user data (Private Repositories)
                {/* <a href={`/login`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a> */}
              </li>
              <li>
                {" "}
                Multi Level Cache System (Request data to be pulled from logs.
                Configure this aspect in Configuration)
                <a href={`/config`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a>
              </li>
              <li>
                {" "}
                Commit Message Filter system when using Analyze a particular
                repository. Configure this aspect in Configuration
                <a href={`/config`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a>
              </li>
              <li>
                {" "}
                Configure various aspects of the application
                <a href={`/config`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a>
              </li>

              <li> Automatic conversion of timestamps to user locale</li>
              <li>
                {" "}
                Hover over the info icon placed strategically to get information
                about that particular feature and what you can do with it
                {/* <a href={`/config`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a> */}
              </li>
              <li>
                {" "}
                Hover over any TimeStamp to show Relative Time
                {/* <a href={`/config`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a> */}
              </li>
              <li>
                {" "}
                Ability to have a saved list of repositories to quickly analyze
                quick and easily
                <a href={`/bulkrepo`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a>
              </li>

              <li>
                {" "}
                Ability to increase your API calls by authentication feature.
                Login to GStatTracker to increase your API limit from 60 to 5000
                per hour
                {/* <a href={`/config`}>
                  <FontAwesomeIcon className="linkIcon" icon={faLink} />
                </a> */}
              </li>
              <li>
                {" "}
                Auto Error Handling ensures that when the application faces an
                error, it returns an informative message to the end user
              </li>
              <li>
                {" "}
                Status Icons for various UI elements ensuring the end user is
                always updated about the progress
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
