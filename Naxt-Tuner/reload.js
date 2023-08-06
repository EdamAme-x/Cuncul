


import { config } from "./config.js"

if (config.clear) {
    console.clear();
}

console.log("Reloading...");
if (config.clear) {
    console.clear();
}


await Deno.writeTextFile("./_alive.jsonc", JSON.stringify({
    "id": Date.now()
}));

console.log(`%c ${config.messgae} `, "background-color: red;");
console.log(" ")
console.log(`Listening on http://localhost:${config.port}/`)