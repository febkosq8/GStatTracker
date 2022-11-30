import React from "react";
import { Suspense, useState } from "react";
import Loading from "../../components/Loading";
import omg from "../../logos/omg.gif";
const Fail = () => {
  document.title = "Failure | GStat Tracker";
  const [count, setCount] = useState(5);

  React.useEffect(() => {
    setTimeout(() => {
      window.location.pathname = "/";
    }, 5000);
    setInterval(() => {
      setCount((curr) => curr - 1);
    }, 1000);
  }, []);
  return (
    <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
      <Suspense fallback={<Loading />}>
        <img
          src={omg}
          loading="lazy"
          style={{
            height: "15rem",
            width: "fit-content",
          }}
        />
      </Suspense>

      <h2 className="primary-color text-center pt-3">
        You look lost, stranger. You were not supposed to see this page !
      </h2>
      <h4 className="primary-color text-center pt-3">
        Some pages require you to login before you can access them.
        <br />
        Taking you back home in {count} seconds
      </h4>
    </div>
  );
};

export default Fail;
