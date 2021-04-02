import client from "./index";

export const loadPost = () => client.get("/posts");
export const addPost = (payload) => client.post("/post", { content: payload });
export const removePost = (payload) => client.delete(`/post/${payload}`);

// POST /post/1/comment
export const addComment = (payload) =>
  client.post(`/post/${data.postId}/comment`, payload); // 서버에 쿠키 전달

export const likePost = (payload) => client.patch(`/post/${payload}/like`);

export const unlikePost = (payload) => client.delete(`/post/${payload}/unlike`);

export const uploadImages = (payload) => client.post("/post/images", payload);
