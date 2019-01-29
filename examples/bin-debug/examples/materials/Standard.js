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
        var Standard = (function () {
            function Standard() {
            }
            Standard.prototype.start = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var modelComponent;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // Load resource config.
                            return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/")];
                            case 1:
                                // Load resource config.
                                _a.sent();
                                //
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/cube/pisa/pisa.image.json")];
                            case 2:
                                //
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/models/cerberus/Cerberus_default.mesh.bin")];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/models/cerberus/Cerberus_A.jpg")];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/models/cerberus/Cerberus_N.jpg")];
                            case 5:
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/models/cerberus/Cerberus_RM.jpg")];
                            case 6:
                                _a.sent();
                                //
                                egret3d.Camera.main.gameObject.addComponent(Starter);
                                modelComponent = paper.GameObject.globalGameObject.getComponent(paper.editor.ModelComponent);
                                if (modelComponent) {
                                    modelComponent.select(egret3d.Camera.main.gameObject);
                                    paper.GameObject.globalGameObject.getComponent(paper.editor.GUIComponent).openComponents(Starter);
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return Standard;
        }());
        materials.Standard = Standard;
        __reflect(Standard.prototype, "examples.materials.Standard", ["examples.Example"]);
        var Starter = (function (_super) {
            __extends(Starter, _super);
            function Starter() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._cubeTexture = RES.getRes("threejs/textures/cube/pisa/pisa.image.json");
                return _this;
            }
            Starter.prototype.onAwake = function () {
                var mainCamera = egret3d.Camera.main;
                {
                    var renderState = this.gameObject.getComponent(egret3d.RenderState);
                    renderState.gammaInput = true;
                    renderState.gammaOutput = true;
                    renderState.toneMapping = 2 /* ReinhardToneMapping */;
                    renderState.toneMappingExposure = 3.0;
                }
                {
                    var skyBox = mainCamera.gameObject.getOrAddComponent(egret3d.SkyBox);
                    skyBox.material = egret3d.Material.create(egret3d.DefaultShaders.CUBE).setTexture("tCube" /* CubeMap */, this._cubeTexture);
                }
                {
                    mainCamera.fov = 50.0 * 0.017453292519943295 /* DEG_RAD */;
                    mainCamera.far = 1000.0;
                    mainCamera.near = 0.01;
                    mainCamera.backgroundColor.fromHex(0x111111);
                    mainCamera.transform.setLocalPosition(0.0, 0.0, -2.0);
                    mainCamera.gameObject.addComponent(behaviors.RotateAround);
                }
                {
                    var hemisphereLight = paper.GameObject.create("Hemisphere Light").addComponent(egret3d.HemisphereLight);
                    hemisphereLight.intensity = 4;
                    hemisphereLight.color.fromHex(0x443333);
                    hemisphereLight.groundColor.fromHex(0x222233);
                    hemisphereLight.transform.setLocalPosition(0.0, 100.0, 0.0).lookAt(egret3d.Vector3.ZERO);
                    var directionalLight = paper.GameObject.create("Directional Light").addComponent(egret3d.DirectionalLight);
                    directionalLight.color.fromHex(0xffffff);
                    directionalLight.transform.setLocalPosition(1.0, -0.5, 1.0).lookAt(egret3d.Vector3.ZERO);
                }
                {
                    var cerberus_mesh = RES.getRes("threejs/models/cerberus/Cerberus_default.mesh.bin");
                    var map = RES.getRes("threejs/models/cerberus/Cerberus_A.jpg");
                    var normalMap = RES.getRes("threejs/models/cerberus/Cerberus_N.jpg");
                    var rmMap = RES.getRes("threejs/models/cerberus/Cerberus_RM.jpg");
                    map.sampler.wrapS = 10497 /* Repeat */;
                    rmMap.sampler.wrapS = 10497 /* Repeat */;
                    normalMap.sampler.wrapS = 10497 /* Repeat */;
                    egret3d.creater.createGameObject("cerberus", {
                        mesh: cerberus_mesh,
                        material: egret3d.Material.create(egret3d.DefaultShaders.MESH_STANDARD)
                            .setFloat("metalness" /* Metalness */, 1.0)
                            .setFloat("roughness" /* Roughness */, 1.0)
                            .setTexture(map)
                            .setTexture("normalMap" /* NormalMap */, normalMap)
                            .setTexture("metalnessMap" /* MetalnessMap */, rmMap)
                            .setTexture("roughnessMap" /* RoughnessMap */, rmMap)
                            .setTexture("envMap" /* EnvMap */, this._cubeTexture),
                    });
                }
            };
            return Starter;
        }(paper.Behaviour));
        __reflect(Starter.prototype, "Starter");
    })(materials = examples.materials || (examples.materials = {}));
})(examples || (examples = {}));
