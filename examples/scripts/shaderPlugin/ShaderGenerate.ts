#! /usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import * as gltf from "./GLTF";
import * as ShaderUtils from './ShaderUtils';

type ShaderLib = { fileName: string, context: string, type: gltf.ShaderStage.VERTEX_SHADER | gltf.ShaderStage.FRAGMENT_SHADER };

export interface IShaderCommand {
    execute(shaderContext: ShaderGenerateContext): void;
}

export class ColletCustomShaderCommand implements IShaderCommand {
    private _root: string;
    public constructor(root: string) {
        this._root = root;
    }
    public execute(shaderContext: ShaderGenerateContext) {
        //分析出vert，frag和chunk文件
        const allShaders = ShaderUtils.filterFileList(this._root, /.glsl/);
        const chunkFiles: string[] = [];
        const libFiles: string[] = [];
        const tempMap: { [key: string]: { vert: string, frag: string } } = {};
        //Find Shaders
        for (const file of allShaders) {
            let fileName = path.basename(file);
            const shaderName = fileName.substring(0, fileName.lastIndexOf("_"));
            if (!tempMap[shaderName]) {
                tempMap[shaderName] = { vert: "", frag: "" };
            }
            if (fileName.indexOf("_vert.") >= 0) {
                tempMap[shaderName].vert = file;
            }
            else if (fileName.indexOf("_frag.") >= 0) {
                tempMap[shaderName].frag = file;
            }

            if (tempMap[shaderName].vert !== "" && tempMap[shaderName].frag !== "") {
                if (libFiles.indexOf(file) < 0) {
                    libFiles.push(tempMap[shaderName].vert);
                    libFiles.push(tempMap[shaderName].frag);
                    console.log("确认Shader:" + shaderName);
                }
            }
        }

        //Find Chunks
        for (const file of allShaders) {
            if (libFiles.indexOf(file) < 0 && chunkFiles.indexOf(file) < 0) {
                chunkFiles.push(file);
                let fileName = path.basename(file);
                const shaderName = fileName.substring(0, fileName.lastIndexOf("_"));
                console.log("确认为Shader Chunks:" + shaderName);
            }
        }

        shaderContext.chunkFiles = chunkFiles;
        shaderContext.libFiles = libFiles;
    }
}

export class ColletEngineShaderCommand implements IShaderCommand {
    private _chunkFile: string;
    private _libFile: string;
    public constructor(chunkFile: string, libFile: string) {
        this._chunkFile = chunkFile;
        this._libFile = libFile;
    }
    public execute(shaderContext: ShaderGenerateContext) {
        shaderContext.chunkFiles = ShaderUtils.filterFileList(this._chunkFile, /.glsl/);
        shaderContext.libFiles = ShaderUtils.filterFileList(this._libFile, /.glsl/);
    }
}

export class LoadCommonShaderCommand implements IShaderCommand {
    private _commonDir: string;
    public constructor(commonDir: string) {
        this._commonDir = commonDir;
    }
    public execute(shaderContext: ShaderGenerateContext) {
        if (shaderContext.shaderChunks["common"] &&
            shaderContext.shaderChunks["common_vert_def"] &&
            shaderContext.shaderChunks["common_frag_def"]) {
            return;
        }
        const commonFile = `${this._commonDir}common.glsl`;
        const commonVertDefFile = `${this._commonDir}common_vert_def.glsl`;
        const commonFragDefFile = `${this._commonDir}common_frag_def.glsl`;
        if (!fs.existsSync(commonFile)){
            console.warn("缺少: common.glsl");
        }
        if (!fs.existsSync(commonVertDefFile)){
            console.warn("缺少: common_vert_def.glsl");
        }
        if (!fs.existsSync(commonFragDefFile)){
            console.warn("缺少: common_frag_def.glsl");
        }
        //
        shaderContext.shaderChunks["common"] = fs.readFileSync(commonFile, "utf-8");
        shaderContext.shaderChunks["common_vert_def"] = fs.readFileSync(commonVertDefFile, "utf-8");
        shaderContext.shaderChunks["common_frag_def"] = fs.readFileSync(commonFragDefFile, "utf-8");
    }
}

export class ParseShaderCommand implements IShaderCommand {
    public execute(shaderContext: ShaderGenerateContext) {
        for (const file of shaderContext.chunkFiles) {
            const fileName = path.basename(file);
            const chunkName = fileName.substring(0, fileName.indexOf("."));
            shaderContext.shaderChunks[chunkName] = fs.readFileSync(file, "utf-8");
        }

        for (const file of shaderContext.libFiles) {
            const fileName = path.basename(file);
            const dirName = path.dirname(file);
            const shaderName = fileName.substring(0, fileName.indexOf("_"));
            const type = fileName.indexOf("frag") >= 0 ? gltf.ShaderStage.FRAGMENT_SHADER : gltf.ShaderStage.VERTEX_SHADER;
            const context = fs.readFileSync(file, "utf-8");

            shaderContext.shaderLibs[fileName] = { fileName, context, type };
            if (!(shaderName in shaderContext.shaders)) {
                shaderContext.shaders[shaderName] = { vert: "", frag: "", dir: dirName };
            }

            if (type === gltf.ShaderStage.VERTEX_SHADER) {
                shaderContext.shaders[shaderName].vert = fileName;
            }
            else {
                shaderContext.shaders[shaderName].frag = fileName;
            }
        }
        let attrReg = new RegExp("attribute ([\\w])+ ([\\w])+;", "g");
        let uniformReg = new RegExp("uniform ([\\w])+ ([\\w\\[\\]\\* ])+;", "g");

        const globalVertStr = shaderContext.shaderChunks["common_vert_def"];
        const globalFragStr = shaderContext.shaderChunks["common_frag_def"];
        for (const name in shaderContext.shaders) {
            console.log("处理:" + name);
            const vertName = shaderContext.shaders[name].vert;
            const fragName = shaderContext.shaders[name].frag;
            if (!shaderContext.shaderLibs[vertName] || !shaderContext.shaderLibs[fragName]) {
                if (!shaderContext.shaderChunks[vertName]) {
                    console.warn("没有对应的顶点着色器:" + vertName);
                }
                if (!shaderContext.shaderChunks[fragName]) {
                    console.warn("没有对应的片段着色器:" + fragName);
                }
                continue;
            }

            const orginVert = shaderContext.shaderLibs[vertName];
            const orginFrag = shaderContext.shaderLibs[fragName];
            const vertShader = ShaderUtils.parseIncludes(globalVertStr + orginVert.context, shaderContext.shaderChunks);
            const fragShader = ShaderUtils.parseIncludes(globalFragStr + orginFrag.context, shaderContext.shaderChunks);

            const all = vertShader + fragShader;

            const asset = ShaderUtils.createGLTFExtensionsConfig();
            const assetShaders: gltf.Shader[] = [];
            assetShaders.push({ name: vertName.substr(0, vertName.indexOf(".")), type: orginVert.type, uri: orginVert.fileName });
            assetShaders.push({ name: fragName.substr(0, fragName.indexOf(".")), type: orginFrag.type, uri: orginFrag.fileName });
            asset.extensions.KHR_techniques_webgl!.shaders = assetShaders;

            //
            const technique: gltf.Technique = { name: name, attributes: {}, uniforms: {}, states: { enable: [], functions: {} } } as any;
            //寻找所有attribute
            let attrMatchResult = all.match(attrReg);
            if (attrMatchResult) {
                for (const attrStr of attrMatchResult) {
                    const attName = ShaderUtils.parseAttributeName(attrStr);
                    technique.attributes[attName] = ShaderUtils.parseAttribute(attName);
                }
            }
            //寻找所有unifrom
            let uniformMatchResult = all.match(uniformReg);
            if (uniformMatchResult) {
                for (const uniformStr of uniformMatchResult) {
                    const uniformName = ShaderUtils.parseUniformName(uniformStr);
                    technique.uniforms[uniformName] = ShaderUtils.parseUniform(uniformStr, uniformName);
                }
            }
            asset.extensions.KHR_techniques_webgl!.techniques = [technique];
            shaderContext.shaderAssets[name] = asset;
        }
    }
}

export class GenerateChunksCommand implements IShaderCommand {
    private _spaceName: string;
    private _outputName: string;
    private _outputPath: string;
    public constructor(outputPath: string, outputName: string, spaceName: string) {
        this._spaceName = spaceName;
        this._outputName = outputName;
        this._outputPath = outputPath;
    }
    public execute(shaderContext: ShaderGenerateContext) {
        console.log("-----------------generateChunks------------------");
        if (shaderContext.chunkFiles) {
            var all = "namespace " + this._spaceName + "." + this._outputName + " {\n";

            for (const file of shaderContext.chunkFiles) {
                var name = path.basename(file).replace(/\.glsl$/, "");
                console.log("处理:" + name);

                all += "export const " + name + " = " + JSON.stringify(ShaderUtils.parseShader(file)) + ";\n";
            }

            all += "}\n";
            fs.writeFileSync(this._outputPath + this._outputName + ".ts", all);
        }
        console.log("-----------------Chunks is OK------------------");
    }
}

export class GenerateLibsCommand implements IShaderCommand {
    private _spaceName: string;
    private _outputName: string;
    private _outputPath: string;
    public constructor(outputPath: string, outputName: string, spaceName: string) {
        this._spaceName = spaceName;
        this._outputName = outputName;
        this._outputPath = outputPath;
    }
    public execute(shaderContext: ShaderGenerateContext) {
        console.log("-----------------generateLibs------------------");
        if (!fs.existsSync(path.dirname(this._outputPath))) {
            fs.mkdirSync(path.dirname(this._outputPath));
        }
        let all: string = "namespace " + this._spaceName + "." + this._outputName + " {\n";
        for (const name in shaderContext.shaderAssets) {
            const asset = shaderContext.shaderAssets[name];
            const shaders = asset.extensions.KHR_techniques_webgl!.shaders;
            //直接拿context填充
            const tempUri0 = shaders[0].uri as string;
            const tempUri1 = shaders[1].uri as string;
            shaders[0].uri = shaderContext.shaderLibs[tempUri0].context as any;
            shaders[1].uri = shaderContext.shaderLibs[tempUri1].context as any;
            all += "    export const " + name + " = " + JSON.stringify(asset) + ";\n";
            //还原
            shaders[0].uri = tempUri0;
            shaders[1].uri = tempUri1;
        }
        all += "}\n";
        fs.writeFileSync(this._outputPath + this._outputName + ".ts", all);
        console.log("-----------------Libs is OK------------------");
    }
}

export class GenerateGLTFCommand implements IShaderCommand {
    private _outputPath: string;
    public constructor(outputPath: string = "") {
        this._outputPath = outputPath;
    }
    public execute(shaderContext: ShaderGenerateContext) {
        console.log("-----------------generateGLTF------------------");
        for (const name in shaderContext.shaderAssets) {
            const asset = shaderContext.shaderAssets[name];
            let dir = this._outputPath !== "" ? this._outputPath : shaderContext.shaders[name].dir + "\\";
            const outPath = dir + name + ".shader.json";
            if (!fs.existsSync(path.dirname(outPath))) {
                fs.mkdirSync(path.dirname(outPath));
            }
            console.log("生成:" +outPath);
            const shaders = asset.extensions.KHR_techniques_webgl!.shaders;
            const tempUri0 = shaders[0].uri;
            const tempUri1 = shaders[1].uri;
            dir = path.relative(shaderContext.root, dir).split('\\').join("/") + "/";
            shaders[0].uri = dir + shaders[0].name + ".glsl";
            shaders[1].uri = dir + shaders[1].name + ".glsl";
            fs.writeFileSync(outPath, JSON.stringify(asset, null, 4));
            shaders[0].uri = tempUri0;
            shaders[1].uri = tempUri1;            
        }
    }
}
export class ShaderGenerateContext {
    public root: string = "";
    //所有chunk文件路径
    public chunkFiles: string[] = [];
    //所有lib文件路径
    public libFiles: string[] = [];
    //
    public shaderChunks: { [key: string]: string } = {};
    public shaderLibs: { [key: string]: ShaderLib } = {};
    public shaders: { [key: string]: { vert: string, frag: string, dir: string } } = {};
    //要输出的shader数据
    public shaderAssets: { [key: string]: gltf.GLTFEgret } = {};

    public execute(root: string) {
        this.root = root;
        this.chunkFiles = [];
        this.libFiles = [];
        this.shaderChunks = {};
        this.shaderLibs = {};
        this.shaders = {};
        this.shaderAssets = {};

        let comanders: IShaderCommand[] = [];
        if (false) {
            comanders.push(new ColletEngineShaderCommand("egret3d/asset/default/chunks/", "egret3d/asset/default/shaders/"));
            comanders.push(new ParseShaderCommand());
            comanders.push(new GenerateChunksCommand("egret3d/asset/default/", "ShaderChunk", "egret3d"));
            comanders.push(new GenerateLibsCommand("egret3d/asset/default/", "ShaderLib", "egret3d"));
            // comanders.push(new GenerateGLTFCommand("egret3d/asset/default/shadersGLTF/"));
        }
        else {
            comanders.push(new ColletCustomShaderCommand(this.root));
            comanders.push(new LoadCommonShaderCommand("scripts/shaderPlugin/"));
            comanders.push(new ParseShaderCommand());
            comanders.push(new GenerateGLTFCommand());
        }

        for (const cmd of comanders) {
            cmd.execute(this);
        }
    }
}
//------------------------------------------------------------------------
// let shaderContext: ShaderGenerateContext = new ShaderGenerateContext();
// shaderContext.execute("shaders/");