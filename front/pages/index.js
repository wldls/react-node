import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import { loadPost } from "../modules/post";
import { loadMyinfo } from "../modules/user";

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { retweet } = useSelector((state) => state.post);
  const { mainPosts, hasMorePosts, reqPost } = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    dispatch(loadMyinfo());
    dispatch(loadPost());
  }, []);

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
        if (hasMorePosts && !reqPost.loading) {
          const mainPostsLen = mainPosts.length;
          const lastId = mainPostsLen ? mainPosts[mainPostsLen - 1].id : 0; // 마지막 게시글의 id
          dispatch(loadPost(lastId));
        }
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, reqPost, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </AppLayout>
  );
};

export default Home;
