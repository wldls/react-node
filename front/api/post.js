import client from "./index";

export const addPost = (data) => client.post("/post", { content: data });

// POST /post/1/comment
export const addComment = (data) =>
  client.post(`/post/${data.postId}/comment`, data); // 서버에 쿠키 전달
