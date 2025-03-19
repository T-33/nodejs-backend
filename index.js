import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import { userRouter } from './controllers/index.js';
import { postRouter } from './controllers/posts.js';
import { getKnex } from './knex.js';

async function main() {
    console.log('start', new Date());

    const knex = await getKnex();

    const res = await knex.raw('select 1 + 1 as sum');

    const app = new Koa();
    app.use(bodyparser());
    app.use(async (ctx, next) => {
        try {
            await next();
            console.log('after request try-catch');
        } catch (e) {
            console.log(e);

            ctx.status = 500;
            ctx.body = 'Something went wrong';
        }
    });
    app.use(async (ctx, next) => {
        console.log(ctx.method, ctx.url, ctx.body);
        console.log('after request in logger');
        return next();
    });
    app.use(userRouter.routes());
    app.use(postRouter.routes());

    console.log(res.rows);

    const HTTP_PORT = 8080;

    app.listen(HTTP_PORT, () => {
        console.log('server started at ', HTTP_PORT);
    });
}

main().catch((e) => {
    console.log(e);
    process.exit(1);
});
