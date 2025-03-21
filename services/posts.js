import { getKnex } from '../knex.js';

export async function createPost(post) {
    const knex = await getKnex();
    await knex('posts')
        .insert(post)
        .returning('*');
}

export async function getAllPosts() {
    const knex = await getKnex();
    const posts = await knex('posts')
        .select('*');

    return posts;
}

export async function getPostsById(id) {
    const knex = await getKnex();
    const post = await knex('posts')
        .where({ id })
        .first();

    return post;
}

export async function getUserPosts(userId) {
    const knex = await getKnex();
    const posts = await knex('posts')
        .where({ user_id: userId });

    return posts;
}

export async function deletePostById(id) {
    const knex = await getKnex();

    await knex('posts')
        .where({ id })
        .delete();
}
