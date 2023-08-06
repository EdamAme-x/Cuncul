import { serve } from 'https://deno.land/std/http/server.ts';
import { Hono } from 'https://deno.land/x/hono/mod.ts';
import { serveStatic } from 'https://deno.land/x/hono/middleware.ts';

import { renderToString } from 'https://jspm.dev/react-dom@18.2.0/server';

import { config } from "./config.js"

import { h, Fragment } from "https://jspm.dev/react"
import React from 'https://jspm.dev/react'

console.log("Setting up server...");

try {
    if (config.clear) {
        console.clear();
    }

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
    `;

    const app = new Hono();

    app.onError((err, c) => {
        console.error(`Error: \n ${err}`);
        return c.text('Error', 500);
    });

    app.get('/', (c) => {
        try {
            let return_html = Deno.readTextFileSync("./view/index.html");
            return c.html(return_html + `
            ${reloadScript}
            `);
        } catch (error) {
            try {
                let return_html = (<>
                    <div id={"root"} dangerouslySetInnerHTML={{ __html: "fixer" }}>

                    </div>
                </>);
                return c.html(renderToString(return_html));
            } catch(e) {

                console.log(e)
                try {
                    // 404
                    try {
                        const content = Deno.readTextFileSync(`./view/_404.html`);
                        return c.html(content);
                    }catch {
                        try {
                            const content = Deno.readTextFileSync(`./view/_404.jsx`);
                            return c.html(renderToString(content));
                        } catch {
                            return c.text("404", 404);
                        }
                    }
                } catch {
                    return c.text("404", 404);
                }
            }
        }
    });

    // hot reload
    app.get('/_alive', serveStatic({ path: './_alive.jsonc' }));

    app.get('/:path', async (c) => {
        const path = c.req.path;
        try {
            let return_html = Deno.readTextFileSync(`./view${path}.html`);
            return c.html(return_html + `
            ${reloadScript}
            `);
        } catch (error) {
            try {
                let return_html = Deno.readTextFileSync(`./view${path}.jsx`);
                return c.html(renderToString(return_html));
            } catch {
                try {
                    const content = Deno.readTextFileSync(`./view/_404.html`);
                    return c.html(content);
                } catch {
                    try {
                        const content = Deno.readTextFileSync(`./view/_404.jsx`);
                        return c.html(renderToString(content));
                    } catch {
                        return c.text("404", 404);
                    }
                }
            }
        }
    });

    if (config.clear) {
        console.clear();
    }

    console.log(`%c ${config.message} `, "background-color: red;");
    console.log(" ");
    serve(app.fetch, {
        port: config.port
    });
} catch (err) {
    if (config.clear) {
        console.clear();
    }
    console.error("Error: \n", err);
}

export {
    config
};
