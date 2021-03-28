import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import { loadPost } from "../modules/post";

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user.login);
  const { mainPosts, hasMorePosts, reqPost } = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    dispatch(loadPost());
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY,
        clientHeight = document.documentElement.clientHeight,
        scrollHeight = document.documentElement.scrollHeight;

      if (scrollY + clientHeight >= scrollHeight - 500) {
        if (hasMorePosts && !reqPost.loading) {
          dispatch(loadPost());
        }
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, reqPost]);

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
