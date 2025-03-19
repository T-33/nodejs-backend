import Router from 'koa-router';
import { getKnex } from '../knex.js';

export const postRouter = new Router();

postRouter.get('/posts', async (ctx) => {
    const knex = await getKnex();
    const res = await knex('posts').select();

    ctx.body = {
        success: true,
        posts: res,
    };
    ctx.status = 201;
});

postRouter.post('/post', async (ctx) => {
    const knex = await getKnex();

    const res = await knex('posts').insert(ctx.request.body).returning('*');

    ctx.body = {
        success: true,
        res,
    };
    ctx.status = 201;
});
