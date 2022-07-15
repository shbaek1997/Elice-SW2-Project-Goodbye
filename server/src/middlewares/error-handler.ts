import { Request, Response, NextFunction } from 'express';

function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    console.log('\x1b[33m%s\x1b[0m', error.stack);
    res.status(400).json({ result: 'error', reason: error.message });
}

export { errorHandler };


