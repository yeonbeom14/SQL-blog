const express = require('express');
const { Users, Posts } = require('../models');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

// 게시글 작성 API
router.post('/posts', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { title, content } = req.body;
  try {
    if (!title || !content) {
      return res.status(412).json({ errorMessage: '제목 또는 내용이 입력되지 않았습니다.' });
    }

    const createdPost = await Posts.create({
      UserId: userId,
      title,
      content,
    });
    return res.status(201).json({ post: createdPost, message: '게시글 작성에 성공하였습니다.' });
  } catch (err) {
    return res.status(400).json({ errorMessage: '게시글 작성에 실패하였습니다.' });
  }
});

// 게시글 전체 조회 API
router.get('/posts', async (req, res) => {
  try {
    const posts = await Posts.findAll({
      raw: true,
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
      ],
      attributes: { exclude: ['content'] },
      order: [['createdAt', 'DESC']],
    });

    return res.json({ posts: posts });
  } catch (err) {
    return res.status(500).json({ errorMessage: '게시글 조회에 실패하였습니다.' });
  }
});

// 게시글 상세 조회 API
router.get('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findOne({
      raw: true,
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
      ],
      where: { postId },
    });

    if (!post) {
      return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }
    return res.json({ post: post });
  } catch (err) {
    return res.status(400).json({ errorMessage: '게시글 조회에 실패하였습니다.' });
  }
});

//게시글 수정 API
router.put('/posts/:postId', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { title, content } = req.body;

  try {
    const updatedPost = await Posts.findOne({ where: { postId } });
    if (!updatedPost) {
      return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }
    if (!title || !content) {
      return res.status(412).json({ errorMessage: '제목 또는 내용이 입력되지 않았습니다.' });
    }
    if (userId !== updatedPost.UserId) {
      return res.status(403).json({ errorMessage: '게시글 수정의 권한이 존재하지 않습니다.' });
    }

    await Posts.update({ title, content }, { where: { postId } });
    return res.status(200).json({ message: '게시글을 수정하였습니다.' });
  } catch (err) {
    return res.status(400).json({ errorMessage: '게시글 수정에 실패하였습니다.' });
  }
});

//게시글 삭제 API
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;

  try {
    const deletedPost = await Posts.findOne({ where: { postId } });
    if (!deletedPost) {
      return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }
    if (userId !== deletedPost.UserId) {
      return res.status(403).json({ errorMessage: '게시글의 삭제 권한이 존재하지 않습니다.' });
    }

    await Posts.destroy({ where: { postId } });

    return res.status(200).json({ message: '게시글을 삭제하였습니다.' });
  } catch (err) {
    return res.status(400).json({ errorMessage: '게시글 삭제에 실패하였습니다.' });
  }
});

module.exports = router;
