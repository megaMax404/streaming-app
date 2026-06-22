import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

console.log("MAIN JSX LOADED");

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <h1 style={{ color: "white" }}>
    ROOT WORKS
  </h1>
);