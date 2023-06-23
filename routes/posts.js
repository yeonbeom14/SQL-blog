const express = require("express");
const { Posts, Users } = require("../models");
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

        const { nickname } = await Users.findOne({ where: { userId } });
        const createdPost = await Posts.create({ UserId: userId, Nickname: nickname, title, content });
        res.status(201).json({ post: createdPost, message: "게시글 작성에 성공하였습니다." });

    } catch (err) {
        return res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
    }
});

// 게시글 전체 조회 API
router.get("/posts", async (req, res) => {
    try {
        const posts = await Posts.findAll({
            attributes: { exclude: ['content'] },
            order: [['createdAt', 'DESC']]
        });

        res.json({ "posts": posts });
    } catch (err) {
        return res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
});
module.exports = router;