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
        var Blending = (function () {
            function Blending() {
            }
            Blending.prototype.start = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var textures, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: 
                            // Load resource config.
                            return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/")];
                            case 1:
                                // Load resource config.
                                _b.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/UV_Grid_Sm.jpg")];
                            case 2:
                                _a = [
                                    _b.sent()
                                ];
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/sprite0.jpg")];
                            case 3:
                                _a = _a.concat([
                                    _b.sent()
                                ]);
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/sprite0.png")];
                            case 4:
                                _a = _a.concat([
                                    _b.sent()
                                ]);
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/lensflare/lensflare0.png")];
                            case 5:
                                _a = _a.concat([
                                    _b.sent()
                                ]);
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/lensflare/lensflare0_alpha.png")];
                            case 6:
                                textures = _a.concat([
                                    _b.sent()
                                ]);
                                paper.GameObject.globalGameObject.addComponent(Start, textures);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return Blending;
        }());
        materials.Blending = Blending;
        __reflect(Blending.prototype, "examples.materials.Blending");
        var Start = (function (_super) {
            __extends(Start, _super);
            function Start() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Start.prototype.onAwake = function (textures) {
                egret3d.Camera.main.gameObject.transform
                    .setLocalPosition(0.0, 0.0, -10.0)
                    .lookAt(egret3d.Vector3.ZERO);
                // 
                var blends = [0 /* None */, 2 /* Normal */, 4 /* Additive */, 8 /* Subtractive */, 16 /* Multiply */];
                var blendNames = ["None", "Normal", "Additive", "Subtractive", "Multiply"];
                for (var i = 0; i < textures.length; i++) {
                    for (var j = 0; j < blends.length; j++) {
                        var texture = textures[i];
                        var gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.QUAD, texture.name.split("/").pop() + " " + blendNames[j]);
                        var renderer = gameObject.getComponent(egret3d.MeshRenderer);
                        renderer.material = egret3d.Material.create()
                            .setTexture(texture)
                            .setBlend(blends[j], 3000 /* Blend */);
                        gameObject.transform.setLocalPosition((j - blends.length * 0.5 + 0.5) * 1.1, -(i - textures.length * 0.5 + 0.5) * 1.1, 0.0);
                    }
                }
                {
                    var gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Background");
                    var renderer = gameObject.getComponent(egret3d.MeshRenderer);
                    renderer.material = egret3d.Material.create().setTexture(egret3d.DefaultTextures.GRID);
                    gameObject.transform.setLocalPosition(0.0, 0.0, 1.0).setLocalScale(2.0);
                    gameObject.addComponent(UVUpdater);
                }
            };
            return Start;
        }(paper.Behaviour));
        __reflect(Start.prototype, "Start");
        var UVUpdater = (function (_super) {
            __extends(UVUpdater, _super);
            function UVUpdater() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._offset = egret3d.Vector2.create();
                _this._repeat = egret3d.Vector2.create(50.0, 50.0);
                _this._uvTransformMatrix = egret3d.Matrix3.create();
                return _this;
            }
            UVUpdater.prototype.onUpdate = function () {
                var time = paper.clock.time;
                var material = this.gameObject.renderer.material;
                this._offset.x = (time) % 1;
                this._offset.y = (time) % 1;
                this._uvTransformMatrix.fromUVTransform(this._offset.x, this._offset.y, this._repeat.x, this._repeat.y, 0.0, 0.0, 0.0);
                material.setUVTransform(this._uvTransformMatrix);
            };
            return UVUpdater;
        }(paper.Behaviour));
        __reflect(UVUpdater.prototype, "UVUpdater");
    })(materials = examples.materials || (examples.materials = {}));
})(examples || (examples = {}));
