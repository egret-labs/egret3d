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
        var XRay = (function () {
            function XRay() {
            }
            XRay.prototype.start = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // Load resource config.
                            return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/")];
                            case 1:
                                // Load resource config.
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("Assets/C_xiaohuangren_D_01_ANIM.prefab.json")];
                            case 2:
                                _a.sent();
                                paper.GameObject.globalGameObject.addComponent(Starter);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return XRay;
        }());
        shaders.XRay = XRay;
        __reflect(XRay.prototype, "examples.shaders.XRay", ["examples.Example"]);
        var Starter = (function (_super) {
            __extends(Starter, _super);
            function Starter() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Starter.prototype.onAwake = function () {
                // Create shader.
                var shader = egret3d.Shader.create("custom/xray.shader.json", egret3d.DefaultShaders.MESH_PHONG)
                    .addDefine("CUSTOM_XRAY", {
                    custom_vertex: "\n                            uniform float _c;\n                            uniform float _p;\n                            varying float _intensity;\n                        ",
                    custom_end_vertex: "\n                            vec3 _normal = normalize( normalMatrix * (cameraPosition - modelMatrix[2].xyz) );\n                            _intensity = pow( _c - dot(transformedNormal, _normal), _p );\n                        ",
                    custom_fragment: "\n                            varying float _intensity;\n                        ",
                    custom_end_fragment: "\n                            gl_FragColor *= _intensity;\n                        ",
                })
                    .addUniform("_c", 5126 /* FLOAT */, 1.3)
                    .addUniform("_p", 5126 /* FLOAT */, 3.0);
                {
                    var gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CYLINDER, "Cylinder");
                    gameObject.transform.setLocalPosition(2.0, 0.5, 0.0);
                    // 
                    var renderer = gameObject.renderer;
                    renderer.material = egret3d.Material.create(shader)
                        .setBlend(4 /* Additive */, 3000 /* Blend */)
                        .setColor(egret3d.Color.INDIGO);
                    renderer.gameObject.addComponent(XRayEditor);
                    //
                    var modelComponent = paper.GameObject.globalGameObject.getComponent(paper.editor.ModelComponent);
                    if (modelComponent) {
                        modelComponent.select(renderer.gameObject);
                        paper.GameObject.globalGameObject.getComponent(paper.editor.GUIComponent).openComponents(XRayEditor);
                    }
                }
                {
                    var gameObject = paper.Prefab.create("Assets/C_xiaohuangren_D_01_ANIM.prefab.json");
                    gameObject.getComponentInChildren(egret3d.Animation).play("run01");
                    gameObject.transform.setLocalPosition(-2.0, 0.0, 0.0);
                    //
                    var renderer = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer);
                    renderer.material = egret3d.Material.create(shader)
                        .setBlend(4 /* Additive */, 3000 /* Blend */)
                        .setColor(egret3d.Color.INDIGO);
                    renderer.gameObject.addComponent(XRayEditor);
                }
                //
                egret3d.Camera.main.gameObject.addComponent(behaviors.RotateAround);
                //
                examples.createGridRoom();
            };
            return Starter;
        }(paper.Behaviour));
        __reflect(Starter.prototype, "Starter");
        var XRayEditor = (function (_super) {
            __extends(XRayEditor, _super);
            function XRayEditor() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.p = 3.0;
                _this.c = 1.0;
                _this.glowColor = egret3d.Color.INDIGO.clone();
                return _this;
            }
            XRayEditor.prototype.onUpdate = function () {
                if (this.gameObject.renderer && this.gameObject.renderer.material) {
                    this.gameObject.renderer.material
                        .setFloat("_p", this.p)
                        .setFloat("_c", this.c)
                        .setColor(this.glowColor);
                }
            };
            __decorate([
                paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0.0, maximum: 4.0 })
            ], XRayEditor.prototype, "p", void 0);
            __decorate([
                paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0.0, maximum: 2.0 })
            ], XRayEditor.prototype, "c", void 0);
            __decorate([
                paper.editor.property("COLOR" /* COLOR */)
            ], XRayEditor.prototype, "glowColor", void 0);
            return XRayEditor;
        }(paper.Behaviour));
        __reflect(XRayEditor.prototype, "XRayEditor");
    })(shaders = examples.shaders || (examples.shaders = {}));
})(examples || (examples = {}));
