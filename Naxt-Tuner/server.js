import { serve } from 'https://deno.land/std/http/server.ts';
import { Hono } from 'https://deno.land/x/hono/mod.ts';
import { serveStatic } from 'https://deno.land/x/hono/middleware.ts';

import { config } from "./config.js"

console.log("Setting up server...");

console.clear();



const app = new Hono()

app.onError((err, c) => {
    console.error(`Error: \n {err}`)
    return c.text('Error', 500)
})

app.get('/', serveStatic({ path: './view/index.html' }))

try {
    console.clear()
    console.log(`%c ${config.messgae} `, "background-color: red;");
    console.log(" ")
    serve(app.fetch, {
        port: config.port
    })
} catch (err) {
    console.clear()
    console.error("Error: \n", err)
}

export {
    config
}