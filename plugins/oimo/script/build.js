const fs = require("fs");
const path = require("path");
const oimo = fs.readFileSync("./libs/oimo/oimo.js", "utf-8") + fs.readFileSync("./bin/oimo/oimo.js", "utf-8");
const oimoMin = fs.readFileSync("./libs/oimo/oimo.min.js", "utf-8") + fs.readFileSync("./bin/oimo/oimo.min.js", "utf-8");
const oimoDts = fs.readFileSync("./libs/oimo/oimo.d.ts", "utf-8") + fs.readFileSync("./bin/oimo/oimo.d.ts", "utf-8");

fs.writeFileSync("./bin/oimo/oimo.js", oimo)
fs.writeFileSync("./bin/oimo/oimo.min.js", oimoMin)
fs.writeFileSync("./bin/oimo/oimo.d.ts", oimoDts);