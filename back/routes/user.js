const express = require("express");
const bcrypt = require("bcrypt"); // 비밀번호 암호화 라이브러리
const passport = require("passport");

const { Op } = require("sequelize");
const { Post, User, Image, Comment } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

// myinfo: GET /user
router.get("/", async (req, res, next) => {
  try {
    console.log(req.headers);
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          { model: User, as: "Followings", attributes: ["id"] },
          { model: User, as: "Followers", attributes: ["id"] },
        ],
      });

      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Post /user
router.post("/", isNotLoggedIn, async (req, res, next) => {
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

// 로그인 시도시 passport를 사용해서 전략 실행
router.post("/login", isNotLoggedIn, (req, res, next) => {
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
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          { model: User, as: "Followings", attributes: ["id"] },
          { model: User, as: "Followers", attributes: ["id"] },
        ],
      });

      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.status(200).send("ok");
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);

    next(error);
  }
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(403).send("사용자가 없습니다.");
    }
    const followers = await user.getFollowers({
      limit: Number(req.query.limit),
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(403).send("사용자가 없습니다.");
    }
    const followings = await user.getFollowings({
      limit: Number(req.query.limit),
    });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET /user
// 다른 url을 불러올 때 userId라고 오해할 수 있으므로 params가 붙은 url은 아래쪽으로 내려주는 것이 좋다.
router.get("/:userId", async (req, res, next) => {
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: ["id"],
        },
        { model: User, as: "Followings", attributes: ["id"] },
        { model: User, as: "Followers", attributes: ["id"] },
      ],
    });

    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      // 타인의 정보를 가져올 때는 개인정보 보호를 위해 서버 측에서 갯수만 보내준다.
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;

      res.status(200).json(data);
    } else {
      res.status(404).send("존재하지 않는 사용자입니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// loadUserPosts: GET /user/1/posts
router.get("/:userId/posts", async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (user) {
      const lastId = Number(req.query.lastId);
      const where = {};

      if (lastId) {
        // 초기 로딩이 아닐 때(초기 로딩일 때는 최신순으로 10개)
        where.id = {
          [Op.lt]: lastId,
        };
      }

      const posts = await user.getPosts({
        where,
        limit: 10,
        order: [
          ["createdAt", "DESC"],
          [Comment, "createdAt", "DESC"],
        ],
        include: [
          {
            // 글 작성자
            model: User,
            attributes: ["id", "nickname"],
          },
          {
            // 글 작성자
            model: User,
            through: "Like",
            as: "Likers",
            attributes: ["id"],
          },
          {
            model: Post,
            as: "Retweet",
            include: [
              {
                model: User,
                attributes: ["id", "nickname"],
              },
              { model: Image },
            ],
          },
          {
            // 좋아요 누른 사람
            model: User,
            as: "Likers",
            attributes: ["id"],
          },
          { model: Image },
          {
            model: Comment,
            include: [{ model: User, attributes: ["id", "nickname"] }],
          },
        ],
        // offset: 0, // offset 부터 limit 개수까지 가져옴 - 게시글 추가 삭제시 문제가 발생
      });
      res.status(200).json(posts);
    } else {
      res.status(404).send("존재하지 않는 사용자입니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// PATCH /user/1/follow
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      return res.status(403).send("사용자가 없습니다.");
    }

    await user.addFollowers(req.user.id);

    res.status(200).json({ UserId: Number(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// DELETE /user/1/follow
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      return res.status(403).send("사용자가 없습니다.");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: Number(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// DELETE /user/follower/2
router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      return res.status(403).send("사용자가 없습니다.");
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: Number(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
