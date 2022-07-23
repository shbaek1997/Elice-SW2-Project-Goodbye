# :pen_ballpoint: Project GoodBye
## 01 서비스 소개

> 소중한 사람들에게 전하는 마지막 인사, **GoodBye**

유언장, 어떤 이미지가 떠오르시나요?
마지막에 대한 무거움, 갈등의 대상과 법적 효력의 딱딱함. 저희가 떠올린 이미지는 이러합니다.
조금 더 편안한 분위기로, 소중한 사람들에게 추억과 감정을 공유할 수 있는 서비스를 생각했습니다.

마지막을 앞두지 않아도, 가족이 아닌 사람에게도, 언제든 누구에게든 편하게 글을 남길 수 있습니다. 고인이 된 이후에 작성된 유언장들은 **이메일을 통해** 수신자에게 전달됩니다. 남겨진 사람들은 **추모 페이지**를 통해 고인에 대한 그리움과 추억을 공유할 수 있어요.

<br>

[서비스 바로가기](http://kdt-sw2-seoul-team11.elicecoding.com) | [기획 바로가기](https://kdt-gitlab.elice.io/sw_track/class_02_seoul/web_project_2/team11/project-goodbye/-/wikis/기획) | [API 문서 바로가기](https://kdt-gitlab.elice.io/sw_track/class_02_seoul/web_project_2/team11/project-goodbye/-/blob/dev/server/swagger.yaml)

<br>
<br>

## 02 기능
<br>

**사용자는 유언장을 작성할 수 있습니다.**
- 여러장의 유언장을 작성할 수 있고, 한 유언장을 여러명에게 전달 할 수 있습니다.
- 작성한 유언장의 내용과 수신자는 언제든지 수정 및 삭제가 가능합니다.

<br>

**고인의 추모 공간이 마련됩니다.**
- 고인이 생전에 서비스의 회원이었다면, 개별 추모 페이지가 생성됩니다.
- 고인으로부터 유언장을 전달받은 사람이라면 누구나 추모의 글을 남길 수 있습니다.
- 오랜 시간이 지나도 고인을 추억할 수 있도록 영구히 저장됩니다.

<br>

**메일 기반 서비스입니다.**
- 유저가 고인이 되면 유언장과 추모 페이지는 미리 지정한 수신자에게 이메일로 전송됩니다.
- 유저가 사망 처리를 맡길 유저를 이메일로 초대 및 등록할 수 있습니다.

<br>

_조금 더 자세한 내용은 Wiki Page를 이용해주세요._
> [:envelope: 유언장 관련 기능](https://kdt-gitlab.elice.io/sw_track/class_02_seoul/web_project_2/team11/project-goodbye/-/wikis/유언장)<br>   
[:reminder_ribbon: 추모 관련 기능](https://kdt-gitlab.elice.io/sw_track/class_02_seoul/web_project_2/team11/project-goodbye/-/wikis/추모)<br>   
[:busts_in_silhouette: 회원 관련 기능](https://kdt-gitlab.elice.io/sw_track/class_02_seoul/web_project_2/team11/project-goodbye/-/wikis/회원)

<br>
<br>

## 03 실행
**Frontent** - NextJs   
```bash
# 개발
npm run dev

# 배포
npm run build
npm run start
```
<br>

**Backend** - Typescript   
```bash
# 개발
npm run dev

# 배포
npm run start
```

<br>
<br>

## 04 기술 스택
<br>

<p align="center"><a href="https://nextjs.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" height="70"/></a>　　　　　　<a href="https://react-redux.js.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/4/49/Redux.png" height="80"/></a></p>
<p align="center"><a href="https://nodejs.org"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" height="70"/></a>　　　　　　<a href="https://expressjs.com"><img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" height="50"/></a>　　　　　　<a href="https://www.typescriptlang.org"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" height="60"/></a></p>
<p align="center"><a href="https://www.mongodb.com"><img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" height="60"/></a></p>
<img src="https://kdt-gitlab.elice.io/sw_track/class_02_seoul/web_project_2/team11/project-goodbye/-/wikis/uploads/67cea2a78ba61f0df459658e99e2dc12/image.png" width="500" />
<br>
<details><summary><strong>Frontend</strong></summary>
<ul>
    <li>[NextJs 프로젝트](https://nextjs.org/)</li>
    <li>[상태관리 - reduxjs/toolkit](https://redux-toolkit.js.org/)</li>
    <li>[axios 요청](https://github.com/axios/axios)</li>
    <li>[AntDesign 스타일링](https://ant.design/)</li>
    <li>[Emotion 스타일링](https://emotion.sh/docs/introduction)</li>
    <li>[NProgress](https://www.npmjs.com/package/nprogress)</li>
</ul>
</details>
<details><summary><strong>Backend</strong></summary>
<ul>
    <li>[ExpressJS framework](https://expressjs.com/)</li>
    <li>[TypeScript](https://www.typescriptlang.org/)</li>
    <li>[MongoDB Atlas](https://www.mongodb.com/ko-kr)</li>
    <li>[JOI validator](https://joi.dev/api/)</li>
    <li>[Passport 유저 인증](https://www.passportjs.org/)</li>
    <li>[Bcrypt 암호화](https://www.npmjs.com/package/bcrypt)</li>
    <li>[JsonWebToken](https://www.npmjs.com/package/jsonwebtoken)</li>
    <li>[Swagger open API](https://swagger.io/)</li>
    <li>[Multer](https://www.npmjs.com/package/multer)</li>
    <li>[AWS s3 및 cloudfront](https://aws.amazon.com/ko/s3/)</li>
    <li>[smtp - nodemailer](https://nodemailer.com/about/)</li>
    <li>[cors](https://www.npmjs.com/package/cors)</li>
</ul>
</details>

<br>
<br>

## 04 팀원 소개

| 이름 | 포지션 | 담당 |
|:-----:|:-------:|-----|
| 백성호<br><a href="https://github.com"><img src="/uploads/47560f0a69d63c70afc02fbb0fac3a0b/free-icon-github-logo-25231.png" width="20" height="20"/></a> | _팀장_<br>BE | 유저 및 유언장 관련 API 구현, 이메일 전송 기능 구현 |
| 권강훈<br><a href="https://github.com"><img src="/uploads/47560f0a69d63c70afc02fbb0fac3a0b/free-icon-github-logo-25231.png" width="20" height="20"/></a> | FE | 메인·추모·유언장 목록·수신자 목록 페이지 구현, 페이지네이션 컴포넌트 구현 |
| 이영민<br><a href="https://github.com"><img src="/uploads/47560f0a69d63c70afc02fbb0fac3a0b/free-icon-github-logo-25231.png" width="20" height="20"/></a> | FE | 회원가입 및 로그인·마이페이지·유언장 상세 페이지 구현, 권한 부여 로직 처리 |
| 전가영<br><a href="https://github.com/dsyhwk1016"><img src="/uploads/47560f0a69d63c70afc02fbb0fac3a0b/free-icon-github-logo-25231.png" width="20" height="20"/></a> | BE | 추모 및 추모글 관련 API 구현, 이미지 업로드 기능 구현, 서비스 배포 |
