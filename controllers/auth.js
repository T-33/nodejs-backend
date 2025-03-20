import * as crypto from 'node:crypto';
import Router from 'koa-router';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { getKnex } from '../knex.js';

export const authRouter = new Router();

authRouter.post('/register', async (ctx) => {
    const knex = await getKnex();
    console.log('post request to /user', ctx.request.body);

    const joiSchema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const { username, email, password } = await joiSchema.validateAsync(ctx.request.body);

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await knex('users')
        .insert({
            username,
            password: passwordHash,
            email,
        })
        .returning('*');

    ctx.body = {
        success: true,
        newUser: { username, email },
    };
    ctx.status = 201;
});

authRouter.post('/login', async (ctx) => {
    const knex = await getKnex();
    console.log('post request to /login');

    const joiSchema = Joi.object({
        username: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const { username, email, password } = await joiSchema.validateAsync(ctx.request.body);

    const dbUser = await knex('users')
        .where({ email })
        .first();

    if (!dbUser) {
        ctx.status = 401;
        throw new Error('USER NOT FOUND');
    }

    const passwordMatch = bcrypt.compare(password, dbUser.password);

    if (!passwordMatch) {
        ctx.status = 400;
        ctx.body = { message: 'Incorrect credentials' };
    }

    const token = crypto.randomBytes(20).toString('hex');

    await knex('tokens').insert({
        user_id: dbUser.id,
        token,
    });

    ctx.status = 200;
    ctx.body = {
        message: 'Login successful',
        user: dbUser,
        token,
    };
});

authRouter.post('/logout', async (ctx) => {
    ctx.request.body = 'logout';
});
