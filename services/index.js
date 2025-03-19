import {getKnex} from "../knex.js";

export async function getAllUsers() {

}

export async function getUserById(id) {
    const knex = await getKnex()
    const user = await knex("users")
        .where({ id })
        .first()

    return user;
}