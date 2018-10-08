const fs = require("fs");
const path = require("path");
const js = fs.readFileSync("./libs/dat.gui/dat.gui.js", "utf-8") + fs.readFileSync("./bin/editor/editor.js", "utf-8");
const minJS = fs.readFileSync("./libs/dat.gui/dat.gui.min.js", "utf-8") + fs.readFileSync("./bin/editor/editor.min.js", "utf-8");
const dTS = fs.readFileSync("./libs/dat.gui/dat.gui.d.ts", "utf-8") + fs.readFileSync("./bin/editor/editor.d.ts", "utf-8");

fs.writeFileSync("./bin/editor/editor.js", js)
fs.writeFileSync("./bin/editor/editor.min.js", minJS)
fs.writeFileSync("./bin/editor/editor.d.ts", dTS);