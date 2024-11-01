import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter as Router } from "react-router-dom";
import back from "./tools/back";
back();
const container = document.querySelector("#root");
const root = createRoot(container);
root.render(
  <Router>
    <App />
  </Router>
);

