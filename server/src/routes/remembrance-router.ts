import { Router } from 'express';
import { remembranceService } from '../services';

const remembranceRouter = Router();

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

// 추모 글 수정
remembranceRouter.patch(
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
