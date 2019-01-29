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
    var postprocessing;
    (function (postprocessing) {
        var NightVisionTest = (function () {
            function NightVisionTest() {
            }
            NightVisionTest.prototype.start = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var camera, modelComponent;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // Load resource config.
                            return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/")];
                            case 1:
                                // Load resource config.
                                _a.sent();
                                // Load prefab resource.
                                return [4 /*yield*/, RES.getResAsync("Assets/Models/Mixamo/vanguard.prefab.json")];
                            case 2:
                                // Load prefab resource.
                                _a.sent();
                                // Load animation resource.
                                return [4 /*yield*/, RES.getResAsync("Assets/Animations/Mixamo/Looking_Around.ani.bin")];
                            case 3:
                                // Load animation resource.
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("Assets/Animations/Mixamo/Walking.ani.bin")];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("Assets/Animations/Mixamo/Running.ani.bin")];
                            case 5:
                                _a.sent();
                                // Load textures.
                                return [4 /*yield*/, RES.getResAsync("textures/HeatLookup.png")];
                            case 6:
                                // Load textures.
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("textures/HeatNoise.png")];
                            case 7:
                                _a.sent();
                                // Load shaders.
                                return [4 /*yield*/, RES.getResAsync("shaders/nightVision/nightVision.shader.json")];
                            case 8:
                                // Load shaders.
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("shaders/thermalVision/thermalVision.shader.json")];
                            case 9:
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("shaders/thermalVision2/thermalVision2.shader.json")];
                            case 10:
                                _a.sent();
                                camera = egret3d.Camera.main;
                                paper.GameObject.create("DirectionalLight").addComponent(egret3d.DirectionalLight);
                                this.createPrefab(egret3d.Vector3.ZERO, "Walking");
                                this.createPrefab(egret3d.Vector3.create(-2, 0, -1), "Running");
                                this.createPrefab(egret3d.Vector3.create(2, 0, 1), "Looking_Around");
                                // GUI.
                                camera.gameObject.addComponent(Starter);
                                modelComponent = paper.GameObject.globalGameObject.getComponent(paper.editor.ModelComponent);
                                if (modelComponent) {
                                    modelComponent.select(egret3d.Camera.main.gameObject);
                                    paper.GameObject.globalGameObject.
                                        getComponent(paper.editor.GUIComponent).
                                        openComponents(Starter, components.NightVisionPostProcess, components.ThermalVisionPostProcess, components.ThermalVisionPostProcess2);
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            NightVisionTest.prototype.createPrefab = function (pos, animationName) {
                var gameObject = paper.Prefab.create("Assets/Models/Mixamo/vanguard.prefab.json");
                var animation = gameObject.getOrAddComponent(egret3d.Animation);
                animation.animations = [
                    RES.getRes("Assets/Animations/Mixamo/Walking.ani.bin"),
                    RES.getRes("Assets/Animations/Mixamo/Running.ani.bin"),
                    RES.getRes("Assets/Animations/Mixamo/Looking_Around.ani.bin"),
                ];
                animation.fadeIn(animationName, 0.3, 0, 0);
                gameObject.transform.setLocalPosition(pos);
                gameObject.transform.setLocalEulerAngles(0, 180, 0);
            };
            return NightVisionTest;
        }());
        postprocessing.NightVisionTest = NightVisionTest;
        __reflect(NightVisionTest.prototype, "examples.postprocessing.NightVisionTest", ["examples.Example"]);
        var NightVisionType;
        (function (NightVisionType) {
            NightVisionType["NightVision"] = "NightVision";
            NightVisionType["ThermalVision"] = "ThermalVision";
            NightVisionType["ThermalVision2"] = "ThermalVision2";
        })(NightVisionType || (NightVisionType = {}));
        var Starter = (function (_super) {
            __extends(Starter, _super);
            function Starter() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._type = NightVisionType.NightVision;
                return _this;
            }
            Starter.prototype.onAwake = function () {
                this._changeNightVision();
            };
            Starter.prototype._changeNightVision = function () {
                var nightVision = this.gameObject.getOrAddComponent(components.NightVisionPostProcess);
                var thermalVision = this.gameObject.getOrAddComponent(components.ThermalVisionPostProcess);
                var thermalVision2 = this.gameObject.getOrAddComponent(components.ThermalVisionPostProcess2);
                switch (this._type) {
                    case NightVisionType.NightVision:
                        {
                            thermalVision.enabled = false;
                            thermalVision2.enabled = false;
                            nightVision.enabled = true;
                        }
                        break;
                    case NightVisionType.ThermalVision:
                        {
                            nightVision.enabled = false;
                            thermalVision2.enabled = false;
                            thermalVision.enabled = true;
                        }
                        break;
                    case NightVisionType.ThermalVision2:
                        {
                            nightVision.enabled = false;
                            thermalVision.enabled = false;
                            thermalVision2.enabled = true;
                        }
                        break;
                }
            };
            Object.defineProperty(Starter.prototype, "type", {
                get: function () {
                    return this._type;
                },
                set: function (value) {
                    if (this._type === value) {
                        return;
                    }
                    this._type = value;
                    this._changeNightVision();
                },
                enumerable: true,
                configurable: true
            });
            __decorate([
                paper.editor.property("LIST" /* LIST */, { listItems: NightVisionType })
            ], Starter.prototype, "type", null);
            return Starter;
        }(paper.Behaviour));
        __reflect(Starter.prototype, "Starter");
    })(postprocessing = examples.postprocessing || (examples.postprocessing = {}));
})(examples || (examples = {}));
