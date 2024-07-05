import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./loginModal.module.css";
import mainImg from "../../common/images/loginImg.png";
import googleImg from "../../common/images/google.png";
import gitImg from "../../common/images/github.png";
import { authentication } from "../../service/authentication";

/**
 * 로그인
 */
const LoginModal = ({ authService }) => {
  const navigate = useNavigate();
  const onLogIn = useCallback(
    (userId, userName, userEmail) => {
      navigate("/", {
        state: { id: userId, name: userName, email: userEmail },
      });
    },
    [navigate]
  );
  const onClick = (event) => {
    authService.login(event.currentTarget.id);
    // onLogIn(data.user.uid)
  };

  /* Function : 로그인 함수 */
  const handleLogin = (e) => {
    e.preventDefault();
    let email = document.querySelector("input[name='email']").value;
    let password = document.querySelector("input[name='password']").value;

    const auth = new authentication();
    auth.login(email, password);
  };

  useEffect(() => {
    authService.onAuthChange((user) => {
      console.log(user);
      // user && onLogIn(user.uid, user.displayName, user.email);
    });
  }, [authService, onLogIn]);
  return (
    <section className={styles.container}>
      <section className={styles.navContainer}></section>
      <section className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <img src={mainImg} alt="loginimg" className={styles.loginImg} />
        </div>
        <div className={styles.loginBody}>
          <p className={styles.signin}>Login</p>
          <div>
            <form>
              <div>
                <label>
                  <p>Email</p>
                  <input type="email" name="email" required />
                </label>
              </div>
              <div>
                <label>
                  <p>Password</p>
                  <input type="password" name="password" required />
                </label>
              </div>
              <div>
                <input type="submit" value="로그인" onClick={handleLogin} />
              </div>
            </form>
          </div>
          <hr></hr>
          <h4>소셜 계정으로 로그인</h4>
          <div className={styles.loginSocial}>
            <button id="Google" onClick={onClick} className={styles.button}>
              <img src={googleImg} alt="google" className={styles.socialImg} />
            </button>
            <button id="Github" onClick={onClick} className={styles.button}>
              <img className={styles.socialImg} src={gitImg} alt="github" />
            </button>
          </div>
          <div>
            아직 회원이 아니신가요?{" "}
            <a href="" onClick={() => navigate("/signup")}>
              회원가입
            </a>
          </div>
        </div>
      </section>
    </section>
  );
};

export default LoginModal;
