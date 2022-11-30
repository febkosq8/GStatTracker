import APIHandler from "../handlers/APIHandler";
import React, { createContext, useEffect, useState, useContext } from "react";
import Configuration from "./ConfigProvider";
const useUser = () => {
  const DefaultConfig = useContext(Configuration);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const fetchUserData = async () => {
    return await APIHandler.getUser();
  };
  const checkAdmin = async () => {
    return await APIHandler.checkAdmin();
  };
  useEffect(() => {
    fetchUserData()
      .then((userData) => {
        setUser(userData);
        setLoading(false);

        checkAdmin().then((isAdmin) => {
          setIsAdmin(isAdmin);
        });
      })
      .catch((error) => setLoading(false));
  }, []);
  const logout = () => {
    setLoading(true);
    APIHandler.logout().then(() => {
      DefaultConfig.deleteConfig("token");
      window.location.pathname = "/";
    });
  };
  return { user, loading, setLoading, isAdmin, logout };
};
const UserContext = createContext();
const UserProvider = (props) => (
  <UserContext.Provider value={useUser()}>
    {props.children}
  </UserContext.Provider>
);
const useUserInfo = () => useContext(UserContext);
export { UserProvider };
export default useUserInfo;
