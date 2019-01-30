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
    var lights;
    (function (lights) {
        var Physical = (function () {
            function Physical() {
            }
            Physical.prototype.start = function () {
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
                                //
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/hardwood2_diffuse.jpg")];
                            case 2:
                                //
                                //
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/hardwood2_bump.jpg")];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/hardwood2_roughness.jpg")];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/brick_diffuse.jpg")];
                            case 5:
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/brick_bump.jpg")];
                            case 6:
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/planets/earth_atmos_2048.jpg")];
                            case 7:
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/planets/earth_specular_2048.jpg")];
                            case 8:
                                _a.sent();
                                //
                                paper.GameObject.globalGameObject.addComponent(Starter);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return Physical;
        }());
        lights.Physical = Physical;
        __reflect(Physical.prototype, "examples.lights.Physical", ["examples.Example"]);
        var Starter = (function (_super) {
            __extends(Starter, _super);
            function Starter() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Starter.prototype.onAwake = function () {
                var mainCamera = egret3d.Camera.main;
                {
                    var renderState = this.gameObject.getComponent(egret3d.RenderState);
                    // physicallyCorrectLights 
                    // shadowMap
                    renderState.gammaInput = true;
                    renderState.gammaOutput = true;
                    renderState.gammaFactor = 2.0;
                    renderState.toneMapping = 2 /* ReinhardToneMapping */;
                }
                {
                    mainCamera.fov = 50.0 * 0.017453292519943295 /* DEG_RAD */;
                    mainCamera.far = 100.0;
                    mainCamera.near = 0.1;
                    mainCamera.backgroundColor.fromHex(0x000000);
                    mainCamera.transform.setLocalPosition(-4.0, 2.0, -4.0).lookAt(egret3d.Vector3.ZERO);
                }
                {
                    paper.Scene.activeScene.ambientColor.fromHex(0x000000);
                    //
                    var pointLight = paper.GameObject.create("Point Light").addComponent(egret3d.PointLight);
                    pointLight.decay = 2.0;
                    pointLight.distance = 100.0;
                    pointLight.intensity = 1.0;
                    pointLight.color.fromHex(0xFFEE88);
                    pointLight.castShadows = true;
                    pointLight.transform.setLocalPosition(0.0, 2.0, 0.0);
                    var wander = pointLight.gameObject.addComponent(behaviors.Wander);
                    wander.radius = 3.0;
                    wander.center.set(0.0, 4.0, 0.0);
                    //
                    var gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.SPHERE, "Bulb");
                    gameObject.renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_STANDARD)
                        .setColor("emissive" /* Emissive */, 0xFFFFEE)
                        .setColor(0x000000);
                    gameObject.transform.setLocalScale(0.04).setParent(pointLight.gameObject.transform);
                    //
                    var hemisphereLight = paper.GameObject.create("Hemisphere Light").addComponent(egret3d.HemisphereLight);
                    hemisphereLight.intensity = 0.02;
                    hemisphereLight.color.fromHex(0xDDEEFF);
                    hemisphereLight.groundColor.fromHex(0x0F0E0D);
                    hemisphereLight.transform.setLocalPosition(0.0, 2.0, 0.0).lookAt(egret3d.Vector3.ZERO);
                }
                {
                    var textureDiffue = RES.getRes("threejs/textures/planets/earth_atmos_2048.jpg");
                    var textureMetalness = RES.getRes("threejs/textures/planets/earth_specular_2048.jpg");
                    textureDiffue.gltfTexture.extensions.paper.anisotropy = 4;
                    textureMetalness.gltfTexture.extensions.paper.anisotropy = 4;
                    var mesh = egret3d.MeshBuilder.createSphere(0.25, 0.0, 0.0, 0.0, 32, 32);
                    var gameObject = egret3d.DefaultMeshes.createObject(mesh);
                    var renderer = gameObject.renderer;
                    renderer.castShadows = true;
                    renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_STANDARD)
                        .setFloat("roughness" /* Roughness */, 0.5)
                        .setFloat("metalness" /* Metalness */, 1.0)
                        .setTexture(textureDiffue)
                        .setTexture("metalnessMap" /* MetalnessMap */, textureMetalness)
                        .setColor(0xFFFFFF);
                    gameObject.transform.setLocalPosition(1.0, 0.25, -1.0).setLocalEulerAngles(0.0, 180.0, 0.0);
                    {
                        var textureDiffue_1 = RES.getRes("threejs/textures/brick_diffuse.jpg");
                        var textureBump = RES.getRes("threejs/textures/brick_bump.jpg");
                        textureDiffue_1.gltfTexture.extensions.paper.anisotropy = 4;
                        textureBump.gltfTexture.extensions.paper.anisotropy = 4;
                        var boxMaterial = egret3d.Material.create(egret3d.DefaultShaders.MESH_STANDARD)
                            .setFloat("roughness" /* Roughness */, 0.7)
                            .setFloat("metalness" /* Metalness */, 0.7)
                            .setFloat("bumpScale" /* BumpScale */, 0.002)
                            .setTexture(textureDiffue_1)
                            .setTexture("bumpMap" /* BumpMap */, textureBump)
                            .setColor(0xFFFFFF);
                        {
                            var gameObject_1 = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "Cube A");
                            var renderer_1 = gameObject_1.renderer;
                            renderer_1.castShadows = true;
                            renderer_1.material = boxMaterial;
                            gameObject_1.transform.setLocalPosition(-0.5, 0.25, 1.0).setLocalScale(0.5);
                        }
                        {
                            var gameObject_2 = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "Cube B");
                            var renderer_2 = gameObject_2.renderer;
                            renderer_2.castShadows = true;
                            renderer_2.material = boxMaterial;
                            gameObject_2.transform.setLocalPosition(0.0, 0.25, 5.0).setLocalScale(0.5);
                        }
                        {
                            var gameObject_3 = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "Cube C");
                            var renderer_3 = gameObject_3.renderer;
                            renderer_3.castShadows = true;
                            renderer_3.material = boxMaterial;
                            gameObject_3.transform.setLocalPosition(7.5, 0.25, 0.0).setLocalScale(0.5);
                        }
                    }
                }
                {
                    var textureDiffue = RES.getRes("threejs/textures/hardwood2_diffuse.jpg");
                    var textureBump = RES.getRes("threejs/textures/hardwood2_bump.jpg");
                    var textureRoughness = RES.getRes("threejs/textures/hardwood2_roughness.jpg");
                    textureDiffue.gltfTexture.extensions.paper.anisotropy = 4;
                    textureBump.gltfTexture.extensions.paper.anisotropy = 4;
                    textureRoughness.gltfTexture.extensions.paper.anisotropy = 4;
                    var gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.QUAD);
                    var renderer = gameObject.renderer;
                    renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_STANDARD)
                        .setFloat("roughness" /* Roughness */, 0.8)
                        .setFloat("metalness" /* Metalness */, 0.2)
                        .setFloat("bumpScale" /* BumpScale */, 0.0005)
                        .setColor(0xFFFFFF)
                        .setTexture(textureDiffue)
                        .setTexture("bumpMap" /* BumpMap */, textureBump)
                        .setTexture("roughnessMap" /* RoughnessMap */, textureRoughness)
                        .setUVTransform(egret3d.Matrix3.create().fromUVTransform(0.0, 0.0, 10.0, 24.0, 0.0, 0.0, 0.0).release());
                    renderer.receiveShadows = true;
                    gameObject.transform.setLocalScale(20.0).setLocalEulerAngles(90.0, 0.0, 0.0);
                }
            };
            return Starter;
        }(paper.Behaviour));
        __reflect(Starter.prototype, "Starter");
    })(lights = examples.lights || (examples.lights = {}));
})(examples || (examples = {}));
