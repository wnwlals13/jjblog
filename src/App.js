import styles from "./app.module.css";
import { Outlet } from "react-router-dom";
import Navbar from "./utils/navbar/navbar";
import Footer from "./utils/footer/footer";
import styled from "styled-components";

function App({ authService, dbService, FileInput }) {
  return (
    <AppContainer>
      <Navbar authService={authService} />
      <MainContainer>
        <Outlet />
      </MainContainer>
      {/* <Footer/> */}
    </AppContainer>
  );
}

export default App;

const AppContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: auto;
  display: flex;
  flex-direction: column;

  h1,
  h2,
  h4,
  hr,
  button {
    margin: 0;
    padding: 0;
  }

  button,
  a {
    cursor: default;
    border: transparent;
    background: transparent;
  }

  input[type="submit"] {
    border: 0;
  }

  @media (max-width: 1440px) {
    max-width: 980px;
  }

  @media (max-width: 1020px) {
    margin: 0 1rem;
  }

  /* ----- common ----- */
  .btnDefault {
    background: #66a6ff;
    color: #ffffff;
    font-size: 1.2rem;
    padding: 0.3rem 1rem;
    border-radius: 1.2rem;
    /* transition: all 100ms ease-in; */
  }

  .btnDefault_outline {
    border: 1px solid #66a6ff;
    color: #66a6ff;
    background: #ffffff;
    font-size: 1.2rem;
    padding: 0.3rem 1rem;
    border-radius: 1.2rem;
    /* transition: all 100ms ease-in; */
  }

  .separator {
    border: 0.5px solid #aeaeae;
    margin: 0.5rem;
  }

  .defaultTextInput {
    border: none;
    border-bottom: 1px solid #aeaeae;
    font-size: 1.8rem;
  }
  .defaultTextInput:focus {
    outline: 0;
  }
`;

const MainContainer = styled.div`
  margin-top: 1rem;
`;
