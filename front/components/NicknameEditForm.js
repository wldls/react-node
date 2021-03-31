import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input } from "antd";
import { changeNickname } from "../modules/user";

const NicknameEditForm = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const style = useMemo(
    () => ({
      marginBottom: "20px",
      border: "1px solid #d9d9d9",
      padding: "20px",
    }),
    []
  );

  const onSearch = (value) => {
    if (me.id) {
      dispatch(changeNickname(value));
    }
  };

  return (
    <Form style={style}>
      <Input.Search
        name="nickname"
        addonBefore="닉네임"
        enterButton="수정"
        onSearch={onSearch}
      />
    </Form>
  );
};

export default NicknameEditForm;
