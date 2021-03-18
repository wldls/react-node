import React, { useCallback } from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import { Form } from "antd";
import useinput from "../hooks/useInput";

const Signup = () => {
  const [id, setId] = useinput("");
  const [nickname, setNickname] = useinput("");
  const [password, setPassword] = useinput("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const setPasswordCheck = useCallback(() => {
    setPasswordCheck(e.target.value);
  }, []);

  const onSubmit = useCallback(() => {}, []);

  return (
    <AppLayout>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <Input name="user-id" value={id} required onChange={onChangeId} />
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
        </div>
      </Form>
    </AppLayout>
  );
};

export default Signup;
