# sql-blog

내배캠 블로그 백엔드 서버 mySQL, sequelize 적용

API 명세

회원가입 /signup POST
로그인 /login POST

게시글 작성 /posts POST
게시글 조회 /posts GET
게시글 상세 조회 /posts/:postId GET
게시글 수정 /posts/:postId PUT
게시글 삭제 /posts/:postId DELETE

댓글 생성 /posts/:postId/comments POST
댓글 목록 조회 /posts/:postId/comments GET
댓글 수정 /posts/:postId/comments/:commentId PUT
댓글 삭제 /posts/:postId/comments/:commentId DELETE

게시글 좋아요 /posts/:postId/likes PUT
좋아요 게시글 조회 /likes GET
