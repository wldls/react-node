const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { Post, Comment, Image, User } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads 폴더가 없으므로 생성합니다.");
  fs.mkdirSync("uploads");
}

// Post /post
router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        { model: Image },
        {
          model: Comment,
          // 댓글작성자
          include: [{ model: User, attributes: ["id", "nickname"] }],
        },
        {
          // 게시글 작성자
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          // 좋아요 누른 사람
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const upload = multer({
  // diskStorage: 컴퓨터의 하드디스크에 저장
  storage: multer.diskStorage({
    // uploads라는 폴더에 저장
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자 추출
      const basename = path.basename(file.originalname, ext); // 파일 이름 추출
      const date = new Date();
      const newFilename = basename + date.getTime();
      +ext; // 저장 예) 이름38458214.png

      done(null, newFilename);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 업로드 제한: 20MB
});

router.post(
  "/images",
  isLoggedIn,
  upload.array("image"), // 한장만 올릴 경우 upload.single(), 이미지가 아니라 text나 json이면 upload.none, file input이 두 개 이상이면 upload.fills
  (req, res, next) => {
    // 이미지 업로드 후에 실행
    console.log(req.files); // 업로드한 이미지에 대한 정보가 들어있음
    // front에 파일정보를 보냄
    res.json(req.files.map((v) => v.filename));
  }
);

// DELETE /post
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: { id: req.params.postId, UserId: req.user.id },
    });
    res.status(200).json({ PostId: Number(req.params.postId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /post/1/comment
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: Number(req.params.postId),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(200).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// like
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }

    await post.addLikers(req.user.id);

    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// unlike
router.delete("/:postId/unlike", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }

    await post.removeLikers(req.user.id);

    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
