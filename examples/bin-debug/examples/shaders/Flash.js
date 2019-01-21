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
        var Flash = (function () {
            function Flash() {
            }
            Flash.prototype.start = function () {
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
                                return [4 /*yield*/, RES.getResAsync("logo.png")];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("textures/test.png")];
                            case 4:
                                _a.sent();
                                paper.GameObject.globalGameObject.addComponent(Start);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return Flash;
        }());
        shaders.Flash = Flash;
        __reflect(Flash.prototype, "examples.shaders.Flash", ["examples.Example"]);
        var Start = (function (_super) {
            __extends(Start, _super);
            function Start() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Start.prototype.onAwake = function () {
                // Create shader.
                var shader = egret3d.Shader.create("custom/flash.shader.json", egret3d.DefaultShaders.MESH_PHONG)
                    .addDefine("CUSTOM_FLASH", {
                    custom_vertex: "\n                            uniform vec4 clock;\n                            uniform vec2 _speed;\n                            uniform vec2 _scale;\n                        ",
                    custom_end_vertex: "\n                            // vUv =  position.xy * _scale.xy + _speed.xy * clock.x; // Local space.\n                            vUv =  transformed.xy * _scale.xy + _speed.xy * clock.x; // World space.\n                        ",
                })
                    .addUniform("_speed", 35664 /* FLOAT_VEC2 */, [1.0, 0.0])
                    .addUniform("_scale", 35664 /* FLOAT_VEC2 */, [1.0, 1.0]);
                var texture = RES.getRes("textures/test.png");
                {
                    var gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "Cube");
                    gameObject.transform.setLocalPosition(2.0, 0.5, 0.0);
                    // 
                    var renderer = gameObject.renderer;
                    renderer.materials = [
                        egret3d.Material
                            .create()
                            .setTexture(RES.getRes("logo.png")),
                        egret3d.Material.create(shader)
                            .setTexture(texture)
                            .setBlend(4 /* Additive */, 3000 /* Blend */, 1.0)
                            .setColor(egret3d.Color.INDIGO)
                    ];
                    renderer.gameObject.addComponent(FlashEditor);
                    //
                    var modelComponent = paper.GameObject.globalGameObject.getComponent(paper.editor.ModelComponent);
                    if (modelComponent) {
                        modelComponent.select(renderer.gameObject);
                        paper.GameObject.globalGameObject.getComponent(paper.editor.GUIComponent).openComponents(FlashEditor);
                    }
                }
                {
                    var gameObject = paper.Prefab.create("Assets/C_xiaohuangren_D_01_ANIM.prefab.json");
                    gameObject.transform.setLocalPosition(-2.0, 0.0, 0.0);
                    //
                    var renderer = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer);
                    var materials_1 = renderer.materials.concat();
                    var material = egret3d.Material.create(shader)
                        .setTexture(texture)
                        .setBlend(4 /* Additive */, 3000 /* Blend */, 1.0)
                        .setColor(egret3d.Color.PURPLE);
                    materials_1.push(material);
                    renderer.materials = materials_1;
                    renderer.gameObject.addComponent(FlashEditor);
                }
                //
                egret3d.Camera.main.gameObject.addComponent(behaviors.RotateAround);
                //
                examples.createGridRoom();
            };
            return Start;
        }(paper.Behaviour));
        __reflect(Start.prototype, "Start");
        var FlashEditor = (function (_super) {
            __extends(FlashEditor, _super);
            function FlashEditor() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.speed = egret3d.Vector2.create(1.0, 0.0);
                _this.scale = egret3d.Vector2.create(1.0, 1.0);
                _this.color = egret3d.Color.create().fromHex(0xFFFFFF);
                return _this;
            }
            FlashEditor.prototype.onUpdate = function () {
                if (this.gameObject.renderer && this.gameObject.renderer.materials[1]) {
                    this.gameObject.renderer.materials[1]
                        .setVector2("_speed", this.speed)
                        .setVector2("_scale", this.scale)
                        .setColor(this.color);
                }
            };
            __decorate([
                paper.editor.property("VECTOR2" /* VECTOR2 */)
            ], FlashEditor.prototype, "speed", void 0);
            __decorate([
                paper.editor.property("VECTOR2" /* VECTOR2 */)
            ], FlashEditor.prototype, "scale", void 0);
            __decorate([
                paper.editor.property("COLOR" /* COLOR */)
            ], FlashEditor.prototype, "color", void 0);
            return FlashEditor;
        }(paper.Behaviour));
        __reflect(FlashEditor.prototype, "FlashEditor");
    })(shaders = examples.shaders || (examples.shaders = {}));
})(examples || (examples = {}));
