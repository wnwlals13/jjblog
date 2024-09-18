import React, { memo, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyModal from "../../components/myModal/myModal";
import { UserContext } from "../../index";
import styled from "styled-components";
import { Authentication } from "../../service/authentication";

/**
 * Navbar 네비게이션
 */
const Navbar = memo(() => {
  const auth = new Authentication();
  const user = useContext(UserContext);
  const [display, setDisplay] = useState(false); //✨modal띄우기 display state를 설정해서 해결!
  const navigate = useNavigate();

  /* Function : 로그인 버튼 클릭 */
  const onLoginBtnClick = () => {
    if (user) {
      setDisplay(true);
    } else {
      navigate("/login");
    }
  };

  const onLogout = () => {
    auth.logout();
    setDisplay(false);
  };

  const onMouseMove = () => {
    setDisplay(true);
  };

  const onMouseLeave = () => {
    setDisplay(false);
  };

  /* 게시글 검색 인풋 박스 나오기 */
  const handleSearch = () => {};

  return (
    <>
      <Header>
        <MainLogo>
          <a onClick={() => navigate("/")}>JJlog</a>
        </MainLogo>
        <div>
          {/* <FontAwesomeIcon
            className="fa-solid fa-magnifying-glass fa-lg"
            onClick={handleSearch}
          ></FontAwesomeIcon> */}
          <button className="btnDefault" onClick={onLoginBtnClick}>
            {(user && (user.name || user.email.split("@")[0])) || "로그인"}
          </button>
        </div>
        <ModalContainer
          className={`${display ? "show" : ""}`}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          <MyModal onLogout={onLogout} />
        </ModalContainer>
      </Header>
    </>
  );
});

export default Navbar;

const Header = styled.header`
  flex: 1;
  position: sticky;
  height: 60px;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
`;

const ModalContainer = styled.section`
  position: absolute;
  top: 40px;
  right: 0;
  visibility: hidden;

  &.show {
    visibility: visible;
  }
`;

const MainLogo = styled.div`
  margin: 1.5rem 0;
  & a {
    font-size: 20px;
    font-weight: bold;
  }
`;

const FontAwesomeIcon = styled.i`
  margin-right: 15px;
`;
