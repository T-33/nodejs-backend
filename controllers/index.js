import Router from 'koa-router';
import { getKnex } from '../knex.js';
import { getAllUsers, getUserById } from '../services/index.js';

export const userRouter = new Router();

userRouter.get('/users/:id', async (ctx) => {
    const user = await getUserById(ctx.params.id);

    ctx.body = {
        user,
    };
    ctx.status = 200;
});

userRouter.get('/', async (ctx) => {
    ctx.status = 200;
    ctx.body = { };
});

userRouter.get('/users', async (ctx) => {
    ctx.response.body = { ok: true };
    ctx.status = 200;
});


userRouter.post('/users', async (ctx) => {
    console.log('post request to /user', ctx.request.body);

    ctx.body = ctx.request.body;
    ctx.status = 201;
});

userRouter.post('/login', async (ctx) => {
    const knex = await getKnex();
    const { username, password } = ctx.request.body;
    console.log('post request to /login', username, password);

    const user = await knex('users')
        .where({ username })
        .first();

    if (!user) {
        ctx.status = 401;
        ctx.body = { error: 'Error finding user with that username' };
        return;
    }

    const passwordMatch = password === user.password;

    if (passwordMatch) {
        ctx.status = 200;
        ctx.body = { message: 'Login successful', user };
    } else {
        ctx.status = 401;
        ctx.body = { error: 'Invalid password' };
    }
});

userRouter.post('/register', async (ctx) => {
    const knex = await getKnex();
    const newUser = ctx.request.body;
    console.log('post request to /user', newUser);

    const result = await knex('users').insert(newUser).returning('*');

    ctx.body = {
        success: true,
        newUser: result[0],
    };
    ctx.status = 201;
});

userRouter.get('/users', async (ctx) => {
    const knex = await getKnex();
    const res = await knex('users').select();

    ctx.body = {
        success: true,
        posts: res,
    };
    ctx.status = 201;
});
