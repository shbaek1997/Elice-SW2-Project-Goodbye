import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {
    userService,
    remembranceService,
    willService,
    sendMailTest,
} from '../services';
import { registerJoiSchema } from '../db/schemas/joi-schemas';

const usersRouter = Router();

/* GET users listing. */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     InputEmail:
 *       type: Object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *       example:
 *         email: "email@email.com"
 *     UserDelete:
 *       type: Object
 *       required:
 *         - currentPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *       example:
 *         currentPassword: "12345"
 *     ConfirmDeath:
 *       type: Object
 *       required:
 *         - dateOfDeath
 *       properties:
 *         dateOfDeath:
 *           type: string
 *       example:
 *         dateOfDeath: "2022-07-20"
 *     UserUpdate:
 *       type: object
 *       required:
 *         - currentPassword
 *       properties:
 *         fullName:
 *           type: string
 *         password:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *         currentPassword:
 *           type: string
 *       example:
 *         fullName: Steve Baek
 *         password: "12345"
 *         currentPassword: "12345"
 *         dateOfBirth: "970623"
 *     Register:
 *       type: Object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - repeatPassword
 *         - dateOfBirth
 *       properties:
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         repeatPassword:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *       example:
 *         fullName: Steve Baek
 *         email: email@email.com
 *         password: abcde123
 *         repeatPassword: abcde123
 *         dateOfBirth: "970623"
 *     Email:
 *       type: Object
 *       required:
 *         - receivers
 *         - subject
 *         - html
 *       properties:
 *         receivers:
 *           type: array
 *         subject:
 *           type: string
 *         html:
 *           typee: string
 *       example:
 *         receivers: ["email@email.com","example@email.com"]
 *         subject: Hello
 *         html: <h1>Hello world</h1>
 *     TrustedUserInfo:
 *       type: Object
 *       required:
 *         - email
 *         - currentPassword
 *       properties:
 *         email:
 *           type: string
 *         currentPassword:
 *           type: string
 *       example:
 *         email: example@email.com
 *         currentPassword: '12345678'
 *     UserLogin:
 *       type: Object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         email: email@email.com
 *         password: "12345"
 *     User:
 *       type: Object
 *       properties:
 *         email:
 *           type: string
 *         fullName:
 *           type: string
 *         password:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *         wills:
 *           type: array
 *         receivers:
 *           type: array
 *         _id:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *     WillPost:
 *       type: Object
 *       required:
 *         - title
 *         - content
 *         - receivers
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         receivers:
 *           type: array
 *       example:
 *         title: 어머니에게
 *         content: 사랑하는 어머니에게...
 *         receivers: [{receiverId, email}]
 *     ReceiverPost:
 *       type: Object
 *       required:
 *         - fullName
 *         - emailAddress
 *         - relation
 *       properties:
 *         fullName:
 *           type: string
 *         emailAddress:
 *           type: string
 *         relation:
 *           type: string
 *       example:
 *         fullName: 홍길동
 *         emailAddress: hong@email.com
 *         relation: brother
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags: [Users]
 *     summary: 유저 회원가입 용 API, 유저 정보를 DB에 등록
 *     description: 유저가 회원가입 post요청 시, fullName, email, password, repeatPassword, dateOfBirth를 req.body로 받아 유저 등록, 추모 데이터 생성
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: newUser as JSON
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 */
usersRouter.post(
    '/register',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // is 를 사용해서 body를 확인해 줄까?

            const { fullName, email, password, repeatPassword, dateOfBirth } =
                req.body;
            const isValid = await registerJoiSchema.validateAsync({
                fullName,
                email,
                password,
                repeatPassword,
                dateOfBirth,
            });

            const newUser = await userService.addUser({
                fullName,
                email,
                password,
                repeatPassword,
                dateOfBirth,
            });

            // 생성된 유저 정보로 추모 데이터 생성
            const userId = newUser._id.toString();
            const remembranceInfo = {
                userId,
                fullName,
                dateOfBirth,
            };
            remembranceService.addRemembrance(remembranceInfo);

            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    },
);
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: 유저의 이메일 주소와 비밀번호로 유저를 로그인시키는 API
 *     description: 유저의 이메일 주소와 비밀번호를 Request Body로 받아서 유저를 로그인 - user의 JWT token을 생성 후 유저아이디, remembranceId와 함께 반환
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: user token과 userId를 JSON 형태로 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 */
usersRouter.post(
    '/login',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // is 로 req body 확인?
            passport.authenticate(
                'local',
                { session: false },
                (error, user, info) => {
                    // 성공적으로 유저가 있어야 유저 객체가 생기고,
                    // 유저 인증 실패시 유저는 자동으로 false;
                    if (error || !user) {
                        // 인증 성공을 해야 유저 객체가 생겨서 JOI로 검증하기 어려움...
                        // passport 인증 실패 or 유저가 없으면 error
                        next(info);
                        return;
                    }
                    req.login(user, { session: false }, async (loginError) => {
                        // login을 하면
                        if (loginError) {
                            res.status(400).send(loginError);
                            return;
                        }
                        const secretKey =
                            process.env.JWT_SECRET_KEY || 'secret-key'; // login 성공시 key값을 써서 토큰 생성
                        const token = jwt.sign(
                            { userId: user._id },
                            secretKey,
                            {
                                expiresIn: '7d',
                            },
                        );
                        // console.log(user);

                        res.status(200).json({
                            token,
                            userId: user._id,
                        });
                    });
                },
            )(req, res, next); // 이 부분은 수업 때나 지금이나 이해가 잘 안되지만 필요함.
        } catch (error) {
            next(error);
        }
    },
);
// 결국에는 한 유저의 유언장 목록을 전체 전송해야 할텐데, 이부분을 back에서 다 찾아서 전송하는 api가 맞을까, front가 client에서 여러번 요청을 하는게 나을까

/**
 * @swagger
 * /api/users/sendEmail:
 *   post:
 *     tags: [Users]
 *     summary: 기본적인 receivers, subject, html 정보를 받아서 이메일은 전송 시키는 API
 *     description: receivers로 보낼 이메일 주소가 담긴 배열, subject로 이메일 제목, html로 html형식의 string을 받아서 이메일을 전송 시키는 api
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Email'
 *     responses:
 *       200:
 *         description: 성공적으로 이메일이 보내지면 result- success를 JSON 형태로 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 */
usersRouter.post(
    '/sendEmail',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // is 를 사용해서 body를 확인해 줄까?
            const { receivers, subject, html } = req.body;
            sendMailTest(receivers, subject, html);
            res.status(200).json({ result: 'success' });
        } catch (error) {
            next(error);
        }
    },
);

// email로 온 유언장을 열람했을 경우, 해당 유저의 유언장 안의 수신자 목록의 이메일과 일치하는지 확인 후, 열람이 되게 하는 API
// 유언장 링크를 타고 열람을 하면, 모달 창 같은 방식으로 열람한 사람의 이메일 주소를 입력받게 함.

/**
 * @swagger
 * /api/users/:willId:
 *   post:
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: willId
 *         schema:
 *           type: string
 *         required: true
 *     summary: 기본적인 willId 정보와 유언장을 열람하고자 하는 사람의 email주소를 받아서 willId의 receiver 등록 정보와 일치하는지 확인 후 그 유언장 정보를 반환하는 API
 *     description: willId로 유언장을 조회하여 유언장 정보에 있는 receivers 배열을 통하여 receivers의 이메일 주소들을 확인, 그 중에 body로 입력받은 이메일과 일치한다면 권한이 있는 것이므로 유언장 정보를 JSON으로 반환
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InputEmail'
 *     responses:
 *       200:
 *         description: willId로 찾은 will을 JSON 형태로 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 */
usersRouter.post(
    '/:willId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // is 를 사용해서 body를 확인해 줄까?
            const { willId } = req.params;
            const { email } = req.body;
            const will = await willService.findWill(willId);
            // will 안의 receivers는 receiver Id가 등록되어 있고,
            const { receivers }: any = will;
            const matchedReceiver = receivers.find(
                (receiver) => receiver.email === email,
            );
            if (!matchedReceiver) {
                throw new Error('올바르지 않은 이메일 주소입니다.');
            }
            res.status(200).json({ will });
        } catch (error) {
            next(error);
        }
    },
);
export { usersRouter };
