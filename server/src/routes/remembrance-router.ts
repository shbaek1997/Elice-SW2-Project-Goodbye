import { Router } from 'express';
import { remembranceService, commentService } from '../services';

const remembranceRouter = Router();

// 전체 추모 데이터 조회
remembranceRouter.get('/', async (req, res, next) => {
    try {
        const remembrances = await remembranceService.getRemembrances();

        res.status(200).json(remembrances);
    } catch (error) {
        next(error);
    }
});

// 최근 업데이트된 추모 조회
remembranceRouter.get('/recent', async (req, res, next) => {
    try {
        // query로 받거나 8
        const count = Number(req.query.count) || 8;

        const recentRemembrances =
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

        const remembrance = await remembranceService.getRemembranceById(
            remembranceId,
        );

        res.status(200).json(remembrance);
    } catch (error) {
        next(error);
    }
});

// 특정 추모글 조회
remembranceRouter.get(
    '/:remembranceId/comments/:commentId',
    async (req, res, next) => {
        try {
            const { commentId } = req.params;

            const comment = await commentService.getCommentById(commentId);

            res.status(200).json(comment);
        } catch (error) {
            next(error);
        }
    },
);

// 추모 수정 - fullName, dateOfBirth, photo는 user data -> 언제 어떻게 변경?
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

// 추모 글 추가
remembranceRouter.post('/:remembranceId/comments', async (req, res, next) => {
    try {
        const { remembranceId } = req.params;
        const { writer, title, content, password } = req.body;

        const newComment = await commentService.addComment(remembranceId, {
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

// 추모 글 수정
remembranceRouter.patch(
    '/:remembranceId/comments/:commentId',
    async (req, res, next) => {
        try {
            const { commentId } = req.params;
            const { writer, title, content, password } = req.body;

            const comment = await commentService.setCommet(
                commentId,
                password,
                {
                    ...(writer && { writer }),
                    ...(title && { title }),
                    ...(content && { content }),
                },
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
            const { password } = req.body;

            const result = await commentService.deleteComment(
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
