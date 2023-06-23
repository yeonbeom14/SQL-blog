const express = require("express");
const { Posts } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

// 게시글 작성 API
router.post("/posts", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { title, content } = req.body;
    try {
        if (!req.body) {
            return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
        }
        if (!title) {
            return res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
        }
        if (!content) {
            return res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
        }

        const createdPost = await Posts.create({ UserId: userId, title, content });
        res.status(201).json({ post: createdPost, message: "게시글 작성에 성공하였습니다." });

    } catch (err) {
        return res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
    }
});

module.exports = router;