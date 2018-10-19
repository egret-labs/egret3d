/// 阅读 declaration/api.d.ts 查看文档
///<reference path="declaration/api.d.ts"/>
import * as path from "path";
import { CleanPlugin, CompilePlugin, ExmlPlugin, ManifestPlugin, UglifyPlugin } from 'built-in';
import * as defaultConfig from './config';
import { MergeJSONPlugin, InspectorFilterPlugin } from './myplugin';
import { WxgamePlugin } from './wxgame/wxgame';

let bakeRoot: string = "resource/";
const config: ResourceManagerConfig = {

    buildConfig: (params) => {

        const { target, command, projectName, version } = params;
        const outputDir = `../${projectName}_wxgame`;
        if (command === 'build') {
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["js", "resource"] }),
                    new CompilePlugin({ libraryType: "debug", defines: { DEBUG: true, RELEASE: false } }),
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new InspectorFilterPlugin(),
                    new WxgamePlugin(),
                    new ManifestPlugin({ output: 'manifest.js' })
                ]
            };
        }
        else if (command === 'publish') {
            // TODO 合并操作应该在 publish 而不是 bake
            return {
                outputDir,
                commands: [
                    new MergeJSONPlugin({ root: bakeRoot, nameSelector, mergeJSONSelector }),
                    new CleanPlugin({ matchers: ["js", "resource"] }),
                    new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new InspectorFilterPlugin(),
                    new WxgamePlugin(),
                    new UglifyPlugin([
                        {
                            sources: ["main.js"],
                            target: "main.min.js"
                        }
                    ]),
                    new ManifestPlugin({ output: 'manifest.js' })
                ]
            };
        }
        else {
            throw `unknown command : ${params.command}`;
        }
    },

    typeSelector: defaultConfig.typeSelector
};

const nameSelector = (p: string) => {
    if (p.indexOf("2d/") > 0) {
        return path.basename(p).replace(/\./gi, "_");
    }

    return p.replace(bakeRoot, "");
};

const mergeJSONSelector = (p: string) => {
    if (p.indexOf("default.res.json") >= 0) {
        return null;
    }

    if (p.indexOf(".json") >= 0) {
        return bakeRoot + "1.zipjson";
    }

    return null;
};

export = config;
