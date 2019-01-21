"use strict";
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
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
var examples;
(function (examples) {
    var LensflareTest = (function () {
        function LensflareTest() {
        }
        LensflareTest.prototype.start = function () {
            return __awaiter(this, void 0, void 0, function () {
                var lensflare0, lensflare1, lensflare2, lensflare3, cube, lensflareObj, lensflareCom;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Load resource config.
                        return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/")];
                        case 1:
                            // Load resource config.
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("logo.png")];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("shaders/lensflare/a.shader.json")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("shaders/lensflare/b.shader.json")];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("shaders/lensflare/lensflare.shader.json")];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("threejs/textures/lensflare/lensflare0.png")];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("threejs/textures/lensflare/lensflare1.png")];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("threejs/textures/lensflare/lensflare2.png")];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("threejs/textures/lensflare/lensflare3.png")];
                        case 9:
                            _a.sent();
                            // Create camera.
                            egret3d.Camera.main;
                            lensflare0 = RES.getRes("threejs/textures/lensflare/lensflare0.png");
                            lensflare1 = RES.getRes("threejs/textures/lensflare/lensflare1.png");
                            lensflare2 = RES.getRes("threejs/textures/lensflare/lensflare2.png");
                            lensflare3 = RES.getRes("threejs/textures/lensflare/lensflare3.png");
                            cube = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "cube");
                            cube.transform.setLocalPosition(0, -1, 0);
                            cube.renderer.material = cube.renderer.material.clone();
                            cube.renderer.material.setTexture(RES.getRes("logo.png"));
                            lensflareObj = paper.GameObject.create("Lensflare");
                            lensflareCom = lensflareObj.addComponent(behaviors.LensflareEffect);
                            lensflareCom.addElement({ texture: lensflare0, size: 700, distance: 0, color: egret3d.Color.create(0.55, 0.9, 1.0, 1.0), rotate: true, angle: 0 });
                            lensflareCom.addElement({ texture: lensflare3, size: 60, distance: 0.6, color: egret3d.Color.WHITE.clone(), rotate: false, angle: 0 });
                            lensflareCom.addElement({ texture: lensflare3, size: 70, distance: 0.7, color: egret3d.Color.WHITE.clone(), rotate: false, angle: 0 });
                            lensflareCom.addElement({ texture: lensflare3, size: 120, distance: 0.9, color: egret3d.Color.WHITE.clone(), rotate: false, angle: 0 });
                            lensflareCom.addElement({ texture: lensflare3, size: 70, distance: 1, color: egret3d.Color.WHITE.clone(), rotate: false, angle: 0 });
                            return [2 /*return*/];
                    }
                });
            });
        };
        return LensflareTest;
    }());
    examples.LensflareTest = LensflareTest;
    __reflect(LensflareTest.prototype, "examples.LensflareTest");
})(examples || (examples = {}));
