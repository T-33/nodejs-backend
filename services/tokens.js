import { getKnex } from '../knex.js';

export async function createToken(token) {
    const knex = await getKnex();

    await knex('tokens').insert(token);

    return token;
}

export async function deleteToken(token) {
    const knex = await getKnex();

    await knex('tokens')
        .where({ token })
        .delete();
}

export async function deleteUserTokens(userId) {
    const knex = await getKnex();

    await knex('tokens')
        .where({ user_id: userId })
        .delete();
}
