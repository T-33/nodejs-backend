import Koa from "koa"
import Router from 'koa-router';
import bodyparser from 'koa-bodyparser';

import {getKnex} from "./knex.js"

const router = new Router()

router.get('/', async (ctx) => {
    ctx.status = 200;
    ctx.body = { thanks: '<3' };
});

router.get("/users", async (ctx) => {
    ctx.response.body = {ok: true}
    ctx.status = 200
})

router.get("/user/:id", async (ctx) => {
    const knex = await getKnex()
    const user = await knex("users")
        .where({id: ctx.params.id })
        .first()

    ctx.body = {
        user
    }
    ctx.status = 200
})

router.post("/users", async (ctx) => {
    const knex = await getKnex()
    console.log("post request to /user", ctx.request.body)

    ctx.body = ctx.request.body
    ctx.status = 201
})

router.post("/login", async (ctx) => {
    const knex = await getKnex()
    const {username, password} = ctx.request.body
    console.log("post request to /login", username, password)

    const user = await knex("users")
        .where({username})
        .first()

    if(!user) {
        ctx.status = 401
        ctx.body = {error: "Error finding user with that username"}
        return;
    }

    const passwordMatch = password === user.password

    if(passwordMatch) {
        ctx.status = 200
        ctx.body = {message: "Login successful", user}
    } else {
        ctx.status = 401
        ctx.body = {error: "Invalid password"}
    }
})

router.post("/register", async (ctx) => {
    const knex = await getKnex()
    const newUser = ctx.request.body
    console.log("post request to /user", newUser)

    const result = await knex("users").insert(newUser).returning("*")

    ctx.body = {
        success: true,
        newUser: result[0]
    }
    ctx.status = 201
})

router.get("/users", async (ctx) => {
    const knex = await getKnex()
    const res = await knex("users").select()

    ctx.body = {
        success: true,
        posts: res
    }
    ctx.status = 201
})

router.get("/posts", async (ctx) => {
    const knex = await getKnex()
    const res = await knex("posts").select()

    ctx.body = {
        success: true,
        posts: res
    }
    ctx.status = 201
})

router.post("/post", async (ctx) => {
    const knex = await getKnex()

    const res = await knex("posts").insert(ctx.request.body).returning("*")

    ctx.body = {
        success: true,
        res
    }
    ctx.status = 201
})

async function main() {
    console.log("start", new Date())

    const knex = await getKnex()

    const res = await knex.raw("select 1 + 1 as sum")

    const app = new Koa()
    app.use(bodyparser())
    app.use(router.routes())
    app.use(async (ctx) => {
        ctx.body = {
            hello: "world"
        }

       ctx.status = 200
    })

    console.log(res.rows)

    const HTTP_PORT = 8080

    app.listen(HTTP_PORT, () => {
        console.log("server started at ", HTTP_PORT)
    })
}

main().catch((e) => {
    console.log(e)
    process.exit(1)
})