const fs = require("fs");
const path = require("path");
const js = fs.readFileSync("./libs/oimo/oimo.js", "utf-8") + fs.readFileSync("./bin/oimo/oimo.js", "utf-8");
const minJS = fs.readFileSync("./libs/oimo/oimo.min.js", "utf-8") + fs.readFileSync("./bin/oimo/oimo.min.js", "utf-8");
const dTS = fs.readFileSync("./libs/oimo/oimo.d.ts", "utf-8") + fs.readFileSync("./bin/oimo/oimo.d.ts", "utf-8");

fs.writeFileSync("./bin/oimo/oimo.js", js)
fs.writeFileSync("./bin/oimo/oimo.min.js", minJS)
fs.writeFileSync("./bin/oimo/oimo.d.ts", dTS);