const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const passportConfig = require("./passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");

const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const hashtagRouter = require("./routes/hashtag");
const db = require("./models");

dotenv.config();
const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

passportConfig();

app.use(morgan("dev"));

// 모든 요청에 cors 처리
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // 쿠키도 같이 전달
  })
);
app.use("/", express.static(path.join(__dirname, "uploads")));
// front에서 받은 데이터를 req.body 안에 넣어줌 반드시 맨위에 선언되어야 한다.
app.use(express.json()); // json형식의 데이터를 넣어줌
app.use(express.urlencoded({ extended: true })); // form submit 데이터를 넣어줌
// 세션에 저장
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);

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
