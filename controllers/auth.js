import * as crypto from 'node:crypto';
import Router from 'koa-router';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import {
    createToken,
    deleteToken,
    createUser,
    getUserByEmail,
} from '../services/index.js';

export const authRouter = new Router();

authRouter.post('/register', async (ctx) => {
    console.log('post request to /user', ctx.request.body);

    const joiSchema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const { username, email, password } = await joiSchema.validateAsync(ctx.request.body);

    const passwordHash = await bcrypt.hash(password, 12);

    await createUser({
        username,
        password: passwordHash,
        email,
    });

    ctx.body = {
        success: true,
        newUser: { username, email },
    };
    ctx.status = 201;
});

authRouter.post('/login', async (ctx) => {
    console.log('post request to /login');

    const joiSchema = Joi.object({
        username: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const { email, password } = await joiSchema.validateAsync(ctx.request.body);

    const dbUser = await getUserByEmail(email);

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

    await createToken({
        token,
        user_id: dbUser.id,
    });

    ctx.cookies.set('token', token, { httpOnly: true });

    ctx.status = 200;
    ctx.body = {
        message: 'Login successful',
        user: dbUser,
        token,
    };
});

authRouter.post('/logout', async (ctx) => {
    const token = ctx.cookies.get('token');

    if (!token) {
        throw new Error('Not authorized');
    }

    console.log({ token });

    ctx.state.user = null;

    await deleteToken(token);

    ctx.cookies.set('token', null);
    ctx.state.user = null;
});
