# 기술스택

---

1. Nest.JS with Typescript
2. GraphQL
3. TypeORM
4. PostgreSQL

# 실행 방법

---

Pre-requirement : Docker, Docker Compose, node.js, npm, yarn

- Docker(& Docker Compose) Installation Guide : https://docs.docker.com/get-docker/
- Node.JS(& NPM) Installer : https://nodejs.org/en/
- Yarn Package Manager : Use following commands

```
$ npm install -g yarn
$ yarn --version
$ export PATH="$PATH:/opt/yarn-[version]/bin"
```

1. Clone this repository to any directory on your desktop
2. Go to root directory of cloned repository and make new file titled '.env'
3. Open .env and copy all ENV contents at the bottom of this document
4. Replace keys with the strong password (anything will be okay), save and close
5. Go to Terminal, move to repository directory and run following commands

```
$ docker compose -f docker-compose.yaml up --build
```

- If this command is not working, your docker compose is probably v1. Use this command instead.

```
$ docker-compose -f docker-compose.yaml up --build
```

- You can check your docker and docker compose version by following commands

```
$ docker --version
$ docker compose version
$ docker-compose version
# If these command not working, follow official guide
```

6. To Access GraphQl Playground, open browser and go to http://localhost:4000

- Note that your server is running at port 4000 if no changes on ENV(SERVER_PORT)
- Your database is running at port 5432 (DEFAUTL ID AND PASSWORD IS 'postgres')
- If you want to change Database's user ID or Password, please change ENV value of DB_USER and DB_PASS (DB_NAME shoud never be changed)


# 구현 API 목록

---

### Queries

- fetchMember - 로그인된 유저의 정보 조회
- fetchBoardDetail - 게시글 정보 조회
- fetchMyBoardList - 로그인된 유저가 올린 게시글 리스트 조회
- fetchBoardList - 전체 게시글 리스트 조회
- searchBoardList - 게시글 검색
- fetchMyReplies - 내 댓글 검색
- fetchRepliesByBoardId - 게시글 별 댓글 조회
- fetchSlaveReplies - 댓글 별 대댓글 조회

### Mutations

- login - 로그인 기능
- logout - 로그아웃 기능
- restore - accessToken 만료시 refreshToken으로 재발급 기능
- createMember - 회원가입
- updatePassword - 회원정보 수정 (비밀번호 변경)
- updateEmail - 회원정보 수정 (이메일 변경)
- deleteMember - 회원 탈퇴
- createBoard - 게시글 작성
- updateBoard - 게시글 수정
- deleteBoard - 게시글 삭제
- createReply - 댓글 작성
- updateReply - 댓글 수정
- deleteReply - 댓글 삭제

# ERD

---

<image width= "100%" alt="image" src="https://s3.brian-hong.tech/public/Screenshot%202023-01-05%20at%202.28.28%20PM.png">

# ENV

---

- DO NOT CHANGE THE VALUES WITHOUT ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, AUTH_ACCESS_GUARD, AUTH_REFRESH_GUARD

```
TZ=Asia/Seoul

SERVER_PORT=4000

REDIS_HOST=redis
REDIS_PORT=6379

DB_HOST=database
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=postgres

ALLOWED_HOSTS=http://localhost:3000,https://localhost:3000,http://localhost:4000,https://localhost:4000,http://localhost:5500,https://localhost:5500

ACCESS_TOKEN_KEY=여기에 엑세스 토큰 암호화 키를 작성하여 주세요
REFRESH_TOKEN_KEY=여기에 리프레시 토큰 암호화 키를 작성하여 주세요

AUTH_ACCESS_GUARD=여기에 엑세스 가드 비밀키를 작성하여 주세요
AUTH_REFRESH_GUARD=여기에 리프레시 가드 비밀키를 작성하여 주세요
```
