const fs = require("fs");
const path = require("path");

const libs = [
    // "./libs/pep/pep",
    "./libs/signals/signals",
];

let js = fs.readFileSync("./bin/egret3d.js", "utf-8");
let minJS = fs.readFileSync("./bin/egret3d.min.js", "utf-8");
let dTS = fs.readFileSync("./bin/egret3d.d.ts", "utf-8");

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

fs.writeFileSync("./bin/egret3d.js", js)
fs.writeFileSync("./bin/egret3d.min.js", minJS)
fs.writeFileSync("./bin/egret3d.d.ts", dTS);