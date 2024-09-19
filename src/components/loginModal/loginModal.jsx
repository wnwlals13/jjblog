import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./loginModal.module.css";
import mainImg from "../../common/images/loginImg.png";
import googleImg from "../../common/images/google.png";
import gitImg from "../../common/images/github.png";
import { Authentication } from "../../service/authentication";
import styled from "styled-components";
import { UserContext } from "../../index";

/**
 * 로그인
 */
const LoginModal = ({ authService }) => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const auth = new Authentication();
  let [isEmailValid, setIsEmailValid] = useState(false);
  let [isPasswordValid, setIsPasswordValid] = useState(false);

  // const onLogIn = useCallback(
  //   (userId, userName, userEmail) => {
  //     navigate("/", {
  //       state: { id: userId, name: userName, email: userEmail },
  //     });
  //   },
  //   [navigate]
  // );
  const onClick = (event) => {
    const id = event.currentTarget.id;

    auth.loginSocial(id);
    if (user) navigate("/");
  };

  /* Function : 로그인 함수 */
  const handleLogin = (e) => {
    e.preventDefault();

    // 유효성 검사 통과하지 않은 경우
    if (!isEmailValid || !isPasswordValid)
      return alert("이메일 혹은 비밀번호가 올바르지 않습니다.");

    let email = document.querySelector("input[name='email']").value;
    let password = document.querySelector("input[name='password']").value;

    if (email === "" || password === "") return alert("정보를 입력해주세요.");

    // 존재하지 않는 유저
    auth.login(email, password);
  };

  const handleWrite = (e) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]{2,3}/;
    const passwordRegex = /^(?=.*[a-zA-Z0-9]).{8,15}/;

    if (e.target.name == "email") {
      let emailVal = e.target.value;
      let isValid = emailRegex.test(emailVal);
      setIsEmailValid(isValid);
    } else {
      let passwordVal = e.target.value;
      let isValid = passwordRegex.test(passwordVal);
      setIsPasswordValid(isValid);
    }
  };
  return (
    <LoginContainer>
      <LoginWrapper>
        <div className={styles.loginHeader}>
          <img src={mainImg} alt="loginimg" className={styles.loginImg} />
        </div>
        <RightSection>
          <p className={styles.signin}>Login</p>
          <div>
            <form>
              <div>
                <label>
                  <InputLabel>Email</InputLabel>
                  <InputField
                    type="email"
                    name="email"
                    required
                    onChange={handleWrite}
                  />
                </label>
              </div>
              <div>
                <label>
                  <InputLabel>Password</InputLabel>
                  <InputField
                    type="password"
                    name="password"
                    required
                    onChange={handleWrite}
                  />
                </label>
              </div>
              <div>
                <SubmitBtn
                  className="btnDefault"
                  type="submit"
                  value="로그인"
                  onClick={handleLogin}
                />
              </div>
            </form>
          </div>
          <hr className="separator"></hr>
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
        </RightSection>
      </LoginWrapper>
    </LoginContainer>
  );
};

export default LoginModal;

const LoginContainer = styled.section`
  background-color: #ffffff;
`;

const InputField = styled.input`
  width: 100%;
  margin-bottom: 0.5rem;
  border: 1px solid gray;
  height: 25px;
`;

const InputLabel = styled.p`
  font-size: 14px;
`;

const SubmitBtn = styled.input`
  width: 100%;
`;

const LoginWrapper = styled.section`
  position: absolute;
  overflow: hidden;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  max-width: 100%;
  display: flex;
  align-items: center;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.5s ease-in-out;
  background: #fff;
  z-index: 100;
`;

const RightSection = styled.div`
  flex: 1 1 50%;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
