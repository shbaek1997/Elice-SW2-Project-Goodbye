import { Request, Response, NextFunction } from 'express';

function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    res.status(404).json({ result: 'error', reason: 'Page not found' });
}

export { notFoundHandler };
