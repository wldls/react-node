import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { END } from "redux-saga";
import axios from "axios";

import PostCard from "../../components/PostCard";
import wrapper from "../../store/configureStore";
import AppLayout from "../../components/AppLayout";
import { loadHashtagPosts } from "../../modules/post";
import { loadMyinfo } from "../../modules/user";

const Hashtag = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tag } = router.query;
  const { mainPosts, hasMorePosts, hashtagPost } = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.pageYOffset,
        clientHeight = document.documentElement.clientHeight,
        scrollHeight = document.documentElement.scrollHeight;

      if (scrollY + clientHeight >= scrollHeight - 500) {
        if (hasMorePosts && !hashtagPost.loading) {
          const mainPostsLen = mainPosts.length;
          const lastId = mainPostsLen ? mainPosts[mainPostsLen - 1].id : 0; // 마지막 게시글의 id

          dispatch(loadHashtagPosts({ tag, lastId }));
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, tag, hashtagPost.loading, mainPosts.length]);

  return (
    <AppLayout>
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";

    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    console.log(context.params.tag);
    context.store.dispatch(loadMyinfo());
    context.store.dispatch(
      loadHashtagPosts({ tag: context.params.tag, lastId: 0 })
    );
    context.store.dispatch(END);

    await context.store.sagaTask.toPromise();
    return { props: {} };
  }
);

export default Hashtag;
