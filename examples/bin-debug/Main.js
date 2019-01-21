"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            exampleStart();
            return [2 /*return*/];
        });
    });
}
function exampleStart() {
    var exampleString = getCurrentExampleString();
    var exampleClass;
    if (exampleString.indexOf(".") > 0) {
        var params = exampleString.split(".");
        exampleClass = window.examples[params[0]][params[1]];
    }
    else {
        exampleClass = window.examples[exampleString];
    }
    createGUI(exampleString);
    var exampleObj = new exampleClass();
    exampleObj.start();
    function createGUI(exampleString) {
        var namespaceExamples = window.examples;
        var examples = [];
        for (var k in namespaceExamples) {
            var element = namespaceExamples[k];
            if (element.constructor === Object) {
                for (var kB in element) {
                    var childElement = element[kB];
                    if (childElement.prototype && childElement.prototype.hasOwnProperty("start")) {
                        examples.push([k, kB].join("."));
                    }
                }
            }
            else if (element.prototype && element.prototype.hasOwnProperty("start")) {
                examples.push(k);
            }
        }
        var guiComponent = paper.GameObject.globalGameObject.getOrAddComponent(paper.editor.GUIComponent);
        var gui = guiComponent.hierarchy.addFolder("Examples");
        var options = {
            example: exampleString
        };
        gui.add(options, "example", examples).onChange(function (example) {
            location.href = getNewUrl(example);
        });
        gui.open();
    }
    function getNewUrl(exampleString) {
        var url = location.href;
        var index = url.indexOf("?");
        if (index !== -1) {
            url = url.slice(0, index);
        }
        if (url.indexOf(".html") === -1) {
            url += "index.html";
        }
        url += "?example=" + exampleString;
        return url;
    }
    function getCurrentExampleString() {
        var appFile = "Test";
        var str = location.search;
        str = str.slice(1, str.length);
        var totalArray = str.split("&");
        for (var i = 0; i < totalArray.length; i++) {
            var itemArray = totalArray[i].split("=");
            if (itemArray.length === 2) {
                var key = itemArray[0];
                var value = itemArray[1];
                if (key === "example") {
                    appFile = value;
                    break;
                }
            }
        }
        return appFile;
    }
}
