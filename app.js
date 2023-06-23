const express = require("express");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index.js");
const usersRouter = require("./routes/users.js");
const postsRouter = require("./routes/posts.js");
const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cookieParser());
app.use('/api', [indexRouter, usersRouter, postsRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
})