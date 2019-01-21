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
    var textures;
    (function (textures) {
        var Anisotropy = (function () {
            function Anisotropy() {
            }
            Anisotropy.prototype.start = function () {
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
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/crate.gif")];
                            case 2:
                                //
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/crate_b.gif")];
                            case 3:
                                _a.sent();
                                //
                                paper.GameObject.globalGameObject.addComponent(Starter);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return Anisotropy;
        }());
        textures.Anisotropy = Anisotropy;
        __reflect(Anisotropy.prototype, "examples.textures.Anisotropy", ["examples.Example"]);
        var Starter = (function (_super) {
            __extends(Starter, _super);
            function Starter() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._mainCamera = egret3d.Camera.main;
                _this._subCamera = paper.GameObject.create("Sub Camera").addComponent(egret3d.Camera);
                return _this;
            }
            Starter.prototype.onAwake = function () {
                var renderState = this.gameObject.getComponent(egret3d.RenderState);
                var textureA = RES.getRes("threejs/textures/crate.gif");
                var textureB = RES.getRes("threejs/textures/crate_b.gif");
                textureA.gltfTexture.extensions.paper.anisotropy = renderState.maxAnisotropy;
                textureB.gltfTexture.extensions.paper.anisotropy = 1;
                var mainCamera = this._mainCamera;
                var subCamera = this._subCamera;
                {
                    subCamera.order = 1;
                    subCamera.fov = 35.0 * 0.017453292519943295 /* DEG_RAD */;
                    subCamera.far = 25000.0;
                    subCamera.near = 1.0;
                    subCamera.bufferMask = 256 /* Depth */;
                    subCamera.cullingMask = 1024 /* UserLayer10 */;
                    subCamera.viewport.set(0.0, 0.0, 0.5, 1.0).update();
                    subCamera.transform.setLocalPosition(0.0, 300.0, -1500.0).lookAt(egret3d.Vector3.ZERO);
                }
                {
                    mainCamera.fov = 35.0 * 0.017453292519943295 /* DEG_RAD */;
                    mainCamera.far = 25000.0;
                    mainCamera.near = 1.0;
                    mainCamera.cullingMask = 2048 /* UserLayer11 */;
                    mainCamera.backgroundColor.fromHex(0xF2F7FF);
                    mainCamera.viewport.set(0.5, 0.0, 0.5, 1.0).update();
                    mainCamera.transform.setLocalPosition(0.0, 300.0, -1500.0).lookAt(egret3d.Vector3.ZERO);
                }
                {
                    //
                    var activeScene = paper.Scene.activeScene;
                    activeScene.fog.mode = 1 /* Fog */;
                    activeScene.fog.far = 25000.0;
                    activeScene.fog.near = 1.0;
                    activeScene.fog.color.fromHex(0xF2F7FF);
                    //
                    activeScene.ambientColor.fromHex(0xEEF0FF);
                    //
                    var directionalLight = paper.GameObject.create("Directional Light").addComponent(egret3d.DirectionalLight);
                    directionalLight.intensity = 2.0;
                    directionalLight.transform.setLocalPosition(1.0, 1.0, 1.0).lookAt(egret3d.Vector3.ZERO);
                }
                {
                    var gameObjectA = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Floor A");
                    var rendererA = gameObjectA.renderer;
                    rendererA.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_PHONG)
                        .setUVTransform(egret3d.Matrix3.create().fromUVTransform(0.0, 0.0, 512.0, 512.0, 0.0, 0.0, 0.0).release())
                        .setTexture(textureA);
                    gameObjectA.layer = 1024 /* UserLayer10 */;
                    gameObjectA.transform.setLocalEulerAngles(90.0, 0.0, 0.0).setLocalScale(10000.0);
                    gameObjectA.addComponent(behaviors.Rotater).speed.set(0.0, 0.005, 0.0);
                    var gameObjectB = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Floor B");
                    var rendererB = gameObjectB.renderer;
                    rendererB.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_PHONG)
                        .setUVTransform(egret3d.Matrix3.create().fromUVTransform(0.0, 0.0, 512.0, 512.0, 0.0, 0.0, 0.0).release())
                        .setTexture(textureB);
                    gameObjectB.layer = 2048 /* UserLayer11 */;
                    gameObjectB.transform.setLocalEulerAngles(90.0, 0.0, 0.0).setLocalScale(10000.0);
                    gameObjectB.addComponent(behaviors.Rotater).speed.set(0.0, 0.005, 0.0);
                }
            };
            return Starter;
        }(paper.Behaviour));
        __reflect(Starter.prototype, "Starter");
    })(textures = examples.textures || (examples.textures = {}));
})(examples || (examples = {}));
