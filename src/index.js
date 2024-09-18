import React, { memo, createContext } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./index.css";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals";
import AuthService from "./service/auth_service.js";
import Database from "./service/database";
import ImgFileInput from "./components/file_input/file_input";
import ImgService from "./service/img_service";
import ContentsList from "./components/contentList/contentsList";
import ContentAdd from "./components/content_add/content_add.tsx";
import LoginModal from "./components/loginModal/loginModal.jsx";
import ContentEdit from "./components/content_edit/content_edit.tsx";
import { Article } from "./components/article/article.tsx";
import SignupPage from "./components/signup/signup.tsx";
import Mypage from "./components/mypage/mypage.tsx";

const authService = new AuthService();
const dbService = new Database();
const imgService = new ImgService();
const FileInput = memo((props) => (
  <ImgFileInput {...props} imgService={imgService} />
));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <ContentsList
            authService={authService}
            dbService={dbService}
            FileInput={FileInput}
          />
        ),
      },
      {
        path: "addPost",
        element: (
          <ContentAdd
            authService={authService}
            dbService={dbService}
            FileInput={FileInput}
          />
        ),
      },
      {
        path: "login",
        element: <LoginModal authService={authService} />,
      },
      {
        path: "editPost/:id",
        element: (
          <ContentEdit
            authService={authService}
            dbService={dbService}
            FileInput={FileInput}
          />
        ),
      },
      {
        path: "viewPost/:id",
        element: <Article />,
      },
      {
        path: "signup",
        element: <SignupPage authService={authService} />,
      },
      { path: "mypage", element: <Mypage /> },
    ],
  },
]);

export const UserContext = createContext();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContext.Provider value={JSON.parse(localStorage.getItem("user"))}>
      <RouterProvider router={router}></RouterProvider>
    </UserContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
