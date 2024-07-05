import React, { FormEvent, ReactElement, useState } from "react";
import { authentication } from "../../service/authentication";
import { Wrapper, FormWrapper } from "./signup.module";

const emailRegEx =
  /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
const pwdRegEx = /^[A-Za-z\d$@$!%*#?&]{8,16}$/;

export default function SignupPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    // 이메일 유효성 검사
    // 조건 : 이메일 형식 검사
    if (!validateEmail()) return alert("이메일 주소를 올바르게 입력해주세요");

    // 이메일 존재 검사

    // 비밀번호 유효성 검사
    // 조건 : 8~16자리 입력
    if (!validatePwd())
      return alert("비밀번호를 올바르게 입력해주세요 (8~16자리)");

    // 회원가입
    console.log("submit", email, password);
    const auth = new authentication();
    const user = auth.signup(email, password);
    console.log("signup.ts", user);
  };

  const validateEmail = () => {
    if (emailRegEx.test(email)) return true;
    return false;
  };
  const validatePwd = () => {
    if (pwdRegEx.test(password)) return true;
    return false;
  };

  return (
    <Wrapper>
      <FormWrapper>
        <div>
          <div>
            <label>email</label>
            <input
              type="text"
              placeholder="enter email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>password</label>
            <input
              type="password"
              placeholder="enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="password-hint">
              비밀번호는 8~16자리로 입력해주세요.
            </span>
          </div>
        </div>
        <div>
          <input
            type="submit"
            value="회원가입"
            onClick={(e) => handleSignup(e)}
          />
        </div>
      </FormWrapper>
    </Wrapper>
  );
}
