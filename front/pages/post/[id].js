// post/:id
import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import Head from "next/head";

import wrapper from "../../store/configureStore";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import { loadPost } from "../../modules/post";
import { loadMyinfo } from "../../modules/user";

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useSelector((state) => state.post.reqPost);
  return (
    <AppLayout>
      <Head>
        <title>{data.User.nickname}님의 게시글</title>
        <meta name="description" content={data.content} />
        <meta
          property="og:title"
          content={`${data.User.nickname} 님의 게시글`}
        />
        <meta
          property="og:image"
          content={
            data.Images[0]
              ? data.Images[0].src
              : "https://nodebird.com/favicon.ico"
          }
        />
        <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
      </Head>
      <PostCard post={data}></PostCard>
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
    context.store.dispatch(loadPost(context.params.id));

    // request가 success가 될 때까지 기다려줌
    context.store.dispatch(END);
    // sagaTask는 configureStore에 구현되어있다.
    await context.store.sagaTask.toPromise();
  }
);

export default Post;
