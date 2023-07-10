'use strict';

const express = require('express');
const { Op } = require('sequelize');
const { Users, Posts, Likes } = require('../models');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

//게시글 좋아요 api
router.put('/posts/:postId/likes', authMiddleware, async (req, res) => {
  const postId = req.params.postId;
  const { userId } = res.locals.user;

  try {
    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
      return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }

    const liked = await Likes.findOne({
      where: { [Op.and]: [{ UserId: userId }, { PostId: postId }] },
    });
    if (!liked) {
      await post.increment('likeCount', { by: 1 });
      await Likes.create({ UserId: userId, PostId: postId });

      return res.status(200).json({ message: '게시글의 좋아요를 등록하였습니다.' });
    } else {
      await post.decrement('likeCount', { by: 1 });
      await Likes.destroy({
        where: { [Op.and]: [{ UserId: userId }, { PostId: postId }] },
      });

      return res.status(200).json({ message: '게시글의 좋아요를 취소하였습니다.' });
    }
  } catch (err) {
    return res.status(400).json({ errorMessage: '게시글 좋아요에 실패하였습니다.' });
  }
});

// 좋아요 게시글 조회 API
router.get('/likes', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;

  try {
    const likedPosts = await Likes.findAll({
      raw: true,
      include: [
        {
          model: Posts,
          attributes: ['title', 'likeCount', 'createdAt'],
          include: [
            {
              model: Users,
              attributes: ['nickname'],
            },
          ],
        },
      ],
      where: { UserId: userId },
      order: [[{ model: Posts }, 'likeCount', 'DESC']],
    });

    return res.json({ posts: likedPosts });
  } catch (err) {
    return res.status(500).json({ errorMessage: '좋아요 게시글 조회에 실패하였습니다.' });
  }
});

module.exports = router;
