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
        var EnvMap = (function () {
            function EnvMap() {
            }
            EnvMap.prototype.start = function () {
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
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/cube/Bridge2/Bridge2.image.json")];
                            case 2:
                                //
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/2294472375_24a3b8ef46_o.jpg")];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/metal.jpg")];
                            case 4:
                                _a.sent();
                                //
                                paper.GameObject.globalGameObject.addComponent(Starter);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return EnvMap;
        }());
        materials.EnvMap = EnvMap;
        __reflect(EnvMap.prototype, "examples.materials.EnvMap", ["examples.Example"]);
        var Starter = (function (_super) {
            __extends(Starter, _super);
            function Starter() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._textureA = RES.getRes("threejs/textures/cube/Bridge2/Bridge2.image.json");
                _this._textureB = RES.getRes("threejs/textures/2294472375_24a3b8ef46_o.jpg");
                _this._textureC = RES.getRes("threejs/textures/metal.jpg");
                return _this;
            }
            Starter.prototype.onAwake = function () {
                var mainCamera = egret3d.Camera.main;
                {
                    var renderState = this.gameObject.getComponent(egret3d.RenderState);
                    renderState.gammaOutput = true;
                    renderState.gammaFactor = 2.0;
                }
                {
                    var sampler = this._textureB.sampler;
                    var extensions = this._textureB.gltfTexture.extensions.paper;
                    sampler.magFilter = 9729 /* Linear */;
                    sampler.minFilter = 9987 /* LinearMipMapLinear */;
                    extensions.encoding = 2 /* sRGBEncoding */;
                    extensions.mapping = 3 /* Equirectangular */;
                }
                {
                    var extensions = this._textureC.gltfTexture.extensions.paper;
                    extensions.encoding = 2 /* sRGBEncoding */;
                    extensions.mapping = 4 /* Spherical */;
                }
                {
                    mainCamera.fov = 70.0 * 0.017453292519943295 /* DEG_RAD */;
                    mainCamera.far = 10000.0;
                    mainCamera.near = 1.0;
                    mainCamera.backgroundColor.fromHex(0x000000);
                    mainCamera.transform.setLocalPosition(0.0, 0.0, -1000.0).lookAt(egret3d.Vector3.ZERO);
                    mainCamera.gameObject.addComponent(egret3d.SkyBox).material = egret3d.Material.create(egret3d.DefaultShaders.CUBE)
                        .setTexture("tCube" /* CubeMap */, this._textureA);
                    // mainCamera.gameObject.addComponent(egret3d.SkyBox).material = egret3d.Material.create(egret3d.DefaultShaders.EQUIRECT)
                    //     .setTexture(egret3d.ShaderUniformName.EquirectMap, this._textureB);
                    mainCamera.gameObject.addComponent(behaviors.RotateAround);
                }
                {
                    paper.Scene.activeScene.ambientColor.fromHex(0xFFFFFF);
                }
                {
                    var mesh = egret3d.MeshBuilder.createSphere(400.0, 0.0, 0.0, 0.0, 48, 24);
                    var gameObject = egret3d.DefaultMeshes.createObject(mesh);
                    gameObject.renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT);
                }
            };
            return Starter;
        }(paper.Behaviour));
        __reflect(Starter.prototype, "Starter");
    })(materials = examples.materials || (examples.materials = {}));
})(examples || (examples = {}));
