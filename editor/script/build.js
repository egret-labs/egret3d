const fs = require("fs");
const path = require("path");

const libs = [
    "./libs/dat.gui/dat.gui",
    "./libs/stats/stats",
];

let js = fs.readFileSync("./bin/inspector.js", "utf-8");
let minJS = fs.readFileSync("./bin/inspector.min.js", "utf-8");
let dTS = fs.readFileSync("./bin/inspector.d.ts", "utf-8");

for (const lib of libs) {
    const jsLib = fs.readFileSync(lib + ".js", "utf-8");
    const minJSLib = fs.readFileSync(lib + ".min.js", "utf-8");
    js = jsLib + js;
    minJS = minJSLib + minJS;

    if (fs.existsSync(lib + ".d.ts")){
        const dTSLib = fs.readFileSync(lib + ".d.ts", "utf-8");
        dTS = dTSLib + dTS;
    }
}

fs.writeFileSync("./bin/inspector.js", js)
fs.writeFileSync("./bin/inspector.min.js", minJS)
fs.writeFileSync("./bin/inspector.d.ts", dTS);