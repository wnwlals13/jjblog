import React, { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyModal from "../../components/myModal/myModal";
import Sidebar from "../sidebar/sidebar";
import styles from "./navbar.module.css";
import LoginModal from "../../components/loginModal/loginModal";

const Navbar = memo(({ authService, dbService, onLogin }) => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [display, setDisplay] = useState(false); //✨modal띄우기 display state를 설정해서 해결!
  const [status, setStatus] = useState(false);
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();
  const sidebarRef = useRef();

  const onBtnClick = () => {
    setDisplay(true);
  };
  const onLogout = () => {
    authService.logout();
    setName(null);
    setDisplay(false);
  };

  const onMouseMove = () => {
    setDisplay(true);
  };
  const onMouseLeave = () => {
    setDisplay(false);
  };

  const goToHome = () => {
    navigate("/", {
      state: {
        id: userId || null,
        name: name || null,
        email: email || null,
      }});
  };
  const slideSidebar = () => {
    sidebarRef.current.className = `${styles.sideSection} ${styles.show}`;
    // console.log(sidebarRef.current.className);
  };
  const hideSidebar = (e) => {
    console.log(e.target);
  };

  useEffect(() => {
    authService.onAuthChange((user)=>{
      console.log(user.uid, user.email, user.displayName);
      user && setName(user.displayName);
      user && setEmail(user.email);
      user && setUserId(user.uid);
    })
  }, [authService]);
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo} onClick={goToHome}>
          <div
            ref={sidebarRef}
            className={styles.sidebarContainer}
            onClick={hideSidebar}
          >
            <div className={styles.sidebarInner}>
              <Sidebar menu={menu} />
            </div>
          </div>
          <p className={styles.sidebar} onClick={slideSidebar}>
            차근차근 기록하기
          </p>
        </div>
        <div className={styles.search}>
          {name && (
            <div className={styles.user} onClick={onBtnClick}>
              {name}
            </div>
          )}
          {!name && (
            <div className={styles.user} onClick={() => navigate("/login")}>
              로그인
            </div>
          )}
        </div>
        <section
          className={`${styles.container} ${display ? styles.show : undefined}`}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          <MyModal onLogout={onLogout} />
        </section>
      </header>
    </>
  );
});

export default Navbar;