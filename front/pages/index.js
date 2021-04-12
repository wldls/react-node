import React, { useEffect } from "react";
import axios from "axios";
import { END } from "redux-saga";

import AppLayout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import wrapper from "../store/configureStore";
import { loadPosts } from "../modules/post";
import { loadMyinfo } from "../modules/user";

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { retweet } = useSelector((state) => state.post);
  const { mainPosts, hasMorePosts, reqPosts } = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    if (retweet.error) {
      alert(retweet.error);
    }
  }, [retweet.error]);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY,
        clientHeight = document.documentElement.clientHeight,
        scrollHeight = document.documentElement.scrollHeight;

      if (scrollY + clientHeight >= scrollHeight - 500) {
        if (hasMorePosts && !reqPosts.loading) {
          const mainPostsLen = mainPosts.length;
          const lastId = mainPostsLen ? mainPosts[mainPostsLen - 1].id : 0; // 마지막 게시글의 id
          dispatch(loadPosts(lastId));
        }
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, reqPosts, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </AppLayout>
  );
};

// getServerSideProps: 접속한 상황 마다 화면이 바뀌어야 하는 경우
// 화면을 그리기 전에 서버쪽에서 먼저 실행
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
    console.log("////////////////////////////////////////load");
    context.store.dispatch(loadMyinfo());
    context.store.dispatch(loadPosts());

    // request가 success가 될 때까지 기다려줌
    context.store.dispatch(END);
    // sagaTask는 configureStore에 구현되어있다.
    await context.store.sagaTask.toPromise();
  }
);

export default Home;
