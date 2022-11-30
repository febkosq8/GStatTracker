import React from "react";
import Loading from "../../components/Loading";
import APIHandler from "../../handlers/APIHandler";
const Auth = () => {
  document.title = "Authentication | GStat Tracker";
  const code = new URLSearchParams(window.location.search).get("code");
  const state = new URLSearchParams(window.location.search).get("state");
  React.useEffect(() => {
    if (code && state) {
      APIHandler.getAuthToken(code, state).then((token) => {
        localStorage.setItem("token", token);
        window.location.href = "/";
      });
    } else if (!code || !state) {
      window.location.href = "/fail";
    }
  }, [code, state]);
  return (
    <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
      <Loading type="light" size="1x" />
      <h4 className="primary-color text-center pt-3">
        Please wait
        <br />
        Authentication in progress
      </h4>
    </div>
  );
};

export default Auth;
