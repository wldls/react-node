const express = require("express");
const bcrypt = require("bcrypt"); // 비밀번호 암호화 라이브러리
const { User } = require("../models"); // 구조분해할당
const router = express.Router();

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
      return res.status(403).sned("이미 사용중인 아이디입니다.");
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
