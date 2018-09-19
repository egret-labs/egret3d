import * as fs from 'fs';
import * as path from 'path';

export class WxgamePlugin implements plugins.Command {
    async onFile(file: plugins.File) {
        if (file.extname == '.js') {
            const filename = file.origin;
            if (
                filename === "libs/modules/promise/promise.js" || filename === 'libs/modules/promise/promise.min.js'
                || filename === "libs/modules/editor/editor.js" || filename === 'libs/modules/editor/editor.min.js'
                || filename === "libs/modules/oimo/oimo.js" || filename === 'libs/modules/oimo/oimo.min.js'
            ) {
                return null;
            }

            if (filename == 'libs/modules/egret/egret.js' || filename == 'libs/modules/egret/egret.min.js') {
                let content = file.contents.toString();
                content += `;window.egret = egret;`;
                content = content.replace(/definition = __global/, "definition = window");
                file.contents = new Buffer(content);
            }
            else {
                let content = file.contents.toString();
                if (
                    filename == "libs/modules/res/res.js" ||
                    filename == 'libs/modules/res/res.min.js' ||
                    filename == 'libs/modules/assetsmanager/assetsmanager.min.js' ||
                    filename == 'libs/modules/assetsmanager/assetsmanager.js'
                ) {
                    content += ";window.RES = RES;"
                }
                if (filename == "libs/modules/eui/eui.js" || filename == 'libs/modules/eui/eui.min.js') {
                    content += ";window.eui = eui;"
                }
                if (filename == 'libs/modules/dragonBones/dragonBones.js' || filename == 'libs/modules/dragonBones/dragonBones.min.js') {
                    content += ';window.dragonBones = dragonBones';
                }
                content = "var egret3d = window.egret3d;" + content;
                content = "var paper = window.paper;" + content;
                content = "var egret = window.egret;" + content;

                if (filename.indexOf('egret3d.js') >= 0 || filename.indexOf("egret3d.min.js") >= 0) {
                    content = " var RES = window.RES;" + content;
                    content = content.replace(new RegExp('egret.web', 'g'), "egret.wxgame");
                }

                if (filename == 'main.js') {
                    content += ";window.main = main;"
                }

                file.contents = new Buffer(content);
            }
        }

        return file;
    }

    async onFinish(pluginContext: plugins.CommandContext) {
        //同步 index.html 配置到 game.js
        // const gameJSPath = path.join(pluginContext.outputDir, "game.js");
        // let gameJSContent = fs.readFileSync(gameJSPath, { encoding: "utf8" });
        // const projectConfig = pluginContext.buildConfig.projectConfig;
        // const optionStr =
        //     `entryClassName: ${projectConfig.entryClassName},\n\t\t` +
        //     `orientation: ${projectConfig.orientation},\n\t\t` +
        //     `frameRate: ${projectConfig.frameRate},\n\t\t` +
        //     `scaleMode: ${projectConfig.scaleMode},\n\t\t` +
        //     `contentWidth: ${projectConfig.contentWidth},\n\t\t` +
        //     `contentHeight: ${projectConfig.contentHeight},\n\t\t` +
        //     `showFPS: ${projectConfig.showFPS},\n\t\t` +
        //     `fpsStyles: ${projectConfig.fpsStyles},\n\t\t` +
        //     `showLog: ${projectConfig.showLog},\n\t\t` +
        //     `maxTouches: ${projectConfig.maxTouches},`;
        // const reg = /\/\/----auto option start----[\s\S]*\/\/----auto option end----/;
        // const replaceStr = '\/\/----auto option start----\n\t\t' + optionStr + '\n\t\t\/\/----auto option end----';
        // gameJSContent = gameJSContent.replace(reg, replaceStr);
        // fs.writeFileSync(gameJSPath, gameJSContent);

        // //修改横竖屏
        // let orientation;
        // if (projectConfig.orientation == '"landscape"') {
        //     orientation = "landscape";
        // }
        // else {
        //     orientation = "portrait";
        // }
        // const gameJSONPath = path.join(pluginContext.outputDir, "game.json");
        // let gameJSONContent = JSON.parse(fs.readFileSync(gameJSONPath, { encoding: "utf8" }));
        // gameJSONContent.deviceOrientation = orientation;
        // fs.writeFileSync(gameJSONPath, JSON.stringify(gameJSONContent, null, "\t"));
    }
}

export class ManifestWxgamePlugin implements plugins.Command {

    async onFile(file: plugins.File) {
        if (file.origin === 'manifest.js') {
            const content = `require("js/lib.min.js");
require('egret.wxgame.js');
require("js/main.js");`;

            file.contents = new Buffer(content);
        }

        return file;
    }

    async onFinish(pluginContext: plugins.CommandContext) {

    }
}

export class ResourceFilterPlugin implements plugins.Command {
    // fileNames?: string[];
    fileNames?: string[] = ["Assets/Art/Effect/Models/wall_box.FBX_FX_Box.mesh.bin", "Assets/Art/Effect/Models/fx_plane.FBX_FX_Plane.mesh.bin", "Assets/Art/Effect/Textures/tongyong/Tlight0120.image.json", "Assets/Art/Effect/Textures/tongyong/Tlight0120.png", "Assets/Art/Effect/Textures/tongyong/Tlight0120.jpg", "Assets/Materials/obstacle3.mat.json", "Assets/Art/Effect/Textures/tongyong/Tlight0122.image.json", "Assets/Art/Effect/Textures/tongyong/Tlight0122.png", "Assets/Art/Effect/Textures/tongyong/Tlight0122.jpg", "Assets/Art/models/Materials/shadow05.mat.json", "Assets/Art/Texture/floor.image.json", "Assets/Art/Texture/floor.png", "Assets/Art/Texture/floor.jpg", "Assets/Materials/bg_g.mat.json", "Assets/Art/Effect/Textures/tongyong/sc03.image.json", "Assets/Art/Effect/Textures/tongyong/sc03.png", "Assets/Art/Effect/Textures/tongyong/sc03.jpg", "Assets/Materials/bg3.mat.json", "Assets/obstacle3.prefab.json", "Assets/Art/models/juese1/DartStand_DartStand.ani.bin", "Assets/Art/models/juese1/javelinAttack_a_javelinAttack_a.ani.bin", "Assets/Art/models/juese1/GunStand_GunStand.ani.bin", "Assets/Art/models/juese1/DartIdle_DartIdle.ani.bin", "Assets/Art/models/juese1/GunHit_GunHit.ani.bin", "Assets/Art/models/juese1/GunAttack_GunAttack.ani.bin", "Assets/Art/models/juese1/ShurikenStand_ShurikenStand.ani.bin", "Assets/Art/models/juese1/ShurikenRun_ShurikenRun.ani.bin", "Assets/Art/models/juese1/ShurikenReadyRun_ShurikenReadyRun.ani.bin", "Assets/Art/models/juese1/ShurikenReady_ShurikenReady.ani.bin", "Assets/Art/models/juese1/ShurikenIdle_ShurikenIdle.ani.bin", "Assets/Art/models/juese1/ShurikenAttack_b_ShurikenAttack_b.ani.bin", "Assets/Art/models/juese1/ShurikenAttack_a_ShurikenAttack_a.ani.bin", "Assets/Art/models/juese1/knifeStand_knifeStand.ani.bin", "Assets/Art/models/juese1/knifeIdle_knifeIdle.ani.bin", "Assets/Art/models/juese1/knifeRun_knifeRun.ani.bin", "Assets/Art/models/juese1/knifeHit_knifeHit.ani.bin", "Assets/Art/models/juese1/knifeAttack_knifeAttack.ani.bin", "Assets/Art/models/juese1/javelinStand_javelinStand.ani.bin", "Assets/Art/models/juese1/javelinRun_javelinRun.ani.bin", "Assets/Art/models/juese1/javelinReadyRun_javelinReadyRun.ani.bin", "Assets/Art/models/juese1/javelinready_javelinready.ani.bin", "Assets/Art/models/juese1/javelinIdle_javelinIdle.ani.bin", "Assets/Art/models/juese1/javelinAttack_b_javelinAttack_b.ani.bin", "Assets/Art/models/juese1/GunRun_GunRun.ani.bin", "Assets/Art/models/juese1/GunIdle_GunIdle.ani.bin", "Assets/Art/models/juese1/DartReadyRun_DartReadyRun.ani.bin", "Assets/Art/models/juese1/DartAttack_DartAttack.ani.bin", "Assets/Art/models/juese1/DartRun_DartRun.ani.bin", "Assets/Art/models/juese1/DartReady_DartReady.ani.bin", "Assets/Art/models/action/attack_attack.ani.bin", "Assets/Art/models/action/attack2_attack2.ani.bin", "Assets/Art/models/action/attack3_attack3.ani.bin", "Assets/Art/models/action/dead_dead.ani.bin", "Assets/Art/models/action/hit_hit.ani.bin", "Assets/Art/models/action/run1_run1.ani.bin", "Assets/Art/models/action/run2_run2.ani.bin", "Assets/Art/models/action/run3_run3.ani.bin", "Assets/Art/models/action/run4_run4.ani.bin", "Assets/Art/models/action/stand1_stand1.ani.bin", "Assets/Art/models/action/stand2_stand2.ani.bin", "Assets/Art/models/action/stand3_stand3.ani.bin", "Assets/Art/models/char16.mesh.bin", "Assets/Art/Effect/Models/fx_plane.mesh.bin", "Assets/Art/models/action/stand4_stand4.ani.bin", "Assets/Art/models/action/stand5_stand5.ani.bin", "Assets/Art/models/char2.image.json", "Assets/Art/models/char2.png", "Assets/Art/models/char2.jpg", "Assets/Art/models/Materials/char2.mat.json", "Assets/Art/Effect/Textures/tongyong/3042_trail01.image.json", "Assets/Art/Effect/Textures/tongyong/3042_trail01.png", "Assets/Art/Effect/Textures/tongyong/3042_trail01.jpg", "Assets/Art/models/Materials/shadow.mat.json", "Assets/pp1.prefab.json", "Assets/Art/models/baoshi.FBX_baoshi.mesh.bin", "Assets/Art/models/Materials/shadow_hp.mat.json", "Assets/Art/models/weapon1.image.json", "Assets/Art/models/weapon1.png", "Assets/Art/models/weapon1.jpg", "Assets/Art/models/Materials/weapon1.mat.json", "Assets/Exp.prefab.json"];

    async onFile(file: plugins.File) {
        if (
            !this.fileNames ||
            file.origin.indexOf(".res.json") >= 0 ||
            file.origin.indexOf("resource") < 0
        ) {
            return file;
        }

        for (const name of this.fileNames) {
            if (file.origin.indexOf(name) >= 0) {
                return file;
            }
        }

        return null;
    }

    async onFinish(commandContext: plugins.CommandContext) {
    }
}