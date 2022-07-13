import { Router } from 'express';
import { remembranceService } from '../services';

const remembranceRouter = Router();

/**
 * @swagger
 * /api/remembrances?userId={userId}:
 *  post:
 *    tags:
 *    - Remembrances
 *    summary: "추모 데이터 생성"
 *    description: "userId로 유저 데이터 조회 후 해당 유저의 추모 데이터 생성"
 *
 *    parameters:
 *    - name: userId
 *      in: query
 *      required: true
 *      schema:
 *        type: string
 *        description: 유저의 objectId
 *        example: "62c7d6d0aa14441e00d23232"
 *    - name: body
 *      in: body
 *      schema:
 *        type: object
 *        properties:
 *          dateOfDeath:
 *            $ref: "#/definitions/Remembrance/properties/dateOfDeath"
 *
 *    responses:
 *      201:
 *        description: "추모 데이터 생성"
 *        schema:
 *          $ref: "#/definitions/Remembrance"
 */
// 추모 데이터 생성 - 언제?
remembranceRouter.post('/', async (req, res, next) => {
    try {
        // userId는 일단 쿼리로 받아오는거로 구현
        const { userId } = req.query;
        const { dateOfDeath } = req.body; // death 받아오나? - 생성 시점에 따라 다를듯

        const newRemembrance = await remembranceService.addRemembrance(
            userId as string,
            {
                dateOfDeath,
            },
        );

        res.status(201).json(newRemembrance);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/remembrances?count={count}:
 *  get:
 *    tags:
 *    - Remembrances
 *    summary: "최신 추모 데이터 조회"
 *    description: "최근 업데이트된 추모 데이터를 count 개수만큼 조회"
 *
 *    parameters:
 *    - name: count
 *      in: query
 *      required: true
 *      schema:
 *        type: number
 *        description: 가져올 데이터의 개수
 *        example: 8
 *
 *    responses:
 *      200:
 *        description: "여러개의 추모 데이터 조회"
 *        schema:
 *          type: array
 *          items:
 *            $ref: "#/definitions/Remembrance"
 */
// 최근 업데이트된 추모 조회
remembranceRouter.get('/', async (req, res, next) => {
    try {
        // 몇개 가져올지.. 일단은 query로 받는거로 구현
        const { count } = req.query;

        const recentRemembrances =
            await remembranceService.getRecentRemembrances(Number(count));

        res.status(200).json(recentRemembrances);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/remembrances/{remembranceId}:
 *  get:
 *    tags:
 *    - Remembrances
 *    summary: "특정 추모 데이터 조회"
 *    description: "remembranceId로 특정 추모 데이터 조회"
 *
 *    parameters:
 *    - name: remembranceId
 *      in: path
 *      required: true
 *      schema:
 *        $ref: "#/definitions/Remembrance/properties/_id"
 *
 *    responses:
 *      200:
 *        description: "하나의 추모 데이터 조회"
 *        schema:
 *          $ref: "#/definitions/Remembrance"
 */
// 특정 추모 조회
remembranceRouter.get('/:remembranceId', async (req, res, next) => {
    try {
        const { remembranceId } = req.params;

        const remembrance = await remembranceService.getRemembranceById(
            remembranceId,
        );

        res.status(200).json(remembrance);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/remembrances/{remembranceId}/comments/{commentId}:
 *  get:
 *    tags:
 *    - Comments
 *    summary: "특정 추모글 조회"
 *    description: "remembranceId와 commentId로 특정 추모의 특정 추모글 조회"
 *
 *    parameters:
 *    - name: remembranceId
 *      in: path
 *      required: true
 *      schema:
 *        $ref: "#/definitions/Remembrance/properties/_id"
 *    - name: commentId
 *      in: path
 *      required: true
 *      schema:
 *        $ref: "#/definitions/Comment/properties/_id"
 *
 *    responses:
 *      200:
 *        description: "하나의 추모글 조회"
 *        schema:
 *          type: object
 *          properties:
 *            _id:
 *              $ref: "#/definitions/Remembrance/properties/_id"
 *            comments:
 *              $ref: "#/definitions/Remembrance/properties/comments"
 */
// 특정 추모 글 조회
remembranceRouter.get(
    '/:remembranceId/comments/:commentId',
    async (req, res, next) => {
        try {
            const { remembranceId, commentId } = req.params;

            const comment = await remembranceService.getCommentById(
                remembranceId,
                commentId,
            );

            res.status(200).json(comment);
        } catch (error) {
            next(error);
        }
    },
);

/**
 * @swagger
 * /api/remembrances/{remembranceId}:
 *  patch:
 *    tags:
 *    - Remembrances
 *    summary: "추모 데이터 수정"
 *    description: "remembranceId로 추모 데이터 조회 후 수정"
 *
 *    parameters:
 *    - name: remembranceId
 *      in: path
 *      required: true
 *      schema:
 *        $ref: "#/definitions/Remembrance/properties/_id"
 *    - name: body
 *      in: body
 *      schema:
 *        type: object
 *        properties:
 *          fullName:
 *            $ref: "#/definitions/Remembrance/properties/fullName"
 *          dateOfBirth:
 *            $ref: "#/definitions/Remembrance/properties/dateOfBirth"
 *          dateOfDeath:
 *            $ref: "#/definitions/Remembrance/properties/dateOfDeath"
 *          isPublic:
 *            $ref: "#/definitions/Remembrance/properties/isPublic"
 *          photo:
 *            $ref: "#/definitions/Remembrance/properties/photo"
 *
 *    responses:
 *      201:
 *        description: "추모 데이터 수정"
 *        schema:
 *          $ref: "#/definitions/Remembrance"
 */
// 추모 수정
remembranceRouter.patch('/:remembranceId', async (req, res, next) => {
    try {
        const { remembranceId } = req.params;
        const { fullName, dateOfBirth, dateOfDeath, isPublic, photo } =
            req.body;

        const remembrance = await remembranceService.setRemembrance(
            remembranceId,
            {
                ...(fullName && { fullName }),
                ...(dateOfBirth && { dateOfBirth }),
                ...(dateOfDeath && { dateOfDeath }),
                ...(typeof isPublic === 'boolean' && { isPublic }),
                ...(photo && { photo }),
            },
        );

        res.status(201).json(remembrance);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/remembrances/{remembranceId}/comments:
 *  post:
 *    tags:
 *    - Comments
 *    summary: "추모글 생성"
 *    description: "remembrancId로 추모 데이터 조회 후 추모글 추가"
 *
 *    parameters:
 *    - name: remembranceId
 *      in: path
 *      required: true
 *      schema:
 *        $ref: "#/definitions/Remembrance/properties/_id"
 *    - name: body
 *      in: body
 *      schema:
 *        type: object
 *        properties:
 *          writer:
 *            $ref: "#/definitions/Comment/properties/writer"
 *          title:
 *            $ref: "#/definitions/Comment/properties/title"
 *          content:
 *            $ref: "#/definitions/Comment/properties/content"
 *          password:
 *            $ref: "#/definitions/Comment/properties/password"
 *
 *    responses:
 *      201:
 *        description: "추모글 생성"
 *        schema:
 *          $ref: "#/definitions/Remembrance"
 */
// 추모 글 추가
remembranceRouter.post('/:remembranceId/comments', async (req, res, next) => {
    try {
        const { remembranceId } = req.params;
        const { writer, title, content, password } = req.body;

        const newComment = await remembranceService.addComment(remembranceId, {
            writer,
            title,
            content,
            password,
        });

        res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/remembrances/{remembranceId}/comments/{commentId}:
 *  put:
 *    tags:
 *    - Comments
 *    summary: "추모글 수정"
 *    description: "remembranceId와 commentId로 추모글 조회 후 수정"
 *
 *    parameters:
 *    - name: remembranceId
 *      in: path
 *      required: true
 *      schema:
 *        $ref: "#/definitions/Remembrance/properties/_id"
 *    - name: commentId
 *      in: path
 *      required: true
 *      schema:
 *        $ref: "#/definitions/Comment/properties/_id"
 *    - name: body
 *      in: body
 *      schema:
 *        type: object
 *        properties:
 *          writer:
 *            $ref: "#/definitions/Comment/properties/writer"
 *          title:
 *            $ref: "#/definitions/Comment/properties/title"
 *          content:
 *            $ref: "#/definitions/Comment/properties/content"
 *          password:
 *            $ref: "#/definitions/Comment/properties/password"
 *
 *    responses:
 *      200:
 *        description: "추모글 수정"
 *        schema:
 *          $ref: "#/definitions/Remembrance"
 */
// 추모 글 수정
remembranceRouter.put(
    '/:remembranceId/comments/:commentId',
    async (req, res, next) => {
        try {
            const { remembranceId, commentId } = req.params;
            const { writer, title, content, password } = req.body;

            const comment = await remembranceService.setCommet(
                remembranceId,
                commentId,
                password,
                {
                    writer,
                    title,
                    content,
                    password,
                },
            );

            res.status(200).json(comment);
        } catch (error) {
            next(error);
        }
    },
);

/**
 * @swagger
 * /api/remembrances/{remembranceId}/comments/{commentId}:
 *  delete:
 *    tags:
 *    - Comments
 *    summary: "추모글 삭제"
 *    description: "remembranceId와 commentId로 추모글 조회 후 삭제"
 *
 *    parameters:
 *    - name: remembranceId
 *      in: path
 *      required: true
 *      schema:
 *        $ref: "#/definitions/Remembrance/properties/_id"
 *    - name: commentId
 *      in: path
 *      required: true
 *      schema:
 *        $ref: "#/definitions/Comment/properties/_id"
 *
 *    responses:
 *      201:
 *        description: "추모글 삭제"
 *        schema:
 *          type: object
 *          properties:
 *            result:
 *              type: string
 *              example: 'success'
 */
// 추모 글 삭제
remembranceRouter.delete(
    '/:remembranceId/comments/:commentId',
    async (req, res, next) => {
        try {
            const { remembranceId, commentId } = req.params;
            const { password } = req.body;

            const remembrance = await remembranceService.deleteComment(
                remembranceId,
                commentId,
                password,
            );
            if (remembrance) {
                res.status(201).json({ result: 'success' });
            }
        } catch (error) {
            next(error);
        }
    },
);

export { remembranceRouter };
