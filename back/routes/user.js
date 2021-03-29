const express = require("express");
const bcrypt = require("bcrypt"); // 비밀번호 암호화 라이브러리
const { User } = require("../models"); // 구조분해할당
const router = express.Router();
const passport = require("passport");

// 로그인 시도시 passport를 사용해서 전략 실행
router.post("/login", (req, res, next) => {
  // passport authenticate에서 req, res, next를 사용하기 위해 미들웨어를 확장하는 방법 사용
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    // passport login 사용
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.json(user);
    });
  })(req, res, next);
});

// Post /user
router.post("/", async (req, res, next) => {
  try {
    // db에 동일 데이터가 있는지 확인
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });

    res.status(200).send("ok");
  } catch (error) {
    console.error(error);
    next(error); // status 500
  }
});

module.exports = router;
