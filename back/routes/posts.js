const express = require("express");
const { Post, User, Image, Comment } = require("../models");

const router = express.Router();

// GET /posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      // where: { id: lastId },
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
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
