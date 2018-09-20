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
                    new ResourceFilterPlugin(["Assets/Art/Effect/Models/wall_box.FBX_FX_Box.mesh.bin", "Assets/Art/Effect/Models/fx_plane.FBX_FX_Plane.mesh.bin", "Assets/Art/Effect/Textures/tongyong/Tlight0120.image.json", "Assets/Art/Effect/Textures/tongyong/Tlight0120.png", "Assets/Art/Effect/Textures/tongyong/Tlight0120.jpg", "Assets/Materials/obstacle3.mat.json", "Assets/Art/Effect/Textures/tongyong/Tlight0122.image.json", "Assets/Art/Effect/Textures/tongyong/Tlight0122.png", "Assets/Art/Effect/Textures/tongyong/Tlight0122.jpg", "Assets/Art/models/Materials/shadow05.mat.json", "Assets/Art/Texture/floor.image.json", "Assets/Art/Texture/floor.png", "Assets/Art/Texture/floor.jpg", "Assets/Materials/bg_g.mat.json", "Assets/Art/Effect/Textures/tongyong/sc03.image.json", "Assets/Art/Effect/Textures/tongyong/sc03.png", "Assets/Art/Effect/Textures/tongyong/sc03.jpg", "Assets/Materials/bg3.mat.json", "Assets/obstacle3.prefab.json", "Assets/Art/models/juese1/DartStand_DartStand.ani.bin", "Assets/Art/models/juese1/javelinAttack_a_javelinAttack_a.ani.bin", "Assets/Art/models/juese1/GunStand_GunStand.ani.bin", "Assets/Art/models/juese1/DartIdle_DartIdle.ani.bin", "Assets/Art/models/juese1/GunHit_GunHit.ani.bin", "Assets/Art/models/juese1/GunAttack_GunAttack.ani.bin", "Assets/Art/models/juese1/ShurikenStand_ShurikenStand.ani.bin", "Assets/Art/models/juese1/ShurikenRun_ShurikenRun.ani.bin", "Assets/Art/models/juese1/ShurikenReadyRun_ShurikenReadyRun.ani.bin", "Assets/Art/models/juese1/ShurikenReady_ShurikenReady.ani.bin", "Assets/Art/models/juese1/ShurikenIdle_ShurikenIdle.ani.bin", "Assets/Art/models/juese1/ShurikenAttack_b_ShurikenAttack_b.ani.bin", "Assets/Art/models/juese1/ShurikenAttack_a_ShurikenAttack_a.ani.bin", "Assets/Art/models/juese1/knifeStand_knifeStand.ani.bin", "Assets/Art/models/juese1/knifeIdle_knifeIdle.ani.bin", "Assets/Art/models/juese1/knifeRun_knifeRun.ani.bin", "Assets/Art/models/juese1/knifeHit_knifeHit.ani.bin", "Assets/Art/models/juese1/knifeAttack_knifeAttack.ani.bin", "Assets/Art/models/juese1/javelinStand_javelinStand.ani.bin", "Assets/Art/models/juese1/javelinRun_javelinRun.ani.bin", "Assets/Art/models/juese1/javelinReadyRun_javelinReadyRun.ani.bin", "Assets/Art/models/juese1/javelinready_javelinready.ani.bin", "Assets/Art/models/juese1/javelinIdle_javelinIdle.ani.bin", "Assets/Art/models/juese1/javelinAttack_b_javelinAttack_b.ani.bin", "Assets/Art/models/juese1/GunRun_GunRun.ani.bin", "Assets/Art/models/juese1/GunIdle_GunIdle.ani.bin", "Assets/Art/models/juese1/DartReadyRun_DartReadyRun.ani.bin", "Assets/Art/models/juese1/DartAttack_DartAttack.ani.bin", "Assets/Art/models/juese1/DartRun_DartRun.ani.bin", "Assets/Art/models/juese1/DartReady_DartReady.ani.bin", "Assets/Art/models/action/attack_attack.ani.bin", "Assets/Art/models/action/attack2_attack2.ani.bin", "Assets/Art/models/action/attack3_attack3.ani.bin", "Assets/Art/models/action/dead_dead.ani.bin", "Assets/Art/models/action/hit_hit.ani.bin", "Assets/Art/models/action/run1_run1.ani.bin", "Assets/Art/models/action/run2_run2.ani.bin", "Assets/Art/models/action/run3_run3.ani.bin", "Assets/Art/models/action/run4_run4.ani.bin", "Assets/Art/models/action/stand1_stand1.ani.bin", "Assets/Art/models/action/stand2_stand2.ani.bin", "Assets/Art/models/action/stand3_stand3.ani.bin", "Assets/Art/models/char16.mesh.bin", "Assets/Art/Effect/Models/fx_plane.mesh.bin", "Assets/Art/models/action/stand4_stand4.ani.bin", "Assets/Art/models/action/stand5_stand5.ani.bin", "Assets/Art/models/char2.image.json", "Assets/Art/models/char2.png", "Assets/Art/models/char2.jpg", "Assets/Art/models/Materials/char2.mat.json", "Assets/Art/Effect/Textures/tongyong/3042_trail01.image.json", "Assets/Art/Effect/Textures/tongyong/3042_trail01.png", "Assets/Art/Effect/Textures/tongyong/3042_trail01.jpg", "Assets/Art/models/Materials/shadow.mat.json", "Assets/pp1.prefab.json", "Assets/Art/models/baoshi.FBX_baoshi.mesh.bin", "Assets/Art/models/Materials/shadow_hp.mat.json", "Assets/Art/models/weapon1.image.json", "Assets/Art/models/weapon1.png", "Assets/Art/models/weapon1.jpg", "Assets/Art/models/Materials/weapon1.mat.json", "Assets/Exp.prefab.json"]),
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
