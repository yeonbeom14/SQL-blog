'use strict';

const express = require('express');
const { Users, Posts, Comments } = require('../models');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

// 댓글 생성 API
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { comment } = req.body;

  try {
    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
      return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }
    if (!comment) {
      return res.status(400).json({ errorMessage: '댓글 내용을 입력해주세요.' });
    }

    const createdComment = await Comments.create({
      UserId: userId,
      PostId: postId,
      comment,
    });

    return res.status(201).json({ comment: createdComment, message: '댓글을 작성하였습니다.' });
  } catch (err) {
    return res.status(400).json({ errorMessage: '댓글 작성에 실패하였습니다.' });
  }
});

// 댓글 목록 조회 API
router.get('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
      return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }

    const commentList = await Comments.findAll({
      raw: true,
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
      ],
      where: { PostId: postId },
      attributes: { exclude: ['PostId'] },
      order: [['createdAt', 'DESC']],
    });

    return res.json({ comments: commentList });
  } catch (err) {
    return res.status(400).json({ errorMessage: '댓글 조회에 실패하였습니다.' });
  }
});

//댓글 수정 api
router.put('/posts/:postId/comments/:commentId', authMiddleware, async (req, res) => {
  const commentId = req.params.commentId;
  const postId = req.params.postId;
  const { comment } = req.body;
  const { userId } = res.locals.user;

  try {
    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
      return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }
    if (!comment) {
      return res.status(400).json({ errorMessage: '댓글 내용을 입력해주세요.' });
    }

    const existComments = await Comments.findOne({ where: { commentId } });

    if (!existComments) {
      return res.status(404).json({ errorMessage: '댓글이 존재하지 않습니다.' });
    }

    if (existComments.UserId !== userId) {
      return res.status(401).json({ errorMessage: '댓글 수정 권한이 없습니다.' });
    }

    await Comments.update({ comment }, { where: { commentId } });

    return res.status(200).json({ message: '댓글을 수정하였습니다.' });
  } catch (err) {
    return res.status(400).json({ errorMessage: '댓글을 수정에 실패하였습니다.' });
  }
});

//댓글 삭제 api
router.delete('/posts/:postId/comments/:commentId', authMiddleware, async (req, res) => {
  const commentId = req.params.commentId;
  const postId = req.params.postId;
  const { userId } = res.locals.user;

  try {
    const existComments = await Comments.findOne({ where: { commentId } });
    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
      return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }

    if (!existComments) {
      return res.status(404).json({ errorMessage: '댓글이 존재하지 않습니다.' });
    }
    if (existComments.UserId !== userId) {
      return res.status(401).json({ errorMessage: '댓글 삭제 권한이 없습니다.' });
    }

    await Comments.destroy({ where: { commentId } });

    return res.status(200).json({ message: '댓글을 삭제하였습니다.' });
  } catch (err) {
    return res.status(400).json({ errorMessage: '댓글 삭제에 실패하였습니다.' });
  }
});

module.exports = router;
