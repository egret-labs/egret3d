var fs = require("fs");

function parseShader(file, path) {
    var buffer = fs.readFileSync(path + file);
    var string = buffer.toString()
        .replace(/\r\n/g, '\n') // for windows
        .replace(/\n/g, '\n') // for windows
        .replace(/\r/g, '\n') // for windows
        .replace(/\t/g, ' ') // for windows;

    return string;
}

function compileShader(inputPath, outputPath, outputName, spaceName) {
    fs.readdir(inputPath, function(err, files) {
        if (err) {
            return console.log(err);
        }

        var all = "namespace " + spaceName + "." + outputName + " {\n";

        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            var name = file.replace(/\.glsl$/, "");

            all += "export const " + name + " = " + JSON.stringify(parseShader(file, inputPath)) + ";\n";
        }

        all += "}\n";

        fs.writeFile(outputPath + outputName + ".ts", all, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file " + outputName + ".ts" + " was saved!");
        });
    });
}

// exports.compileShader = compileShader;

// compileShader("egret3d/asset/default/shaders/", "egret3d/asset/default/", "ShaderLib", "egret3d");
compileShader("egret3d/asset/default/chunks/", "egret3d/asset/default/", "ShaderChunk", "egret3d");