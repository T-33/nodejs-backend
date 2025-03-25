import Router from 'koa-router';
import {
    getAllUsers,
    getUserById,
    deleteUserById,
} from '../services/index.js';

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

usersRouter.delete('/users/:id', async (ctx) => {
    if (!ctx.state.user) {
        throw new Error('Unauthorized');
    }

    //tokens associated with user are also deleted, making current cookie useless;
    await deleteUserById(ctx.params.id);

    ctx.status = 200;
    ctx.body = { };
});
