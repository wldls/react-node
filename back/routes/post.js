const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { Post, Comment, Image, User, Hashtag } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads 폴더가 없으므로 생성합니다.");
  fs.mkdirSync("uploads");
}

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
      // const date = new Date();
      const newFilename = `${basename}_${new Date().getTime()}${ext}`; // 저장 예) 이름38458214.png

      console.log(newFilename);

      done(null, newFilename);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 업로드 제한: 20MB
});

// Get /post/1
router.get("/:postId", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(404).send("존재하지 않는 게시글입니다.");
    }

    // 리트윗한 게시글 확인
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
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
    });

    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Post /post
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);

    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });

    // 해시태그가 있을 때
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          // #을 제외한 나머지 글자를 Hashtag db에 저장 - 중복 제외(findOrCreate)
          Hashtag.findOrCreate({ where: { name: tag.slice(1).toLowerCase() } })
        )
      ); // 예상결과 : [test, true] 이므로 addHashtags에서 v[0]만 추가
      await post.addHashtags(result.map((v) => v[0]));
    }

    // 이미지가 있을 때
    if (req.body.image) {
      // 들어오는 이미지가 한 개인지 여러 개인지 구분
      if (Array.isArray(req.body.image)) {
        // 이미지를 여러 개 올리면 image: [test1.png, test2.png] 형식으로 들어옴
        const images = await Promise.all(
          // Promise.all: 각 Image create promise를 한 번에 실행하도록 함
          req.body.image.map((image) => Image.create({ src: image }))
        );
        // post create에 images 추가
        await post.addImages(images);
      } else {
        // 이미지를 하나만 올리면 image: test.png
        const images = await Image.create({ src: req.body.image });
        // post create에 images 추가
        await post.addImages(images);
      }
    }

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
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
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

// POST /post/retweet
router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });

    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }

    // 내 게시글을 리트윗 하거나, 누군가가 내 게시글을 리트윈 한 글을 내가 다시 리트윗 하는 경우는 막아줌
    if (
      req.user.id === post.UserId ||
      (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send("자신의 글은 리트윗 할 수 없습니다.");
    }

    // 이미 리트윗 된 글이면 retweet id를, 아니면 post id를 사용
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });

    if (exPost) {
      return res.status(403).send("이미 리트윗했습니다.");
    }

    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: post.content,
    });

    // 리트윗한 게시글 확인
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
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
    });

    res.status(200).json(retweetWithPrevPost);
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
