/// 阅读 api.d.ts 查看文档
///<reference path="declaration/api.d.ts"/>
import * as path from "path";
import { CompilePlugin, EmitResConfigFilePlugin, ExmlPlugin, IncrementCompilePlugin, ManifestPlugin, UglifyPlugin } from "built-in";
import { bakeInfo, nameSelector, mergeJSONSelector, MergeJSONPlugin, MergeBinaryPlugin, ModifyDefaultResJSONPlugin, InspectorFilterPlugin } from "./myplugin";

const config: ResourceManagerConfig = {

    buildConfig: (params) => {
        const target = params.target;
        const command = params.command;
        const projectName = params.projectName;
        const version = params.version;
        const commandLineParams = process.argv.splice(3);

        if (command === "bake") {
            const outputDir = ".";
            let subRoot = "";

            switch (commandLineParams[0]) {
                case "--folder":
                case "-f":
                    subRoot = `${commandLineParams[1]}/`;
                    bakeInfo.currentRoot = bakeInfo.defaultRoot + subRoot;
                    break;
            }

            return {
                outputDir,
                commands: [
                    new EmitResConfigFilePlugin({
                        output: bakeInfo.root + "default.res.json",
                        typeSelector: config.typeSelector,
                        nameSelector,
                        groupSelector: p => null
                    }),
                    new ModifyDefaultResJSONPlugin(subRoot),
                ]
            };
        }
        else if (command === "build") {
            const outputDir = ".";
            return {
                outputDir,
                commands: [
                    new ExmlPlugin("debug"),
                    new IncrementCompilePlugin(),
                ]
            };
        }
        else if (command === "publish") {
            const outputDir = `bin-release/web/${version}`;
            let inspectorFilterEnabled = true;
            switch (commandLineParams[0]) {
                case "--inspector":
                case "-i":
                    inspectorFilterEnabled = false;
                    break;
            }

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

                    new CompilePlugin({ libraryType: "release" }),
                    new ExmlPlugin("commonjs"),
                    new InspectorFilterPlugin(inspectorFilterEnabled),
                    new UglifyPlugin([
                        {
                            sources: ["resource/2d/default.thm.js"],
                            target: "default.thm.min.js"
                        },
                        {
                            sources: ["main.js"],
                            target: "main.min.js"
                        }]),
                    new ManifestPlugin({ output: "manifest.json" })
                ]
            };
        }
        else {
            throw `unknown command : ${params.command}`;
        }
    },

    typeSelector: (path) => {
        if (path.indexOf("2d/") >= 0) {
            const ext = path.substr(path.lastIndexOf(".") + 1);
            const typeMap = {
                "jpg": "image",
                "png": "image",
                "webp": "image",
                "json": "json",
                "fnt": "font",
                "pvr": "pvr",
                "mp3": "sound",
                "zip": "zip",
                "mergeJson": "mergeJson",
                "sheet": "sheet"
            };
            const type = typeMap[ext];
            return type;
        }
        else {
            const filei = path.lastIndexOf("/");
            const file = path.substr(filei + 1);
            let i = file.indexOf(".", 0);
            let extname = "";
            while (i >= 0) {
                extname = file.substr(i);
                const typemap = {
                    ".png": "Texture",
                    ".jpg": "Texture",
                    ".json": "json",

                    ".scene.json": "Scene",
                    ".prefab.json": "Prefab",

                    ".image.json": "TextureDesc",
                    ".vs.glsl": 'GLVertexShader',
                    ".fs.glsl": "GLFragmentShader",
                    ".shader.json": "Shader",
                    ".mat.json": "Material",
                    ".mesh.bin": "Mesh",
                    ".ani.bin": "Animation",

                    ".bin": "bin",
                    ".jsonbin": "bin",
                };
                const type = typemap[extname];
                if (type) {
                    return type;
                }

                i = file.indexOf(".", i + 1);
            }

            return "Unknown";
        }
    }
};

export = config;