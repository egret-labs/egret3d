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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
    var shaders;
    (function (shaders) {
        var Decal = (function () {
            function Decal() {
            }
            Decal.prototype.start = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var shader, texture, gameObject, animation, renderer, line, rendererRaycast, materials_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // Load resource config.
                            return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/sniper/")];
                            case 1:
                                // Load resource config.
                                _a.sent();
                                // Create camera.
                                egret3d.Camera.main;
                                shader = egret3d.Shader.create("custom/decal.shader.json", egret3d.DefaultShaders.MESH_BASIC);
                                shader
                                    .addDefine("CUSTOM_DECAL", {
                                    custom_vertex: "\n                            uniform float radius;\n                            uniform vec3 center;\n                            uniform vec3 up;\n                            uniform vec3 forward;\n                        ",
                                    custom_end_vertex: "\n                            float k = 2.0 * radius;\n                            vec3 right = cross(up, forward);\n                            vec3 uVector = right / k;\n                            vec3 vVector = cross(forward, right) / -k;\n                            vUv.x = dot(position - center, uVector) + 0.5; \n                            vUv.y = dot(position - center, vVector) + 0.5;\n                        ",
                                })
                                    .addUniform("radius", 5126 /* FLOAT */, 0.5)
                                    .addUniform("center", 35665 /* FLOAT_VEC3 */, [0.0, 0.0, 0.0])
                                    .addUniform("up", 35665 /* FLOAT_VEC3 */, [0.0, 1.0, 0.0])
                                    .addUniform("forward", 35665 /* FLOAT_VEC3 */, [0.0, 0.0, 1.0]);
                                return [4 /*yield*/, RES.getResAsync("Assets/Prefab/Actor/female1.prefab.json")];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("textures/sprite0.png")];
                            case 3:
                                texture = _a.sent();
                                texture.sampler.wrapS = 33071 /* ClampToEdge */;
                                texture.sampler.wrapT = 33071 /* ClampToEdge */;
                                gameObject = paper.Prefab.create("Assets/Prefab/Actor/female1.prefab.json");
                                gameObject.transform.setLocalPosition(0.0, 0.0, 0.0);
                                animation = gameObject.getComponentInChildren(egret3d.Animation);
                                animation.play("idle");
                                renderer = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer);
                                line = paper.GameObject.create("SkinnedMeshRendererRaycast");
                                line.transform.setLocalPosition(0.0, 0.0, -2.0);
                                rendererRaycast = line.addComponent(behaviors.RendererRaycast);
                                rendererRaycast.raycastMesh = true;
                                rendererRaycast.target = renderer.gameObject;
                                materials_1 = renderer.materials;
                                // materials[0] = egret3d.Material.create().setTexture(await RES.getResAsync("logo.png"));
                                materials_1[1] = egret3d.Material.create(shader).setTexture(texture).setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent, 0.5);
                                renderer.materials = materials_1;
                                gameObject.addComponent(TestDecal, materials_1[1]).rendererRaycast = rendererRaycast;
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return Decal;
        }());
        shaders.Decal = Decal;
        __reflect(Decal.prototype, "examples.shaders.Decal", ["examples.Example"]);
        var TestDecal = (function (_super) {
            __extends(TestDecal, _super);
            function TestDecal() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.radius = 0.1;
                _this.center = egret3d.Vector3.create();
                _this.rendererRaycast = null;
                _this._material = null;
                return _this;
            }
            TestDecal.prototype.onAwake = function (config) {
                this._material = config;
            };
            TestDecal.prototype.onUpdate = function () {
                var material = this._material;
                var rendererRaycast = this.rendererRaycast;
                if (!material || !rendererRaycast) {
                    return;
                }
                var raycastInfo = rendererRaycast.raycastInfo;
                if (raycastInfo.transform) {
                    //
                    var skinnedMeshRenderer = rendererRaycast.target.renderer;
                    var mesh = skinnedMeshRenderer.mesh;
                    var triangle = mesh.getTriangle(raycastInfo.triangleIndex).release();
                    var center = triangle.getPointAt(raycastInfo.coord.x, raycastInfo.coord.y).release();
                    //
                    var forwardNormal = triangle.getNormal().negate().release();
                    //
                    var toMatrix = skinnedMeshRenderer.gameObject.transform.worldToLocalMatrix;
                    var up = egret3d.Vector3.UP.clone().applyDirection(toMatrix).release();
                    var forwardRay = rendererRaycast.ray.direction.clone().applyDirection(toMatrix).release();
                    //
                    material.setFloat("radius", this.radius);
                    material.setVector3("center", center);
                    material.setVector3("up", up);
                    material.setVector3("forward", forwardNormal.lerp(forwardRay, 0.5));
                }
            };
            __decorate([
                paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0.0, maximum: 2.0, step: 0.01 })
            ], TestDecal.prototype, "radius", void 0);
            __decorate([
                paper.editor.property("VECTOR3" /* VECTOR3 */)
            ], TestDecal.prototype, "center", void 0);
            return TestDecal;
        }(paper.Behaviour));
        __reflect(TestDecal.prototype, "TestDecal");
    })(shaders = examples.shaders || (examples.shaders = {}));
})(examples || (examples = {}));
