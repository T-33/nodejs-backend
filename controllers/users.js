import Router from 'koa-router';
import Joi from 'joi';
import { getAllUsers, getUserById } from '../services/index.js';

export const usersRouter = new Router();

usersRouter.get('/users', async (ctx) => {
    const allUsers = await getAllUsers();

    ctx.body = {
        users: allUsers,
    };
    ctx.status = 200;
});

usersRouter.get('/users/:id', async (ctx) => {
    const user = await getUserById(ctx.params.id);

    ctx.body = {
        user,
    };
    ctx.status = 200;
});

usersRouter.get('/', async (ctx) => {
    ctx.status = 200;
    ctx.body = { };
});
