import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import Router from "next/router";
import { END } from "@redux-saga/core";
import useSWR from "swr";
import axios from "axios";

import client from "../api";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import {
  // loadFollowersAction,
  // loadFollowingsAction,
  loadMyinfo,
} from "../modules/user";
import wrapper from "../store/configureStore";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  // dispatch 대신 swr을 사용하여 data load
  const { data: followersData = [], error: followerError } = useSWR(
    `http://localhost:3065/user/followers?limit=${followersLimit}`,
    fetcher
  );

  const { data: followingsData = [], error: followingError } = useSWR(
    `http://localhost:3065/user/followings?limit=${followingsLimit}`,
    fetcher
  );

  // useEffect(() => {
  //   dispatch(loadFollowersAction());
  //   dispatch(loadFollowingsAction());
  // }, []);

  // 어떤 경우에도 hooks는 모두 다 실행되어야 하므로 return 이후에 hooks를 실행해서는 안 된다.
  useEffect(() => {
    if (!me) {
      Router.push("/");
    }
  }, [me]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  });

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  });

  if (!me) {
    return "내 정보 로딩중...";
  }

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return "팔로잉/팔로워 로딩 중 에러가 발생합니다.";
  }

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList
          header="팔로잉 목록"
          data={followingsData}
          onClickMore={loadMoreFollowings}
          // 데이터도 없고 에러 정보도 없을 때
          loading={!followingsData && !followingsError}
        />
        <FollowList
          header="팔로워 목록"
          data={followersData}
          onClickMore={loadMoreFollowers}
          // 데이터도 없고 에러 정보도 없을 때
          loading={!followersData && !followersError}
        />
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";

    // 로그인 정보가 공유되는 문제를 위해 분기처리 - 서버일 때, 쿠키가 있을 때 쿠키 전달. 아니면 쿠키 제거
    client.defaults.headers.Cookie = "";

    if (context.req && cookie) {
      // 서버로 쿠키 전달
      client.defaults.headers.Cookie = cookie;
    }

    // context 안에 store가 들어있음
    context.store.dispatch(loadMyinfo());

    // request가 success가 될 때까지 기다려줌
    context.store.dispatch(END);
    // sagaTask는 configureStore에 구현되어있다.
    await context.store.sagaTask.toPromise();
  }
);

export default Profile;
