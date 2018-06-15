const fs = require('fs');
const path = require('path');
const e3djs = fs.readFileSync('./bin/egret3d.js', 'utf-8');
const e3djs_min = fs.readFileSync('./bin/egret3d.min.js', 'utf-8');
const e3ddts = fs.readFileSync('./bin/egret3d.d.ts', 'utf-8');
const result = {
    e3djs: e3djs.length,
    e3djs_min: e3djs_min.length,
    date: new Date().toDateString()
}



const reportFilename = 'devconfig/report.json'
if (fs.existsSync(reportFilename)) {
    const report = JSON.parse(fs.readFileSync(reportFilename, 'utf-8'));
    report.push(result);
    fs.writeFileSync(reportFilename, JSON.stringify(report, null, '\t'), 'utf-8')
}

const testsuiteFilename = './devconfig/testsuite.json';
if (fs.existsSync(testsuiteFilename)) {
    const json = JSON.parse(fs.readFileSync(testsuiteFilename, 'utf-8'));
    for (let item of json) {
        const copyToDir = path.join(item, 'egret3d/bin');
        fs.writeFileSync(path.join(copyToDir, 'egret3d.js'), e3djs)
        fs.writeFileSync(path.join(copyToDir, 'egret3d.min.js'), e3djs_min)
        fs.writeFileSync(path.join(copyToDir, 'egret3d.d.ts'), e3ddts);
    }

}