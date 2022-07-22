import { Router } from 'express';
import {
    createCommentJoiSchema,
    deleteCommentJoiSchema,
    updateCommentJoiSchema,
} from '../db/schemas/joi-schemas';
import { ResComment, ResRemembrance } from '../db';
import { remembranceService, commentService } from '../services';

const remembranceRouter = Router();

// 전체 사망한 유저의 추모 데이터 조회
remembranceRouter.get('/', async (req, res, next) => {
    try {
        const remembrances: ResRemembrance[] =
            await remembranceService.getRemembrances();

        res.status(200).json(remembrances);
    } catch (error) {
        next(error);
    }
});

// 최근 업데이트된 추모 조회
remembranceRouter.get('/recent', async (req, res, next) => {
    try {
        // query로 받거나 8
        const count: number = Number(req.query.count) || 8;

        const recentRemembrances: ResRemembrance[] =
            await remembranceService.getRecentRemembrances(count);

        res.status(200).json(recentRemembrances);
    } catch (error) {
        next(error);
    }
});

// remembranceId로 특정 추모 조회
remembranceRouter.get('/:remembranceId', async (req, res, next) => {
    try {
        const { remembranceId } = req.params;

        const remembrance: ResRemembrance =
            await remembranceService.getRemembranceById(remembranceId);

        res.status(200).json(remembrance);
    } catch (error) {
        next(error);
    }
});

// 특정 추모글 조회 -> remembranceId를 사용하지 않는데 따로 빼는게 좋을까?
remembranceRouter.get(
    '/:remembranceId/comments/:commentId',
    async (req, res, next) => {
        try {
            const { commentId } = req.params;

            const comment: ResComment = await commentService.getCommentById(
                commentId,
            );

            res.status(200).json(comment);
        } catch (error) {
            next(error);
        }
    },
);

// 추모 글 추가
remembranceRouter.post('/:remembranceId/comments', async (req, res, next) => {
    try {
        const { remembranceId } = req.params;
        const { writer, title, content, password } = req.body;

        const commentInfo = {
            writer,
            title,
            content,
            password,
        };
        await createCommentJoiSchema.validateAsync(commentInfo);
        const newComment: ResComment = await commentService.addComment(
            remembranceId,
            commentInfo,
        );

        res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
});

// 추모 글 수정
remembranceRouter.patch(
    '/:remembranceId/comments/:commentId',
    async (req, res, next) => {
        try {
            const { commentId } = req.params;
            const { writer, title, content, password } = req.body;

            const commentInfo = {
                ...(writer && { writer }),
                ...(title && { title }),
                ...(content && { content }),
                password,
            };
            await updateCommentJoiSchema.validateAsync(commentInfo);
            const comment: ResComment = await commentService.setCommet(
                commentId,
                commentInfo,
            );

            res.status(200).json(comment);
        } catch (error) {
            next(error);
        }
    },
);

// 추모 글 삭제
remembranceRouter.delete(
    '/:remembranceId/comments/:commentId',
    async (req, res, next) => {
        try {
            const { remembranceId, commentId } = req.params;
            const password = req.get('password');
            if (!password) {
                throw new Error('비밀번호가 필요합니다.');
            }

            await deleteCommentJoiSchema.validateAsync(password);
            const result: { result: string } =
                await commentService.deleteComment(
                    remembranceId,
                    commentId,
                    password,
                );

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },
);

export { remembranceRouter };
