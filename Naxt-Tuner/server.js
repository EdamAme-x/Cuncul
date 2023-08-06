import { serve } from 'https://deno.land/std/http/server.ts';
import { Hono } from 'https://deno.land/x/hono/mod.ts';
import { serveStatic } from 'https://deno.land/x/hono/middleware.ts';

import { config } from "./config.js"

console.log("Setting up server...");

console.clear();

const reloadScript = `
<script>
    async function getAlive() {
        let alive = await fetch("./_alive", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
    
        alive = await alive.json()
    
        return alive.id
    }
    
    getAlive()
        .then(res => JSON.parse(res))
        .then(data => {
            window.naxt_alive = data
        })
    
    setInterval(() => {
        getAlive()
            .then(res => JSON.parse(res))
            .then(data => {
                if (data !== window.naxt_alive) {
                    window.location.reload()
                }
            })
    }, 250)
    </script>
`

const app = new Hono()

app.onError((err, c) => {
    console.error(`Error: \n ${err}`)
    return c.text('Error', 500)
})

app.get('/', (c) => {
    let return_html = Deno.readTextFileSync("./view/index.html");
    return c.html(return_html + `
    ${reloadScript}
    `);
})

app.get('/_alive', serveStatic({ path: './_alive.jsonc' }))



app.get('/:path', async (c) => {
    const path = c.req.param("path");
    try {
        const content = await Deno.readTextFile("./view/" + path);
        return c.html(content + `
        ${reloadScript}
        `);
    } catch (error) {
        try {
            const content = await Deno.readTextFile(`./view/_404.html`);
            return c.html(content);
        } catch {
            return c.text("404", 404);
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