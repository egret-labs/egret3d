/// 阅读 declaration/api.d.ts 查看文档
///<reference path="declaration/api.d.ts"/>

import * as path from 'path';
import { UglifyPlugin, CompilePlugin, ManifestPlugin, ExmlPlugin, EmitResConfigFilePlugin, TextureMergerPlugin, CleanPlugin } from 'built-in';
import { WxgamePlugin, ManifestWxgamePlugin, ResourceFilterPlugin } from './wxgame/wxgame';
import * as defaultConfig from './config';

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
                    // new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                    // new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new WxgamePlugin(),
                    new UglifyPlugin([
                        {
                            sources: [
                                "libs/modules/egret/egret.js",
                                "libs/modules/assetsmanager/assetsmanager.js",
                                "libs/modules/egret3d/egret3d.js"
                            ],
                            target: "lib.min.js"
                        },
                        // {
                        //     sources: ["main.js"],
                        //     target: "main.min.js"
                        // },
                        // {
                        //     sources: ['resource/2d/default.thm.js'],
                        //     target: "default.thm.min.js"
                        // },
                    ]),
                    new ManifestPlugin({ output: 'manifest.js' }),
                    new ManifestWxgamePlugin(),
                    new ResourceFilterPlugin(),
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
                    new WxgamePlugin(),
                    new UglifyPlugin([{
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
}

export = config;
