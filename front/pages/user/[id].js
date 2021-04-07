import React, { useEffect } from "react";
import axios from "axios";
import { END } from "redux-saga";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";

import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import wrapper from "../../store/configureStore";
import { loadUserPosts } from "../../modules/post";
import { loadMyinfo, loadUserinfo } from "../../modules/user";

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { mainPosts, hasMorePosts, reqPosts } = useSelector(
    (state) => state.post
  );
  const { data } = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY,
        clientHeight = document.documentElement.clientHeight,
        scrollHeight = document.documentElement.scrollHeight;

      if (scrollY + clientHeight >= scrollHeight - 500) {
        if (hasMorePosts && !reqPosts.loading) {
          const mainPostsLen = mainPosts.length;
          const lastId = mainPostsLen ? mainPosts[mainPostsLen - 1].id : 0; // 마지막 게시글의 id
          dispatch(loadUserPosts({ lastId, id }));
        }
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, reqPosts, mainPosts.length]);

  if (!data) {
    return null;
  }
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
        <meta property="og:url" content={`https://nodebird.com/user/${id}`} />
      </Head>
      {userInfo ? (
        <Card
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.length}
            </div>,
            <div key="followings">
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
          />
        </Card>
      ) : null}
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c}></PostCard>
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
    context.store.dispatch(loadMyinfo());
    context.store.dispatch(loadUserPosts({ id: context.params.id, lastId: 0 }));
    context.store.dispatch(loadUserinfo(context.params.id));

    // request가 success가 될 때까지 기다려줌
    context.store.dispatch(END);
    // sagaTask는 configureStore에 구현되어있다.
    await context.store.sagaTask.toPromise();

    // console.log("getState", context.store.getState().post.mainPosts);
    // return { props: {} };
  }
);

export default User;
