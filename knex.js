import Knex from 'knex';

let knex;

export async function getKnex() {
    if (knex) {
        return knex;
    }

    const PG_URI = 'postgres://postgres:TIMUR703_@localhost/postgres';
    knex = Knex(PG_URI);

    return knex;
}