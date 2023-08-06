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

// app.get('/*', serveStatic({ path: './view/' }))

app.get('/_alive', serveStatic({ path: './_alive.jsonc' }))

app.all('*', (c) => {
    // if 
    try {
        const content = Deno.readTextFileSync("./view/_404.html");
        return c.text(content);
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            return c.html("404 Error", 404);
        } else {
            return c.text("Server Error", 500);
        }
    }
})

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