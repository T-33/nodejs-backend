import Router from 'koa-router';
import Joi from 'joi';
import {
    getAllPosts,
    getUserPosts,
    createPost,
    deletePostById,
} from '../services/index.js';

export const postsRouter = new Router();

postsRouter.get('/posts', async (ctx) => {
    const posts = await getAllPosts();

    ctx.body = {
        success: true,
        posts,
    };
    ctx.status = 200;
});

postsRouter.get('/users/:id/posts', async (ctx) => {
    const posts = await getUserPosts(ctx.params.id);

    ctx.body = {
        success: true,
        posts,
    };
    ctx.status = 200;
});

postsRouter.post('/posts', async (ctx) => {
    const joiSchema = Joi.object({
        email: Joi.string().email().required(),
        content: Joi.string().required(),
    });

    const { content } = await joiSchema.validateAsync(ctx.request.body);

    const newPost = await createPost({ user_id: ctx.state.user.id, content });

    ctx.body = {
        post: newPost,
    };
    ctx.status = 201;
});

postsRouter.delete('/posts/:id', async (ctx) => {
    await deletePostById(ctx.params.id);

    ctx.status = 200;
    ctx.body = { };
});
