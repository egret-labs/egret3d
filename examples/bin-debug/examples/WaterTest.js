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
    var WaterTest = (function () {
        function WaterTest() {
        }
        WaterTest.prototype.start = function () {
            return __awaiter(this, void 0, void 0, function () {
                var camera, waterImg, waterNormal, light, lightDir, water, effect, meshFilter, meshRender;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Load resource config.
                        return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/")];
                        case 1:
                            // Load resource config.
                            _a.sent(); // Load scene resource.
                            return [4 /*yield*/, RES.getResAsync("textures/water/water_surface03_generic_ab.image.json")];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("textures/water/water_smallwave01_generic_n.image.json")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("shaders/water/water.shader.json")];
                        case 4:
                            _a.sent();
                            camera = egret3d.Camera.main;
                            waterImg = RES.getRes("textures/water/water_surface03_generic_ab.image.json");
                            waterNormal = RES.getRes("textures/water/water_smallwave01_generic_n.image.json");
                            light = paper.GameObject.create("ligth");
                            light.transform.setPosition(0.0, 1.0, 0.0);
                            light.transform.setLocalEulerAngles(50.0, -30.0, 0.0);
                            lightDir = egret3d.Vector3.create();
                            light.transform.getForward(lightDir);
                            water = paper.GameObject.create("water");
                            effect = water.addComponent(behaviors.WaterEffect);
                            effect.lightDir.copy(lightDir);
                            water.transform.setEulerAngles(90.0, 0.0, 0.0);
                            meshFilter = water.getOrAddComponent(egret3d.MeshFilter);
                            meshFilter.mesh = egret3d.MeshBuilder.createPlane(10, 10);
                            meshRender = water.getOrAddComponent(egret3d.MeshRenderer);
                            meshRender.material = egret3d.Material.create(RES.getRes("shaders/water/water.shader.json"));
                            meshRender.material
                                .setTexture("_MainTex", waterImg).setTexture("_NormalTex1", waterNormal).setTexture("_NormalTex2", waterNormal)
                                .setVector4v("_NormalTex1_ST", [20, 12, 0.95, -0.24]).setVector4v("_NormalTex2_ST", [8, 6, -0.07, -0.01])
                                .setVector3("lightDir", lightDir).setColor("lightColor", egret3d.Color.WHITE);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WaterTest;
    }());
    examples.WaterTest = WaterTest;
    __reflect(WaterTest.prototype, "examples.WaterTest", ["examples.Example"]);
})(examples || (examples = {}));
