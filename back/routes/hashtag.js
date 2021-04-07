const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Post, Hashtag, Image, Comment, User } = require("../models");

// GET /hashtag/:hashtag
router.get("/:hashtag", async (req, res, next) => {
  try {
    const lastId = Number(req.query.lastId);
    const where = {};

    if (lastId) {
      // 초기 로딩이 아닐 때(초기 로딩일 때는 최신순으로 10개)
      where.id = {
        [Op.lt]: parseInt(lastId),
      };
    }

    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        // [Comment, "createdAt", "DESC"],
      ],
      include: [
        {
          model: Hashtag,
          where: { name: req.params.hashtag },
        },
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
