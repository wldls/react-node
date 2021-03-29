// import express from "express";
const express = require("express");
const postRouter = require("./routes/post");
const db = require("./models");
const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

app.get("/", (req, res) => {
  res.send("hello express");
});

app.get("/api", (req, res) => {
  res.send("Hello API");
});

app.get("/posts", (req, res) => {
  res.json([
    { id: 1, content: "hello" },
    { id: 2, content: "hello" },
    { id: 3, content: "hello" },
  ]);
});

app.use("/post", postRouter);

app.listen(3065, () => {
  console.log("서버 실행중");
});

// app.get: 가져오기
// app.post: 생성
// app.put: 전체수정
// app.delete: 제거
// app.patch: 부분수정
// app.options: 찔러보기
// app.head: 헤더만 가져오기
