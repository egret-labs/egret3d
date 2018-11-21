#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var ShaderUtils = require("./ShaderUtils");
var ColletCustomShaderCommand = /** @class */ (function () {
    function ColletCustomShaderCommand(root) {
        this._root = root;
    }
    ColletCustomShaderCommand.prototype.execute = function (shaderContext) {
        //分析出vert，frag和chunk文件
        var allShaders = ShaderUtils.filterFileList(this._root, /.glsl/);
        var chunkFiles = [];
        var libFiles = [];
        var tempMap = {};
        //Find Shaders
        for (var _i = 0, allShaders_1 = allShaders; _i < allShaders_1.length; _i++) {
            var file = allShaders_1[_i];
            var fileName = path.basename(file);
            var shaderName = fileName.substring(0, fileName.lastIndexOf("_"));
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
        for (var _a = 0, allShaders_2 = allShaders; _a < allShaders_2.length; _a++) {
            var file = allShaders_2[_a];
            if (libFiles.indexOf(file) < 0 && chunkFiles.indexOf(file) < 0) {
                chunkFiles.push(file);
                var fileName = path.basename(file);
                var shaderName = fileName.substring(0, fileName.lastIndexOf("_"));
                console.log("确认为Shader Chunks:" + shaderName);
            }
        }
        shaderContext.chunkFiles = chunkFiles;
        shaderContext.libFiles = libFiles;
    };
    return ColletCustomShaderCommand;
}());
exports.ColletCustomShaderCommand = ColletCustomShaderCommand;
var ColletEngineShaderCommand = /** @class */ (function () {
    function ColletEngineShaderCommand(chunkFile, libFile) {
        this._chunkFile = chunkFile;
        this._libFile = libFile;
    }
    ColletEngineShaderCommand.prototype.execute = function (shaderContext) {
        shaderContext.chunkFiles = ShaderUtils.filterFileList(this._chunkFile, /.glsl/);
        shaderContext.libFiles = ShaderUtils.filterFileList(this._libFile, /.glsl/);
    };
    return ColletEngineShaderCommand;
}());
exports.ColletEngineShaderCommand = ColletEngineShaderCommand;
var LoadCommonShaderCommand = /** @class */ (function () {
    function LoadCommonShaderCommand(commonDir) {
        this._commonDir = commonDir;
    }
    LoadCommonShaderCommand.prototype.execute = function (shaderContext) {
        if (shaderContext.shaderChunks["common"] &&
            shaderContext.shaderChunks["common_vert_def"] &&
            shaderContext.shaderChunks["common_frag_def"]) {
            return;
        }
        var commonFile = this._commonDir + "common.glsl";
        var commonVertDefFile = this._commonDir + "common_vert_def.glsl";
        var commonFragDefFile = this._commonDir + "common_frag_def.glsl";
        if (!fs.existsSync(commonFile)) {
            console.warn("缺少: common.glsl");
        }
        if (!fs.existsSync(commonVertDefFile)) {
            console.warn("缺少: common_vert_def.glsl");
        }
        if (!fs.existsSync(commonFragDefFile)) {
            console.warn("缺少: common_frag_def.glsl");
        }
        //
        shaderContext.shaderChunks["common"] = fs.readFileSync(commonFile, "utf-8");
        shaderContext.shaderChunks["common_vert_def"] = fs.readFileSync(commonVertDefFile, "utf-8");
        shaderContext.shaderChunks["common_frag_def"] = fs.readFileSync(commonFragDefFile, "utf-8");
    };
    return LoadCommonShaderCommand;
}());
exports.LoadCommonShaderCommand = LoadCommonShaderCommand;
var ParseShaderCommand = /** @class */ (function () {
    function ParseShaderCommand() {
    }
    ParseShaderCommand.prototype.execute = function (shaderContext) {
        for (var _i = 0, _a = shaderContext.chunkFiles; _i < _a.length; _i++) {
            var file = _a[_i];
            var fileName = path.basename(file);
            var chunkName = fileName.substring(0, fileName.indexOf("."));
            shaderContext.shaderChunks[chunkName] = fs.readFileSync(file, "utf-8");
        }
        for (var _b = 0, _c = shaderContext.libFiles; _b < _c.length; _b++) {
            var file = _c[_b];
            var fileName = path.basename(file);
            var dirName = path.dirname(file);
            var shaderName = fileName.substring(0, fileName.indexOf("_"));
            var type = fileName.indexOf("frag") >= 0 ? 35632 /* FRAGMENT_SHADER */ : 35633 /* VERTEX_SHADER */;
            var context = fs.readFileSync(file, "utf-8");
            shaderContext.shaderLibs[fileName] = { fileName: fileName, context: context, type: type };
            if (!(shaderName in shaderContext.shaders)) {
                shaderContext.shaders[shaderName] = { vert: "", frag: "", dir: dirName };
            }
            if (type === 35633 /* VERTEX_SHADER */) {
                shaderContext.shaders[shaderName].vert = fileName;
            }
            else {
                shaderContext.shaders[shaderName].frag = fileName;
            }
        }
        var attrReg = new RegExp("attribute ([\\w])+ ([\\w])+;", "g");
        var uniformReg = new RegExp("uniform ([\\w])+ ([\\w\\[\\]\\* ])+;", "g");
        for (var name_1 in shaderContext.shaders) {
            console.log("处理:" + name_1);
            var vertName = shaderContext.shaders[name_1].vert;
            var fragName = shaderContext.shaders[name_1].frag;
            if (!shaderContext.shaderLibs[vertName] || !shaderContext.shaderLibs[fragName]) {
                if (!shaderContext.shaderChunks[vertName]) {
                    console.warn("没有对应的顶点着色器:" + vertName);
                }
                if (!shaderContext.shaderChunks[fragName]) {
                    console.warn("没有对应的片段着色器:" + fragName);
                }
                continue;
            }
            var orginVert = shaderContext.shaderLibs[vertName];
            var orginFrag = shaderContext.shaderLibs[fragName];
            var vertShader = ShaderUtils.parseIncludes(orginVert.context, shaderContext.shaderChunks);
            var fragShader = ShaderUtils.parseIncludes(orginFrag.context, shaderContext.shaderChunks);
            var all = vertShader + fragShader;
            var asset = ShaderUtils.createGLTFExtensionsConfig();
            var assetShaders = [];
            assetShaders.push({ name: vertName.substr(0, vertName.indexOf(".")), type: orginVert.type, uri: orginVert.fileName });
            assetShaders.push({ name: fragName.substr(0, fragName.indexOf(".")), type: orginFrag.type, uri: orginFrag.fileName });
            asset.extensions.KHR_techniques_webgl.shaders = assetShaders;
            //
            var technique = { name: name_1, attributes: {}, uniforms: {}, states: { enable: [], functions: {} } };
            //寻找所有attribute
            var attrMatchResult = all.match(attrReg);
            if (attrMatchResult) {
                for (var _d = 0, attrMatchResult_1 = attrMatchResult; _d < attrMatchResult_1.length; _d++) {
                    var attrStr = attrMatchResult_1[_d];
                    var attName = ShaderUtils.parseAttributeName(attrStr);
                    var result = ShaderUtils.parseAttribute(attName);
                    if (result) {
                        technique.attributes[attName] = result;
                    }
                    else {
                        //系统内置的Attribute，不用写进去
                    }
                    // technique.attributes[attName] = ShaderUtils.parseAttribute(attName);
                }
            }
            //寻找所有unifrom
            var uniformMatchResult = all.match(uniformReg);
            if (uniformMatchResult) {
                for (var _e = 0, uniformMatchResult_1 = uniformMatchResult; _e < uniformMatchResult_1.length; _e++) {
                    var uniformStr = uniformMatchResult_1[_e];
                    var uniformName = ShaderUtils.parseUniformName(uniformStr);
                    var result = ShaderUtils.parseUniform(uniformStr, uniformName);
                    if (result) {
                        technique.uniforms[uniformName] = result;
                    }
                    else {
                        //系统内置的Uniform,不用写进去
                    }
                    // technique.uniforms[uniformName] = ShaderUtils.parseUniform(uniformStr, uniformName);
                }
            }
            asset.extensions.KHR_techniques_webgl.techniques = [technique];
            shaderContext.shaderAssets[name_1] = asset;
        }
    };
    return ParseShaderCommand;
}());
exports.ParseShaderCommand = ParseShaderCommand;
var GenerateChunksCommand = /** @class */ (function () {
    function GenerateChunksCommand(outputPath, outputName, spaceName) {
        this._spaceName = spaceName;
        this._outputName = outputName;
        this._outputPath = outputPath;
    }
    GenerateChunksCommand.prototype.execute = function (shaderContext) {
        console.log("-----------------generateChunks------------------");
        if (shaderContext.chunkFiles) {
            var all = "namespace " + this._spaceName + "." + this._outputName + " {\n";
            for (var _i = 0, _a = shaderContext.chunkFiles; _i < _a.length; _i++) {
                var file = _a[_i];
                var name = path.basename(file).replace(/\.glsl$/, "");
                console.log("处理:" + name);
                all += "export const " + name + " = " + JSON.stringify(ShaderUtils.parseShader(file)) + ";\n";
            }
            all += "}\n";
            fs.writeFileSync(this._outputPath + this._outputName + ".ts", all);
        }
        console.log("-----------------Chunks is OK------------------");
    };
    return GenerateChunksCommand;
}());
exports.GenerateChunksCommand = GenerateChunksCommand;
var GenerateLibsCommand = /** @class */ (function () {
    function GenerateLibsCommand(outputPath, outputName, spaceName) {
        this._spaceName = spaceName;
        this._outputName = outputName;
        this._outputPath = outputPath;
    }
    GenerateLibsCommand.prototype.execute = function (shaderContext) {
        console.log("-----------------generateLibs------------------");
        if (!fs.existsSync(path.dirname(this._outputPath))) {
            fs.mkdirSync(path.dirname(this._outputPath));
        }
        var all = "namespace " + this._spaceName + "." + this._outputName + " {\n";
        for (var name_2 in shaderContext.shaderAssets) {
            var asset = shaderContext.shaderAssets[name_2];
            var shaders = asset.extensions.KHR_techniques_webgl.shaders;
            //直接拿context填充
            var tempUri0 = shaders[0].uri;
            var tempUri1 = shaders[1].uri;
            shaders[0].uri = shaderContext.shaderLibs[tempUri0].context;
            shaders[1].uri = shaderContext.shaderLibs[tempUri1].context;
            all += "    export const " + name_2 + " = " + JSON.stringify(asset) + ";\n";
            //还原
            shaders[0].uri = tempUri0;
            shaders[1].uri = tempUri1;
        }
        all += "}\n";
        fs.writeFileSync(this._outputPath + this._outputName + ".ts", all);
        console.log("-----------------Libs is OK------------------");
    };
    return GenerateLibsCommand;
}());
exports.GenerateLibsCommand = GenerateLibsCommand;
var GenerateGLTFCommand = /** @class */ (function () {
    function GenerateGLTFCommand(outputPath) {
        if (outputPath === void 0) { outputPath = ""; }
        this._outputPath = outputPath;
    }
    GenerateGLTFCommand.prototype.execute = function (shaderContext) {
        console.log("-----------------generateGLTF------------------");
        for (var name_3 in shaderContext.shaderAssets) {
            var asset = shaderContext.shaderAssets[name_3];
            var dir = this._outputPath !== "" ? this._outputPath : shaderContext.shaders[name_3].dir + "\\";
            var outPath = dir + name_3 + ".shader.json";
            if (!fs.existsSync(path.dirname(outPath))) {
                fs.mkdirSync(path.dirname(outPath));
            }
            console.log("生成:" + outPath);
            var shaders = asset.extensions.KHR_techniques_webgl.shaders;
            var tempUri0 = shaders[0].uri;
            var tempUri1 = shaders[1].uri;
            dir = path.relative(shaderContext.root, dir).split('\\').join("/") + "/";
            shaders[0].uri = dir + shaders[0].name + ".glsl";
            shaders[1].uri = dir + shaders[1].name + ".glsl";
            if (fs.existsSync(outPath)) {
                //如果存在的话
                var oldFile = fs.readFileSync(outPath, "utf-8");
                var oldAsset = JSON.parse(oldFile);
                for (var i = 0, l = oldAsset.extensions.KHR_techniques_webgl.techniques.length; i < l; i++) {
                    if (i >= asset.extensions.KHR_techniques_webgl.techniques.length) {
                        continue;
                    }
                    var oldTechnique = oldAsset.extensions.KHR_techniques_webgl.techniques[i];
                    var newTechnique = asset.extensions.KHR_techniques_webgl.techniques[i];
                    //Uniform Value和State覆盖
                    for (var uniformName in oldTechnique.uniforms) {
                        if (newTechnique.uniforms[uniformName]) {
                            newTechnique.uniforms[uniformName].value = oldTechnique.uniforms[uniformName].value;
                        }
                    }
                    newTechnique.states = oldTechnique.states;
                }
            }
            ShaderUtils.checkValid(asset);
            fs.writeFileSync(outPath, JSON.stringify(asset, null, 4));
            //还原一下uri
            shaders[0].uri = tempUri0;
            shaders[1].uri = tempUri1;
        }
    };
    return GenerateGLTFCommand;
}());
exports.GenerateGLTFCommand = GenerateGLTFCommand;
var ShaderGenerateContext = /** @class */ (function () {
    function ShaderGenerateContext() {
        this.root = "";
        //所有chunk文件路径
        this.chunkFiles = [];
        //所有lib文件路径
        this.libFiles = [];
        //
        this.shaderChunks = {};
        this.shaderLibs = {};
        this.shaders = {};
        //要输出的shader数据
        this.shaderAssets = {};
    }
    ShaderGenerateContext.prototype.execute = function (root, isEngine) {
        if (isEngine === void 0) { isEngine = false; }
        this.root = root;
        this.chunkFiles = [];
        this.libFiles = [];
        this.shaderChunks = {};
        this.shaderLibs = {};
        this.shaders = {};
        this.shaderAssets = {};
        var comanders = [];
        if (isEngine) {
            comanders.push(new ColletEngineShaderCommand(root + "chunks/", root + "shaders/"));
            comanders.push(new ParseShaderCommand());
            comanders.push(new GenerateChunksCommand(root, "ShaderChunk", "egret3d"));
            comanders.push(new GenerateLibsCommand(root, "ShaderLib", "egret3d"));
            // comanders.push(new GenerateGLTFCommand(root + "shadersGLTF/"));
        }
        else {
            comanders.push(new ColletCustomShaderCommand(this.root));
            // comanders.push(new LoadCommonShaderCommand("scripts/shaderPlugin/"));
            comanders.push(new ParseShaderCommand());
            comanders.push(new GenerateGLTFCommand());
        }
        for (var _i = 0, comanders_1 = comanders; _i < comanders_1.length; _i++) {
            var cmd = comanders_1[_i];
            cmd.execute(this);
        }
    };
    return ShaderGenerateContext;
}());
exports.ShaderGenerateContext = ShaderGenerateContext;
//------------------------------------------------------------------------
var shaderContext = new ShaderGenerateContext();
shaderContext.execute("egret3d/asset/default/", true);
