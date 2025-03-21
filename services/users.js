import { getKnex } from '../knex.js';
import { deleteUserTokens } from './tokens.js';

export async function createUser(user) {
    const knex = await getKnex();
    //TODO add validation
    await knex('users')
        .insert(user)
        .returning('*');
}

export async function getAllUsers() {
    const knex = await getKnex();
    const users = await knex('users')
        .select('*');

    return users;
}

export async function getUserById(id) {
    const knex = await getKnex();
    const user = await knex('users')
        .where({ id })
        .first();

    return user;
}

export async function getUserByEmail(email) {
    const knex = await getKnex();
    const user = await knex('users')
        .where({ email })
        .first();

    return user;
}

export async function deleteUserById(id) {
    const knex = await getKnex();

    await deleteUserTokens(id);

    await knex('users')
        .where({ id })
        .delete();
}
