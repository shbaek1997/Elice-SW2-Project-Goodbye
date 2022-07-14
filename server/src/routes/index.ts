import { Router } from 'express';

const indexRouter = Router();

/* GET home page. */
indexRouter.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

export { indexRouter };
export * from './user-router';
export * from './auth-router';
export * from './remembrance-router';
