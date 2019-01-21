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
    (function (camera_1) {
        var CameraTest = (function () {
            function CameraTest() {
            }
            CameraTest.prototype.start = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var gameObject, light;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // Load resource config.
                            return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/")];
                            case 1:
                                // Load resource config.
                                _a.sent();
                                // Create camera.
                                egret3d.Camera.main;
                                {
                                    gameObject = paper.GameObject.create("Light");
                                    gameObject.transform.setLocalPosition(1.0, 10.0, -1.0);
                                    gameObject.transform.lookAt(egret3d.Vector3.ZERO);
                                    light = gameObject.addComponent(egret3d.DirectionalLight);
                                    light.intensity = 0.5;
                                }
                                paper.GameObject.create("WorldToStageTest")
                                    .addComponent(egret3d.Egret2DRenderer).gameObject
                                    .addComponent(WorldToStageTest);
                                paper.GameObject.create("StageToWorldTest")
                                    .addComponent(StageToWorldTest);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return CameraTest;
        }());
        camera_1.CameraTest = CameraTest;
        __reflect(CameraTest.prototype, "examples.camera.CameraTest");
        var WorldToStageTest = (function (_super) {
            __extends(WorldToStageTest, _super);
            function WorldToStageTest() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._worldToStage = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.SPHERE, "WorldToStage");
                _this._stageToWorld = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.TORUS, "StageToWorld");
                _this._shapeA = new egret.Shape();
                _this._shapeB = new egret.Shape();
                return _this;
            }
            WorldToStageTest.prototype.onAwake = function () {
                this._worldToStage.renderer.material = egret3d.DefaultMaterials.MESH_LAMBERT;
                this._stageToWorld.renderer.material = egret3d.DefaultMaterials.MESH_LAMBERT;
                this._shapeA.graphics.lineStyle(2, 0x000000, 1);
                this._shapeA.graphics.drawCircle(0.0, 0.0, 50.0);
                this.gameObject.renderer.stage.addChild(this._shapeA);
                this.gameObject.renderer.stage.addChild(this._shapeB);
            };
            WorldToStageTest.prototype.onUpdate = function () {
                // WorldToStage.
                var position = egret3d.Camera.main.worldToStage(this._worldToStage.transform.position).release();
                this._shapeA.x = position.x;
                this._shapeA.y = position.y;
                // StageToWorld.
                position.z = 10.0;
                egret3d.Camera.main.stageToWorld(position, position);
                this._stageToWorld.transform.position = position;
                this._shapeB.graphics.clear();
                this._shapeB.graphics.lineStyle(2, 0x000000, 1);
                this._shapeB.graphics.drawRect(10.0, 10.0, egret3d.stage.viewport.w - 20.0, egret3d.stage.viewport.h - 20.0);
            };
            return WorldToStageTest;
        }(paper.Behaviour));
        __reflect(WorldToStageTest.prototype, "WorldToStageTest");
        var StageToWorldTest = (function (_super) {
            __extends(StageToWorldTest, _super);
            function StageToWorldTest() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.stagePosition = egret3d.Vector3.create();
                return _this;
            }
            StageToWorldTest.prototype.onAwake = function () {
                for (var i = 0, l = 100; i < l; ++i) {
                    var line = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Y, "Line_" + i);
                    line.transform.parent = this.gameObject.transform;
                }
            };
            StageToWorldTest.prototype.onUpdate = function () {
                var backupZ = this.stagePosition.z;
                var camera = egret3d.Camera.main;
                for (var i = 0, l = 100; i < l; ++i) {
                    var line = this.gameObject.transform.find("Line_" + i);
                    if (!line) {
                        continue;
                    }
                    this.stagePosition.z = camera.near + camera.far * i / l + backupZ;
                    // camera.stageToWorld(this.stagePosition, line.transform.position).update();
                    var position = line.transform.position;
                    camera.stageToWorld(this.stagePosition, position);
                    position.update();
                    line.transform.rotation = camera.transform.rotation;
                }
                this.stagePosition.z = backupZ;
            };
            __decorate([
                paper.editor.property("VECTOR3" /* VECTOR3 */)
            ], StageToWorldTest.prototype, "stagePosition", void 0);
            return StageToWorldTest;
        }(paper.Behaviour));
        __reflect(StageToWorldTest.prototype, "StageToWorldTest");
    })(camera = examples.camera || (examples.camera = {}));
})(examples || (examples = {}));
