import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { userService } from '../services/user-service';
import { sendMailTest } from '../services/mail-service';
import { registerJoiSchema } from '../db/schemas/joi-schemas/user-joi-schema';

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
 *     UserDelete:
 *       type: Object
 *       required:
 *         - currentPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *       example:
 *         currentPassword: "12345"
 *     UserUpdate:
 *       type: object
 *       required:
 *         - currentPassword
 *       properties:
 *         fullName:
 *           type: string
 *         password:
 *           type: string
 *         photo:
 *           type: string
 *           format: binary
 *         dateOfBirth:
 *           type: string
 *         currentPassword:
 *           type: string
 *       example:
 *         fullName: Steve Baek
 *         password: "12345"
 *         photo: imageURL
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
 *         receivers: ["motherId"]
 *     ReceiverPost:
 *       type: Object
 *       required:
 *         - fullName
 *         - emailAddress
 *         - relation
 *         - role
 *       properties:
 *         fullName:
 *           type: string
 *         emailAddress:
 *           type: string
 *         relation:
 *           type: string
 *         role:
 *           type: string
 *       example:
 *         fullName: 홍길동
 *         emailAddress: hong@email.com
 *         relation: brother
 *         role: basic-user
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags: [Users]
 *     summary: 유저 회원가입 용 API, 유저 정보를 DB에 등록
 *     description: 유저가 회원가입 post요청 시, fullName, email, password, repeatPassword, dateOfBirth를 req.body로 받아 유저 등록
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
            // const isValid = await registerJoiSchema.validateAsync({
            //     fullName,
            //     email,
            //     password,
            //     repeatPassword,
            //     dateOfBirth,
            // });

            const newUser = await userService.addUser({
                fullName,
                email,
                password,
                repeatPassword,
                dateOfBirth,
            });
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
 *     description: 유저의 이메일 주소와 비밀번호를 Request Body로 받아서 유저를 로그인 - user의 JWT token을 생성 후 유저아이디와 함께 반환
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
                        res.status(400).json({
                            result: 'error',
                            reason: info.message,
                        });
                        return; // throw로 여러개를 시도해 보았는데, throw로는 에러 해결이 잘 안됨.
                    }
                    req.login(user, { session: false }, (loginError) => {
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

                        res.status(200).json({
                            token,
                            userId: user._id,
                        });
                    });
                },
            )(req, res); // 이 부분은 수업 때나 지금이나 이해가 잘 안되지만 필요함.
        } catch (error) {
            next(error);
        }
    },
);
// 결국에는 한 유저의 유언장 목록을 전체 전송해야 할텐데, 이부분을 back에서 다 찾아서 전송하는 api가 맞을까, front가 client에서 여러번 요청을 하는게 나을까

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

export { usersRouter };
