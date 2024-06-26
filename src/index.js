import React, { memo } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./app.js";
import reportWebVitals from "./reportWebVitals";
import AuthService from "./service/auth_service.js";
import Database from "./service/database";
import ImgFileInput from "./components/file_input/file_input";
import ImgService from "./service/img_service";

const authService = new AuthService();
const dbService = new Database();
const imgService = new ImgService();
const FileInput = memo((props) => (
  <ImgFileInput {...props} imgService={imgService} />
));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App
      authService={authService}
      dbService={dbService}
      FileInput={FileInput}
    />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
