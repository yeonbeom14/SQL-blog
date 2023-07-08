const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('블로그 백엔드 서버 입니다! GET URL 목록 : /posts, /posts/:postId');
});

module.exports = router;
