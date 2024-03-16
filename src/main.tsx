import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove Preload scripts loading
postMessage({ payload: "removeLoading" }, "*");

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
