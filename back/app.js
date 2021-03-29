// import express from "express";
const express = require("express");
const cors = require("cors");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const db = require("./models");
const passportConfig = require("./passport");
const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

passportConfig();

// 모든 요청에 cors 처리
app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);
// front에서 받은 데이터를 req.body 안에 넣어줌 반드시 맨위에 선언되어야 한다.
app.use(express.json()); // json형식의 데이터를 넣어줌
app.use(express.urlencoded({ extended: true })); // form submit 데이터를 넣어줌

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
app.use("/user", userRouter);

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