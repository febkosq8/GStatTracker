import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import App from "./App";
import { EventProvider } from "./providers/EventProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// eslint-disable-next-line
import { popper } from "@popperjs/core";
// eslint-disable-next-line
import bootstrap from "bootstrap";
import { ConfigProvider } from "./providers/ConfigProvider";
import { UserProvider } from "./providers/UserProvider";
const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();
root.render(
  <ConfigProvider>
    <UserProvider>
      <EventProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </EventProvider>
    </UserProvider>
  </ConfigProvider>
);
