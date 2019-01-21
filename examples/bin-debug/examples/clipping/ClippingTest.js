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
    var clipping;
    (function (clipping) {
        var ClippingTest = (function () {
            function ClippingTest() {
            }
            ClippingTest.prototype.start = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // Load resource config.
                            return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/")];
                            case 1:
                                // Load resource config.
                                _a.sent();
                                paper.GameObject.globalGameObject.addComponent(Update);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return ClippingTest;
        }());
        clipping.ClippingTest = ClippingTest;
        __reflect(ClippingTest.prototype, "examples.clipping.ClippingTest", ["examples.Example"]);
        var Update = (function (_super) {
            __extends(Update, _super);
            function Update() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._mainCamera = egret3d.Camera.main;
                _this._gameObject = null;
                return _this;
            }
            Update.prototype.onAwake = function () {
                var mainCamera = this._mainCamera;
                {
                    mainCamera.fov = 36.0 * 0.017453292519943295 /* DEG_RAD */;
                    mainCamera.far = 16.0;
                    mainCamera.near = 0.25;
                    mainCamera.backgroundColor.set(0.0, 0.0, 0.0);
                    mainCamera.transform.setLocalPosition(0.0, 1.3, -3.0);
                }
                {
                    paper.Scene.activeScene.ambientColor.fromHex(0x505050);
                    //
                    var spotLight = paper.GameObject.create("Spot Light").addComponent(egret3d.SpotLight);
                    spotLight.angle = Math.PI / 5.0;
                    spotLight.penumbra = 0.2;
                    spotLight.color.fromHex(0xFFFFFF);
                    spotLight.castShadows = true;
                    spotLight.shadow.mapSize = 1024;
                    spotLight.shadow.near = 3.0;
                    spotLight.shadow.far = 10.0;
                    spotLight.transform.setLocalPosition(2.0, 3.0, 3.0).lookAt(egret3d.Vector3.ZERO);
                    //
                    var directionalLight = paper.GameObject.create("Directional Light").addComponent(egret3d.DirectionalLight);
                    directionalLight.intensity = 1.0;
                    directionalLight.color.fromHex(0x55505A);
                    directionalLight.castShadows = true;
                    directionalLight.shadow.mapSize = 1024;
                    directionalLight.shadow.near = 1.0;
                    directionalLight.shadow.far = 10.0;
                    directionalLight.shadow.size = 10;
                    directionalLight.transform.setLocalPosition(0.0, 3.0, 0.0).lookAt(egret3d.Vector3.ZERO);
                }
                {
                    var gameObject = this._gameObject = egret3d.DefaultMeshes.createObject(egret3d.MeshBuilder.createTorusKnot(0.4, 0.08, 95, 20), "Object");
                    var renderer = gameObject.renderer;
                    renderer.castShadows = true;
                    renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_PHONG)
                        .setColor(0x80EE10)
                        .setFloat("shininess" /* Shininess */, 100.0)
                        .setCullFace(false);
                    gameObject.transform.setLocalPosition(0.0, 0.8, 0.0);
                    //
                    mainCamera.transform.lookAt(gameObject.transform);
                }
                {
                    var gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.QUAD, "Background");
                    var renderer = gameObject.renderer;
                    renderer.receiveShadows = true;
                    renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_PHONG)
                        .setColor(0xA0ADAF)
                        .setFloat("shininess" /* Shininess */, 150.0)
                        .setCullFace(false);
                    gameObject.transform.setLocalEulerAngles(90.0, 0.0, 0.0).setLocalScale(9.0);
                }
            };
            Update.prototype.onUpdate = function () {
                var time = paper.clock.time;
                var gameObject = this._gameObject;
                gameObject.transform.setLocalEuler(time * 0.5, time * 0.2, 0.0);
                gameObject.transform.setLocalScale(Math.cos(time) * 0.125 + 0.875);
            };
            return Update;
        }(paper.Behaviour));
        __reflect(Update.prototype, "Update");
    })(clipping = examples.clipping || (examples.clipping = {}));
})(examples || (examples = {}));
