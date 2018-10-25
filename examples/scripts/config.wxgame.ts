/// 阅读 declaration/api.d.ts 查看文档
///<reference path="declaration/api.d.ts"/>
import * as path from "path";
import { CleanPlugin, CompilePlugin, EmitResConfigFilePlugin, ExmlPlugin, ManifestPlugin, UglifyPlugin } from 'built-in';
import * as defaultConfig from './config';
import { bakeInfo, nameSelector, mergeJSONSelector, MergeJSONPlugin, MergeBinaryPlugin, ModifyDefaultResJSONPlugin, InspectorFilterPlugin } from "./myplugin";
import { WxgamePlugin } from './wxgame/wxgame';

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
                    new MergeJSONPlugin({ nameSelector, mergeJSONSelector }),
                    new EmitResConfigFilePlugin({
                        output: bakeInfo.root + "default.res.json",
                        typeSelector: config.typeSelector,
                        nameSelector,
                        groupSelector: p => null
                    }),

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

export = config;
