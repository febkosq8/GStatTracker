import React, { createContext } from "react";

import EventHandler from "../handlers/EventHandler";

const Event = createContext();
const EventProvider = (props) => <Event.Provider value={EventHandler}>{props.children}</Event.Provider>;
export { EventProvider };
export default Event;
