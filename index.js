import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import { getKnex } from './knex.js';
import { HTTP_PORT } from './utils/config.js';

import {
    usersRouter,
    authRouter,
    postsRouter,
} from './controllers/index.js';

async function main() {
    console.log('start', new Date());

    const knex = await getKnex();

    const res = await knex.raw('select 1 + 1 as sum');

    const app = new Koa();
    app.use(bodyparser());

    app.use(async (ctx, next) => {
        console.log(ctx.method, ctx.url, ctx.body);
        await next();
    });

    app.use(authRouter.routes());

    app.use(async (ctx, next) => {
        const { headers } = ctx.request;

        console.log(headers);
        const { authorization } = headers;

        const token = authorization?.split(' ')[1];

        console.log({ token });

        if (token) {
            const userInfo = (await knex.raw(`
                select * from tokens
                inner join users
                    on users.id = tokens.user_id
                where tokens.token = ?
            `, [token])).rows[0];

            if (!userInfo) {
                throw new Error('Unauthorized');
            }

            ctx.state.user = userInfo;
        }

        return next();
    });

    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (e) {
            if (e.isJoi) {
                ctx.status = 400;
                ctx.body = {
                    message: e.message,
                };
                return;
            }
            console.log(e);

            ctx.status = 500;
            ctx.body = {
                message: e.message,
            };
        }
    });

    app.use(usersRouter.routes());
    app.use(postsRouter.routes());

    console.log(res.rows);

    app.listen(HTTP_PORT, () => {
        console.log('server started at ', HTTP_PORT);
    });
}

main().catch((e) => {
    console.log(e);
    process.exit(1);
});
