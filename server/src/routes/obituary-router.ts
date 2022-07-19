import { Router } from 'express';
import { obituaryService } from '../services';

const obituaryRouter = Router();

// 부고 생성
obituaryRouter.post('/', async (req, res, next) => {
    try {
        const {
            deceased,
            dateOfBirth,
            dateOfDeath,
            sex,
            family,
            funeral,
            dateOfCremate,
            comment,
            password,
        } = req.body;

        const newObituary = await obituaryService.addObituary({
            deceased,
            dateOfBirth,
            dateOfDeath,
            sex,
            family,
            funeral,
            dateOfCremate,
            comment,
            password,
        });

        res.status(201).json(newObituary);
    } catch (error) {
        next(error);
    }
});

// 특정 부고 조회
obituaryRouter.get('/:obituaryId', async (req, res, next) => {
    try {
        const { obituaryId } = req.params;

        const obituary = await obituaryService.getObituaryById(obituaryId);

        res.status(200).json(obituary);
    } catch (error) {
        next(error);
    }
});

// 부고 수정
obituaryRouter.patch('/:obituaryId', async (req, res, next) => {
    try {
        const { obituaryId } = req.params;
        const {
            deceased,
            dateOfBirth,
            dateOfDeath,
            sex,
            family,
            funeral,
            dateOfCremate,
            comment,
            password,
        } = req.body;

        const obituary = await obituaryService.setObituary(
            obituaryId,
            password,
            {
                ...(deceased && { deceased }),
                ...(dateOfBirth && { dateOfBirth }),
                ...(dateOfDeath && { dateOfDeath }),
                ...(sex && { sex }),
                ...(family && { family }),
                ...(funeral && { funeral }),
                ...(dateOfCremate && { dateOfCremate }),
                ...(comment && { comment }),
            },
        );

        res.status(201).json(obituary);
    } catch (error) {
        next(error);
    }
});

// 부고 삭제
obituaryRouter.delete('/:obituaryId', async (req, res, next) => {
    try {
        const { obituaryId } = req.params;
        const { password } = req.body;

        const result = await obituaryService.deleteObituary(
            obituaryId,
            password,
        );

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

export { obituaryRouter };
