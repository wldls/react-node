import React, { useCallback } from "react";
import { Form, Input, Button } from "antd";
import Link from "next/link";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { loginRequestAction } from "../modules/user";

const ButtonWrapper = styled.div`
  margin-top: 10px;
  text-align: center;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const { loading } = useSelector((state) => state.user.login);

  // const [id, setId] = useState("");
  // const [password, setPassword] = useState("");

  // const onChangeId = useCallback((e) => {
  //   setId(e.target.value);
  // }, []);

  // const onChangePassword = useCallback((e) => {
  //   setPassword(e.target.value);
  // }, []);

  const onSubmitForm = useCallback(() => {
    // antd에서는 onFinish를 할 경우 e.preventDefault()가 적용되어 있다.
    // setIsLoggedIn(true);
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

  // inline style을 쓰면서 리렌더링이 안되게 캐싱하려면 useMemo 사용
  // const style = useMemo(() => ({ marginTop: 10 }), [])

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input
          type="email"
          name="user-email"
          value={email}
          onChange={onChangeEmail}
        ></Input>
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          type="password"
          name="user-password"
          valule={password}
          onChange={onChangePassword}
          required
        ></Input>
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={loading}>
          로그인
        </Button>
        <Link href="/signup">
          <a>회원가입</a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;
