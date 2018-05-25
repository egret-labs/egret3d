const fs = require('fs');
const e3djs = fs.readFileSync('./bin/egret3d.js', 'utf-8');
const e3djs_min = fs.readFileSync('./bin/egret3d.min.js', 'utf-8');
const result = {
    e3djs: e3djs.length,
    e3djs_min: e3djs_min.length,
    date: new Date().toDateString()
}

const reportFilename = 'report/report.json'
const report = JSON.parse(fs.readFileSync(reportFilename, 'utf-8'));
report.push(result);
fs.writeFileSync(reportFilename, JSON.stringify(report, null, '\t'), )