import axios from "axios";
// import client from "./index";

export const addPostAPI = (data) => axios.post("/api/addPost", data);
export const addCommentAPI = (data) =>
  axios.post(`/api/post/${data.postId}/comment`, data);
