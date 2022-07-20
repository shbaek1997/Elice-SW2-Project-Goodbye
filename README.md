## **Project Goodbye (나중에 서비스명 정하기)**

### **소중한 사람들에게 유언장 작성 및 추모식을 진행할 수 있는 서비스입니다.**

<br>

### **Project Goodbye 이란?**

##### 1. 기획 의도, 목적

**유언장**

- 유언장은 보통 너무 무거운 분위기로 법적인 효력을 갖고 있는 문서로 갈등이 대상이 되는 무거운 편지입니다.
- 그렇게 딱딱한 유언장이라는 느낌보다는, 그동안 느꼈던 감정과 경험등을 소중한 사람들에게 편한 마음으로 전달할 수 있는 편지같이 전할 목적이 있습니다.
- 곧 죽음을 임박하지 않았더라도, 가장 친한 가족이나 친구를 신뢰하는 사람으로 지정하여 자신의 죽음 이후 유언장을 전송할 권한이 주어집니다.
- 보통 가족들이 아닌 이상 유언장을 쓰지도 않고, 전달 받지도 않지만 소중한 지인, 친구들에게도 편하게 유언장을 이메일로 열람할 수 있게 전달합니다.

**추모**

- 장례식은 모두가 다 참석하기도 어렵고, 그 때의 기억은 슬프지만 서서히 잊혀지는 경우가 많습니다.
- 추모 페이지를 통하여 지인/친구/가족의 죽음을 함께 슬퍼하고, 위로의 마음을 추모글 (댓글) 형태로 전달할 수 있습니다.
- 추모 페이지 및 추모글은 영구히 보존되어서 다음에 언제든지 지인이 그리울 때 다시 찾아올 수 있습니다.
- 추모글 내용은 작성 이후 하얀 국화 모양으로 변하여, 실제 장례식에 국화를 남기는 느낌을 받을 수 있습니다.

**부고 (구현이 되었다면)**

- 온라인에서의 추모뿐만 아니라 온라인 부고를 작성하여 현재 진행 중인 장례식 관한 정보 또한 지인들에게 전달할 수 있습니다.

##### 2. 웹 서비스의 주제 및, 최종적인 메인 기능과 서브 기능 설명

- 주제: 온라인 장례식
- 메인 기능

1. 유언장
   - 유언장 작성, 수정 및 등록
   - 유언장 작성 시 수신자 정보 등록 및 수정
2. 추모
   - 추모 생성
   - 추모 생성 시 사진 설정
   - 추모글 작성, 수정 및 등록
   - 추모글 작성 완료 시, 하얀 국화 이미지로 변환
3. 유언장/추모 링크 이메일 전송
   - 유언장과 추모 링크가 담긴 이메일 전송 기능
   - 이메일 전송 및 생사여부 확인을 위한 신뢰하는 사람 설정 가능
   - 유언장 열람 시, 이메일 주소 입력으로 권한 확인

- 서브 기능
  1.  부고 서비스
- 기타 기본 기능
  1.  로그인/회원가입 기능
  2.  마이페이지 기능

##### 3. 프로젝트만의 차별점, 기대 효과

- 기존의 딱딱하고, 법정 효력을 갖는 유언장은 보통 가족들에게만 전달되기에 여러 사람들에게 마지막 인사를 하기 어려움
- 유언장을 더 케쥬얼한 마음으로 작성을 할 수 있게 해주고, 이메일로 쉽게 열람이 가능한 구조
- 회원의 생사여부를 회원의 지인으로 회원이 정하여 설정하므로써, 회원이 죽었을 경우에 지인이 대신하여 추모와 유언장 전달이 가능한 구조
- 추모식 페이지에 진심이 담긴 추모글을 작성하므로써, 고인의 지인들과 함께 지인을 추억할 수 있는 공간 마련
- 부득이한 사유로 장례식을 참석하지 못하더라도, 온라인 추모 공간에서 슬픔을 공유할 수 있는 경험 제공
- 추모글을 하얀 국화 이미지로 추가되기에 좀 더 장례식과 비슷한 분위기 조성
<!-- - 기존 서비스의 단점 -> 본 프로젝트의 장점
- 본 웹서비스의 사용자가 경험할 효과 및 장점 -->

##### 4. 프로젝트 구성

**프론트엔드**

- [NextJs로 React기반의 NextJs 프로젝트 구성](https://nextjs.org/)
- [reduxjs/toolkit 활용하여 상태관리](https://redux-toolkit.js.org/)
- [redux를 활용하여 상태관리](https://react-redux.js.org/)
- [axios를 활용한 비동기 요청 처리](https://github.com/axios/axios)
- [AntDesign을 활용하여 CSS 스타일링](https://ant.design/)
- [Emotion을 활용한 component 스타일링](https://emotion.sh/docs/introduction)
- [NProgress를 활용한 진행중 표시](https://www.npmjs.com/package/nprogress)
- 더 있으면 적어주세요...
- 특이한 API라던가 모듈...

**백엔드**

- [ExpressJS로 web framework 구성](https://expressjs.com/)
- [TypeScript를 활용하여 서버 구성](https://www.typescriptlang.org/)
- [Draw.io로 ERD 작성]()
- [MongoDB의 MongoDB Atlas로 DB 사용](https://www.mongodb.com/ko-kr)
- [Mongoose를 활용하여 schema 설정과 index 설정](https://mongoosejs.com/)
- [JOI 모듈로 data 검증](https://joi.dev/api/)
- [Passport를 활용하여 passport-local, passport-jwt로 유저 로그인 구현](https://www.passportjs.org/)
- [Bcrypt 를 활용하여 user password 암호화](https://www.npmjs.com/package/bcrypt)
- [JsonWebToken과 passport-jwt로 stateless한 Restful한 서비스 구축](https://www.npmjs.com/package/jsonwebtoken)
- [Postman으로 API test](https://www.postman.com/)
- [Swagger open API로 API 문서 정리](https://swagger.io/)
- [Multer로 이미지 업로드 기능 구현](https://www.npmjs.com/package/multer)
- [AWS s3로 이미지 서버 기능 구현](https://aws.amazon.com/ko/s3/)
- [nodemailer를 활용하여 smtp 메일 전송 기능 구현](https://nodemailer.com/about/)
- [cors를 활용한 cors 에러 해결](https://www.npmjs.com/package/cors)

**기타**

- [와이어프레임으로 figma 사용](https://www.figma.com/file/B7WOz29ke8ZEAocjcvaPeR/Wireframe?node-id=0%3A1)
- [dotenv를 활용한 환경 변수 설정](https://www.npmjs.com/package/dotenv)

<!-- - 와이어프레임 (Figma 등 링크 삽입)
- 스토리보드 및 유저 시나리오
  - 홈 화면에서 어떤 버튼을 클릭하여 어떤 페이지로 이동할 수 있다.
  - 이 버튼을 클릭하면 이런 웹 서비스가 실행된다. -->

##### 5. 구성원 역할

프론트 분들이 누가 무엇을 했는지는 정확히 모르겠습니다...
| 이름 | 역할 | 구현 기능 |
| ------ | ------ | ------ |
|권강훈| 프론트엔드 담당 | 추모 페이지 작성, 홈페이지 구현? |
|백성호| 백엔드 담당/팀장 | nodemailer SMTP를 활용한 이메일 전송 기능, passport모듈을 활용한 회원가입 및 로그인 기능, 유언장/유저/수신자 스키마 및 관련 api 작성 등|
|이영민| 프론트엔드 담당 | 유저 회원가입, 로그인 페이지 구현, navBar 구현? |
|전가영| 백엔드 담당 | aws s3와 multer를 활용한 사진 업로드 기능 구현, 서비스 배포, 추모와 추모글 스키마 담당, remembranceRouter api 작성, typescript 초기 설정 등 |

##### 6. 버전

- 1.0.0
