console.clear();
console.log("Reloading...");
console.clear();

import { config } from "./config.js"


console.log(`%c ${config.messgae} `, "background-color: red;");
console.log(" ")
console.log(`Listening on http://localhost:${config.port}/`)