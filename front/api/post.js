import client from "./index";

export const loadPosts = (payload) =>
  client.get(`/posts?lastId=${payload || 0}`);

export const loadUserPosts = ({ id, lastId }) =>
  client.get(`/user/${id}/posts?lastId=${lastId || 0}`);

// api요청시 주소에 한글이 들어가면 에러가 발생하므로 encode 실행
export const loadHashtagPosts = ({ tag, lastId }) =>
  client.get(`/hashtag/${encodeURIComponent(tag)}?lastId=${lastId || 0}`);

export const loadPost = (payload) => client.get(`/post/${payload}`);

export const addPost = (payload) => client.post("/post", payload);
export const removePost = (payload) => client.delete(`/post/${payload}`);

// POST /post/1/comment
export const addComment = (payload) =>
  client.post(`/post/${data.postId}/comment`, payload); // 서버에 쿠키 전달

export const likePost = (payload) => client.patch(`/post/${payload}/like`);

export const unlikePost = (payload) => client.delete(`/post/${payload}/unlike`);

export const uploadImages = (payload) => client.post("/post/images", payload);
export const removeImages = (payload) => client.delete("/post/images", payload);

export const retweet = (payload) => client.post(`/post/${payload}/retweet`);
