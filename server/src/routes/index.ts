import express, { Router } from 'express';
import path from 'path';

const indexRouter = Router();

/* GET home page. */
indexRouter.use(
    '/',
    express.static(path.join(__dirname, '../views'), { index: 'index.html' }),
);

export { indexRouter };
export * from './user-router';
export * from './auth-router';
export * from './remembrance-router';
