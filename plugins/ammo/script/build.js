const fs = require("fs");
const path = require("path");
const js = fs.readFileSync("./libs/ammo/ammo.js", "utf-8") + fs.readFileSync("./bin/ammo/ammo.js", "utf-8");
const dTS = fs.readFileSync("./libs/ammo/ammo.d.ts", "utf-8") + fs.readFileSync("./bin/ammo/ammo.d.ts", "utf-8");

fs.writeFileSync("./bin/ammo/ammo.js", js)
fs.writeFileSync("./bin/ammo/ammo.d.ts", dTS);