"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var shaderConfig = require("./ShaderConfig");
function createConfig() {
    var config = {
        version: "3",
        asset: {
            version: "2.0"
        },
        extensions: {},
        extensionsRequired: ["paper", "KHR_techniques_webgl"],
        extensionsUsed: ["paper", "KHR_techniques_webgl"],
    };
    return config;
}
exports.createConfig = createConfig;
function createGLTFExtensionsConfig() {
    var config = createConfig();
    config.extensions = {
        KHR_techniques_webgl: {
            shaders: [],
            techniques: [],
        },
        paper: {},
    };
    return config;
}
exports.createGLTFExtensionsConfig = createGLTFExtensionsConfig;
function filterFileList(folderPath, filter, maxDepth, currentDepth) {
    if (maxDepth === void 0) { maxDepth = 0; }
    if (currentDepth === void 0) { currentDepth = 0; }
    var fileFilteredList = [];
    if (folderPath && fs.existsSync(folderPath)) {
        for (var _i = 0, _a = fs.readdirSync(folderPath); _i < _a.length; _i++) {
            var file = _a[_i];
            var filePath = path.resolve(folderPath, file);
            var fileStatus = fs.lstatSync(filePath);
            if (fileStatus.isDirectory()) {
                if (maxDepth === 0 || currentDepth <= maxDepth) {
                    fileFilteredList = fileFilteredList.concat(filterFileList(filePath, filter, currentDepth + 1));
                }
            }
            else if (!filter || filter.test(filePath)) {
                fileFilteredList.push(filePath);
            }
        }
    }
    return fileFilteredList;
}
exports.filterFileList = filterFileList;
function parseIncludes(string, shaderChunks) {
    var pattern = /^[ \t]*#include +<([\w\d./]+)>/gm;
    //
    function replace(_match, include) {
        var replace = shaderChunks[include];
        if (replace === undefined) {
            // console.warn('Can not resolve #include <' + include + '>');
            return "";
            // throw new Error('Can not resolve #include <' + include + '>');
        }
        return parseIncludes(replace, shaderChunks);
    }
    //
    return string.replace(pattern, replace);
}
exports.parseIncludes = parseIncludes;
function parseAttributeName(string) {
    if (string.indexOf("attribute") >= 0) {
        return string.substring(string.lastIndexOf(" ") + 1, string.length - 1);
    }
    console.error(" 未知的的Attribute:" + string);
    return "";
}
exports.parseAttributeName = parseAttributeName;
function parseUniformName(string) {
    if (string.indexOf("uniform") >= 0) {
        //
        if (string.indexOf("[") >= 0) {
            string = string.substring(0, string.indexOf("["));
            return string.substring(string.lastIndexOf(" ") + 1, string.length) + "[0]";
        }
        else {
            return string.substring(string.lastIndexOf(" ") + 1, string.length - 1);
        }
    }
    console.error(" 未知的的Uniform:" + string);
    return "";
}
exports.parseUniformName = parseUniformName;
function parseUniformType(string, name) {
    for (var key in shaderConfig.UNIFORM_TYPE_MAP) {
        if (string.indexOf(key) >= 0) {
            return shaderConfig.UNIFORM_TYPE_MAP[key];
        }
    }
    // console.log("   不支持的Uniform类型:" + name);
    return -1 /* STRUCT */;
}
exports.parseUniformType = parseUniformType;
function parseAttribute(name) {
    var attribute = { semantic: "Unknown" };
    //系统内置的
    if (name in shaderConfig.ATTRIBUTE_TEMPLATE) {
        // attribute.semantic = shaderConfig.ATTRIBUTE_TEMPLATE[name];
        return null;
    }
    //用户自定义的
    else if (name in shaderConfig.CUSTOM_ATTRIBUTE_TEMPLATE) {
        attribute.semantic = shaderConfig.CUSTOM_ATTRIBUTE_TEMPLATE[name];
    }
    return attribute;
}
exports.parseAttribute = parseAttribute;
function parseUniform(string, name) {
    var uniform = { type: 5124 /* INT */ };
    //系统内置的
    if (name in shaderConfig.UNIFORM_TEMPLATE) {
        if (shaderConfig.UNIFORM_TEMPLATE[name].semantic) {
            return null;
        }
        // if (shaderConfig.UNIFORM_TEMPLATE[name].semantic) {
        //     uniform.semantic = shaderConfig.UNIFORM_TEMPLATE[name].semantic;
        // }
        // else {
        //     uniform.value = [];
        // }
        if (shaderConfig.UNIFORM_TEMPLATE[name].value) {
            uniform.value = shaderConfig.UNIFORM_TEMPLATE[name].value;
        }
    }
    //用户自定义的
    else if (name in shaderConfig.CUSTOM_UNIFORM_TEMPLATE) {
        if (shaderConfig.CUSTOM_UNIFORM_TEMPLATE[name].semantic) {
            uniform.semantic = shaderConfig.CUSTOM_UNIFORM_TEMPLATE[name].semantic;
        }
        else {
            uniform.value = [];
        }
        if (shaderConfig.CUSTOM_UNIFORM_TEMPLATE[name].value) {
            uniform.value = shaderConfig.CUSTOM_UNIFORM_TEMPLATE[name].value;
        }
    }
    else {
        // console.log("   没有设置默认值:" + name);
        // uniform.value = [];
    }
    uniform.type = parseUniformType(string, name);
    return uniform;
}
exports.parseUniform = parseUniform;
function checkValid(asset) {
    //先检查顶点和片段是否都在
    var KHR_techniques_webgl = asset.extensions.KHR_techniques_webgl;
    {
        var shaders = KHR_techniques_webgl.shaders;
        if (shaders.length !== 2) {
            console.warn("缺少顶点或者片段着色器");
            return false;
        }
        if (shaders[0].type === shaders[1].type) {
            console.warn("两个着色器类型相同");
            return false;
        }
        if (shaders[0].type !== 35633 /* VERTEX_SHADER */ && shaders[0].type !== 35632 /* FRAGMENT_SHADER */) {
            console.warn(shaders[0].name + "着色器类型错误");
            return false;
        }
        if (shaders[1].type !== 35633 /* VERTEX_SHADER */ && shaders[1].type !== 35632 /* FRAGMENT_SHADER */) {
            console.warn(shaders[1].name + "着色器类型错误");
            return false;
        }
    }
    return true;
}
exports.checkValid = checkValid;
function parseShader(file) {
    var buffer = fs.readFileSync(file);
    var transformedCode = buffer.toString()
        .replace(/\r/g, '\n') // \r to \n
        .replace(/[ \t]*\/\/.*\n/g, '\n') // remove //
        .replace(/[ \t]*\/\*[\s\S]*?\*\//g, '\n') // remove /* */
        .replace(/\n{2,}/g, '\n') // \n+ to \n;

    return transformedCode;
}
exports.parseShader = parseShader;
