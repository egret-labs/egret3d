/// 阅读 declaration/api.d.ts 查看文档
///<reference path="declaration/api.d.ts"/>

import { CleanPlugin, CompilePlugin, ExmlPlugin, ManifestPlugin, UglifyPlugin } from 'built-in';
import * as defaultConfig from './config';
import { InspectorFilterPlugin } from './myplugin';
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
            return {
                outputDir,
                commands: [
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
