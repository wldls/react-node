import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Head from "next/head";
import Router from "next/router";
import AppLayout from "../components/AppLayout";
import { Form, Input, Checkbox, Button } from "antd";
import useinput from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { loadMyinfo, signupAction } from "../modules/user";
import { END } from "@redux-saga/core";
import wrapper from "../store/configureStore";

const ErrorMessage = styled.div`
  color: red;
`;

const Signup = () => {
  const dispatch = useDispatch();
  const { signup, login } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useinput("");
  const [nickname, onChangeNickname] = useinput("");
  const [password, onChangePassword] = useinput("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [term, setTerm] = useState(false);
  const [termError, setTermError] = useState(false);

  useEffect(() => {
    if (signup.data) {
      Router.push("/");
    } else if (signup.error) {
      alert(signup.error);
    }
  }, [signup]);

  useEffect(() => {
    if (login.data) {
      Router.replace("/");
    }
  }, [login]);

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    dispatch(signupAction({ email, password, nickname }));
  }, [email, nickname, password, passwordCheck, term]);

  return (
    <AppLayout>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <br />
          <Input
            name="user-email"
            type="email"
            value={email}
            required
            onChange={onChangeEmail}
          />
        </div>
        <div>
          <label htmlFor="user-nickname">닉네임</label>
          <br />
          <Input
            name="user-nickname"
            value={nickname}
            required
            onChange={onChangeNickname}
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input
            type="password"
            name="user-password"
            value={password}
            required
            onChange={onChangePassword}
          />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호 확인</label>
          <br />
          <Input
            type="password"
            name="user-password-check"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && (
            <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
          )}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            동의합니다.
          </Checkbox>
          {termError && <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={signup.loading}>
            가입하기
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";

    // 로그인 정보가 공유되는 문제를 위해 분기처리 - 서버일 때, 쿠키가 있을 때 쿠키 전달. 아니면 쿠키 제거
    axios.defaults.headers.Cookie = "";

    if (context.req && cookie) {
      // 서버로 쿠키 전달
      axios.defaults.headers.Cookie = cookie;
    }

    // context 안에 store가 들어있음
    context.store.dispatch(loadMyinfo());

    // request가 success가 될 때까지 기다려줌
    context.store.dispatch(END);
    // sagaTask는 configureStore에 구현되어있다.
    await context.store.sagaTask.toPromise();
  }
);

export default Signup;
