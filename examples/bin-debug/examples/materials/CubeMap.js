"use strict";
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
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
    var materials;
    (function (materials) {
        var CubeMap = (function () {
            function CubeMap() {
            }
            CubeMap.prototype.start = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // Load resource config.
                            return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/")];
                            case 1:
                                // Load resource config.
                                _a.sent();
                                //
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/cube/SwedishRoyalCastle/SwedishRoyalCastle.image.json")];
                            case 2:
                                //
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("Assets/Models/Threejs/WaltHead.prefab.json")];
                            case 3:
                                _a.sent();
                                //
                                paper.GameObject.globalGameObject.addComponent(Starter);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return CubeMap;
        }());
        materials.CubeMap = CubeMap;
        __reflect(CubeMap.prototype, "examples.materials.CubeMap", ["examples.Example"]);
        var Starter = (function (_super) {
            __extends(Starter, _super);
            function Starter() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Starter.prototype.onAwake = function () {
                var mainCamera = egret3d.Camera.main;
                {
                    var texture = RES.getRes("threejs/textures/cube/SwedishRoyalCastle/SwedishRoyalCastle.image.json");
                    mainCamera.fov = 50.0 * 0.017453292519943295 /* DEG_RAD */;
                    mainCamera.far = 5000.0;
                    mainCamera.near = 1.0;
                    mainCamera.backgroundColor.fromHex(0xFFFFFF);
                    mainCamera.transform.setLocalPosition(0.0, 0.0, -2000.0).lookAt(egret3d.Vector3.ZERO);
                    mainCamera.gameObject.addComponent(egret3d.SkyBox).material = egret3d.Material.create(egret3d.DefaultShaders.CUBE)
                        .setTexture("tCube" /* CubeMap */, texture);
                    mainCamera.gameObject.addComponent(behaviors.RotateAround);
                }
                {
                    paper.Scene.activeScene.ambientColor.fromHex(0xFFFFFF);
                    //
                    var pointLight = paper.GameObject.create("Point Light").addComponent(egret3d.PointLight);
                    pointLight.decay = 0.0;
                    pointLight.distance = 0.0;
                    pointLight.intensity = 2.0;
                    pointLight.color.fromHex(0xFFFFFF);
                }
                {
                    var gameObjectA = paper.Prefab.create("Assets/Models/Threejs/WaltHead.prefab.json");
                    gameObjectA.transform.setLocalScale(15.0).translate(0.0, -500.0, 0.0);
                    gameObjectA.getComponentInChildren(egret3d.MeshRenderer).material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT)
                        .setColor(0xFFFFFF);
                    var gameObjectB = paper.Prefab.create("Assets/Models/Threejs/WaltHead.prefab.json");
                    gameObjectB.transform.setLocalScale(15.0).translate(900.0, -500.0, 0.0);
                    gameObjectB.getComponentInChildren(egret3d.MeshRenderer).material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT)
                        .setColor(0xFFEE00)
                        .setFloat("refractionRatio" /* RefractionRatio */, 0.95).addDefine("ENVMAP_MODE_REFRACTION" /* ENVMAP_MODE_REFRACTION */);
                    var gameObjectC = paper.Prefab.create("Assets/Models/Threejs/WaltHead.prefab.json");
                    gameObjectC.transform.setLocalScale(15.0).translate(-900.0, -500.0, 0.0);
                    gameObjectC.getComponentInChildren(egret3d.MeshRenderer).material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT)
                        .setColor(0xFF6600)
                        .setFloat("reflectivity" /* Reflectivity */, 0.3);
                }
            };
            return Starter;
        }(paper.Behaviour));
        __reflect(Starter.prototype, "Starter");
    })(materials = examples.materials || (examples.materials = {}));
})(examples || (examples = {}));
