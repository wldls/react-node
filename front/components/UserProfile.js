import React, { useCallback } from "react";
import { Card, Avatar, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequestAction } from "../modules/user";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { login, logout } = useSelector((state) => state.user);
  const onLogout = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">
          짹짹
          <br />
          {login.data.Posts.length}
        </div>,
        <div key="followings">
          팔로잉
          <br />
          {login.data.Followings.length}
        </div>,
        <div key="follower">
          팔로워
          <br />
          {login.data.Followers.length}
        </div>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{login.data.nickname[0]}</Avatar>}
        title={login.data.nickname}
      />
      <Button onClick={onLogout} loading={logout.loading}>
        로그아웃
      </Button>
    </Card>
  );
};

export default UserProfile;
