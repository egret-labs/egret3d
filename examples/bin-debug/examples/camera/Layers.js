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
    var camera;
    (function (camera) {
        var Layers = (function () {
            function Layers() {
            }
            Layers.prototype.start = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // Load resource config.
                            return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/")];
                            case 1:
                                // Load resource config.
                                _a.sent();
                                egret3d.Camera.main.gameObject.addComponent(Starter);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return Layers;
        }());
        camera.Layers = Layers;
        __reflect(Layers.prototype, "examples.camera.Layers", ["examples.Example"]);
        var Starter = (function (_super) {
            __extends(Starter, _super);
            function Starter() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._red = true;
                _this._green = true;
                _this._blue = true;
                _this._mainCamera = egret3d.Camera.main;
                return _this;
            }
            Object.defineProperty(Starter.prototype, "red", {
                get: function () {
                    return this._red;
                },
                set: function (value) {
                    this._red = value;
                    if (value) {
                        this._mainCamera.cullingMask |= 1024 /* UserLayer10 */;
                    }
                    else {
                        this._mainCamera.cullingMask &= ~1024 /* UserLayer10 */;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Starter.prototype, "green", {
                get: function () {
                    return this._green;
                },
                set: function (value) {
                    this._green = value;
                    if (value) {
                        this._mainCamera.cullingMask |= 2048 /* UserLayer11 */;
                    }
                    else {
                        this._mainCamera.cullingMask &= ~2048 /* UserLayer11 */;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Starter.prototype, "blue", {
                get: function () {
                    return this._blue;
                },
                set: function (value) {
                    this._blue = value;
                    if (value) {
                        this._mainCamera.cullingMask |= 4096 /* UserLayer12 */;
                    }
                    else {
                        this._mainCamera.cullingMask &= ~4096 /* UserLayer12 */;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Starter.prototype.onAwake = function () {
                var mainCamera = this._mainCamera;
                {
                    mainCamera.cullingMask = 1024 /* UserLayer10 */ | 2048 /* UserLayer11 */ | 4096 /* UserLayer12 */;
                    mainCamera.fov = 70.0 * 0.017453292519943295 /* DEG_RAD */;
                    mainCamera.far = 10000.0;
                    mainCamera.near = 1.0;
                    mainCamera.backgroundColor.fromHex(0xFFFFFF);
                    mainCamera.gameObject.addComponent(behaviors.RotateAround);
                    //
                    var modelComponent = paper.GameObject.globalGameObject.getComponent(paper.editor.ModelComponent);
                    if (modelComponent) {
                        modelComponent.select(mainCamera.gameObject);
                        paper.GameObject.globalGameObject.getComponent(paper.editor.GUIComponent).openComponents(Starter);
                    }
                }
                {
                    var pointLight = paper.GameObject.create("Point Light").addComponent(egret3d.PointLight);
                    pointLight.distance = 10000.0;
                    pointLight.color.fromHex(0xFFFFFF);
                    pointLight.transform.setParent(mainCamera.transform);
                }
                {
                    var colors = [0xff0000, 0x00ff00, 0x0000ff];
                    var layers = [1024 /* UserLayer10 */, 2048 /* UserLayer11 */, 4096 /* UserLayer12 */];
                    for (var i = 0; i < 300; ++i) {
                        var layer = (i % 3);
                        var gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "Cube " + i);
                        gameObject.layer = layers[layer];
                        gameObject.renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT).setColor(colors[layer]);
                        gameObject.transform
                            .setLocalPosition(Math.random() * 800.0 - 400.0, Math.random() * 800.0 - 400.0, Math.random() * 800.0 - 400.0)
                            .setLocalEuler(Math.random() * 2.0 * Math.PI, Math.random() * 2.0 * Math.PI, Math.random() * 2.0 * Math.PI)
                            .setLocalScale((Math.random() + 0.5) * 20.0, (Math.random() + 0.5) * 20.0, (Math.random() + 0.5) * 20.0);
                    }
                }
            };
            Starter.prototype.onEnable = function () {
                this.red = true;
                this.green = true;
                this.blue = true;
            };
            Starter.prototype.onDisable = function () {
                this.red = false;
                this.green = false;
                this.blue = false;
            };
            __decorate([
                paper.editor.property("CHECKBOX" /* CHECKBOX */)
            ], Starter.prototype, "red", null);
            __decorate([
                paper.editor.property("CHECKBOX" /* CHECKBOX */)
            ], Starter.prototype, "green", null);
            __decorate([
                paper.editor.property("CHECKBOX" /* CHECKBOX */)
            ], Starter.prototype, "blue", null);
            return Starter;
        }(paper.Behaviour));
        __reflect(Starter.prototype, "Starter");
    })(camera = examples.camera || (examples.camera = {}));
})(examples || (examples = {}));
