import Router from 'koa-router';
import Joi from 'joi';
import {
    getAllUsers,
    getUserById,
    getUserByEmail,
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

usersRouter.delete('/users', async (ctx) => {
    if (!ctx.state.user) {
        throw new Error('Unauthorized');
    }

    const joiSchema = Joi.object({
        username: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string(),
    });

    const { email } = await joiSchema.validateAsync(ctx.request.body);

    const dbUser = await getUserByEmail(email);

    //tokens associated with user are also deleted, making current cookie useless;
    await deleteUserById(dbUser.id);

    ctx.status = 200;
    ctx.body = { };
});
