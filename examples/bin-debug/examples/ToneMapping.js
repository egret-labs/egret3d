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
    var ToneMapping = (function () {
        function ToneMapping() {
        }
        ToneMapping.prototype.start = function () {
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
                            return [4 /*yield*/, RES.getResAsync("threejs/textures/brick_diffuse.jpg")];
                        case 2:
                            //
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("threejs/textures/brick_bump.jpg")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("threejs/textures/brick_roughness.jpg")];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("threejs/textures/cube/pisa/pisa.image.json")];
                        case 5:
                            _a.sent();
                            paper.GameObject.globalGameObject.addComponent(Start);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return ToneMapping;
    }());
    examples.ToneMapping = ToneMapping;
    __reflect(ToneMapping.prototype, "examples.ToneMapping", ["examples.Example"]);
    var Start = (function (_super) {
        __extends(Start, _super);
        function Start() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Start.prototype.onAwake = function () {
            var mainCamera = egret3d.Camera.main;
            {
                var renderState = paper.GameObject.globalGameObject.getComponent(egret3d.RenderState);
                renderState.gammaInput = true;
                renderState.gammaOutput = true;
                renderState.gammaFactor = 2.0;
                renderState.toneMapping = 3 /* Uncharted2ToneMapping */;
                renderState.toneMappingExposure = 3.0;
                renderState.toneMappingWhitePoint = 5.0;
            }
            {
                mainCamera.fov = 40.0 * 0.017453292519943295 /* DEG_RAD */;
                mainCamera.far = 2000.0;
                mainCamera.near = 1.0;
                mainCamera.backgroundColor.fromHex(0x000000);
                mainCamera.transform.setLocalPosition(0.0, 40.0, -40 * 3.5).lookAt(egret3d.Vector3.ZERO);
            }
            {
                paper.Scene.activeScene.ambientColor.fromHex(0x000000);
                var hemisphereLight = paper.GameObject.create("Hemisphere Light").addComponent(egret3d.HemisphereLight);
                hemisphereLight.color.fromHex(0x111111);
                hemisphereLight.groundColor.fromHex(0x000000);
                hemisphereLight.transform.setLocalPosition(0.0, 100.0, 0.0).lookAt(egret3d.Vector3.ZERO);
                var spotLight = paper.GameObject.create("Spot Light").addComponent(egret3d.SpotLight);
                spotLight.castShadows = true;
                spotLight.angle = Math.PI / 7.0;
                spotLight.decay = 2.0;
                spotLight.distance = 300.0;
                spotLight.penumbra = 0.8;
                spotLight.color.fromHex(0xFFFFFF);
                spotLight.transform.setLocalPosition(50.0, 100.0, -50.0).lookAt(egret3d.Vector3.ZERO);
            }
            {
                var torusKnotMesh = egret3d.MeshBuilder.createTorusKnot(18.0, 8.0, 150.0, 20.0);
                var textureDiffue = RES.getRes("threejs/textures/brick_diffuse.jpg");
                var textureBump = RES.getRes("threejs/textures/brick_bump.jpg");
                var textureRoughness = RES.getRes("threejs/textures/brick_roughness.jpg");
                var textureEnv = RES.getRes("threejs/textures/cube/pisa/pisa.image.json");
                textureDiffue.gltfTexture.extensions.paper.encoding = 2 /* sRGBEncoding */;
                textureDiffue.gltfTexture.extensions.paper.anisotropy = 4;
                textureBump.gltfTexture.extensions.paper.anisotropy = 4;
                textureRoughness.gltfTexture.extensions.paper.anisotropy = 4;
                var gameObject = egret3d.creater.createGameObject("Torus Knot", {
                    mesh: torusKnotMesh,
                    material: egret3d.Material.create(egret3d.DefaultShaders.MESH_STANDARD)
                        .setFloat("bumpScale" /* BumpScale */, -0.05)
                        .setFloat("metalness" /* Metalness */, 0.9)
                        .setFloat("roughness" /* Roughness */, 0.8)
                        .setColor(egret3d.Color.WHITE)
                        .setTexture(textureDiffue)
                        .setTexture("bumpMap" /* BumpMap */, textureBump)
                        .setTexture("roughnessMap" /* RoughnessMap */, textureRoughness)
                        .setTexture("envMap" /* EnvMap */, textureEnv)
                        .setUVTransform(egret3d.Matrix3.create().fromUVTransform(0.0, 0.0, 9.0, 0.5, 0.0, 0.0, 0.0).release())
                        .addDefine("PREMULTIPLIED_ALPHA" /* PREMULTIPLIED_ALPHA */),
                    castShadows: true,
                    receiveShadows: true,
                });
                gameObject.addComponent(behaviors.Rotater).speed.set(0.0, -0.01, 0.0);
            }
            {
                var gameObject = egret3d.creater.createGameObject("Background", {
                    mesh: egret3d.DefaultMeshes.CUBE,
                    material: egret3d.Material.create(egret3d.DefaultShaders.MESH_STANDARD)
                        .setFloat("metalness" /* Metalness */, 0.0)
                        .setFloat("roughness" /* Roughness */, 1.0)
                        .setColor(0x888888)
                        .setCullFace(true, 2305 /* CCW */, 1028 /* Front */),
                    receiveShadows: true,
                });
                gameObject.transform.setLocalPosition(0.0, 50.0, 0.0).setLocalScale(200.0);
            }
            //
            var modelComponent = paper.GameObject.globalGameObject.getComponent(paper.editor.ModelComponent);
            if (modelComponent) {
                modelComponent.select(paper.GameObject.globalGameObject);
                paper.GameObject.globalGameObject.getComponent(paper.editor.GUIComponent).openComponents(egret3d.RenderState);
            }
        };
        return Start;
    }(paper.Behaviour));
    __reflect(Start.prototype, "Start");
})(examples || (examples = {}));
