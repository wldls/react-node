import React from "react";
import Head from "next/head";
import { Card, Avatar } from "antd";
import { END } from "@redux-saga/core";
import { useSelector } from "react-redux";

import { loadUserinfo } from "../modules/user";
import AppLayout from "../components/AppLayout";
import wrapper from "../store/configureStore";

const About = () => {
  const { data } = useSelector((state) => state.user.userInfo);

  if (!data) {
    return (
      <AppLayout>
        <Head>
          <title>내 프로필 | NodeBird</title>
        </Head>
        <Card>유저 정보가 없습니다.</Card>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <Card
        actions={[
          <div key="twit">
            짹짹
            <br />
            {data.Posts}
          </div>,
          <div key="followings">
            팔로잉
            <br />
            {data.Followings}
          </div>,
          <div key="follower">
            팔로워
            <br />
            {data.Followers}
          </div>,
        ]}
      >
        <Card.Meta
          avatar={<Avatar>{data.nickname[0]}</Avatar>}
          title={data.nickname}
        />
      </Card>
    </AppLayout>
  );
};

// getStaticProps: 언제 접속해도 데이터가 바뀔 일이 없는 경우 (예: 블로그 게시글, 뉴스 등)
// export const getStaticProps = wrapper.getStaticProps(async (context) => {
//   context.store.dispatch(loadUserinfo(1));
//   context.store.dispatch(END);
//   await context.store.sagaTask.toPromise();
//   return { props: {} };
// });
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    context.store.dispatch(loadUserinfo(1));
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
    return { props: {} };
  }
);

export default About;
