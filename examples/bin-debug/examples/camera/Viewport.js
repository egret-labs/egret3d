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
    var camera;
    (function (camera) {
        var Viewport = (function () {
            function Viewport() {
            }
            Viewport.prototype.start = function () {
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
                                paper.GameObject.globalGameObject.addComponent(Update);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return Viewport;
        }());
        camera.Viewport = Viewport;
        __reflect(Viewport.prototype, "examples.camera.Viewport", ["examples.Example"]);
        var Update = (function (_super) {
            __extends(Update, _super);
            function Update() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._mainCamera = egret3d.Camera.main;
                _this._subCamera = paper.GameObject.create("Sub Camera").addComponent(egret3d.Camera);
                _this._gameObjectA = null;
                _this._gameObjectB = null;
                _this._gameObjectC = null;
                return _this;
            }
            Update.prototype.onAwake = function () {
                var mainCamera = this._mainCamera;
                var subCamera = this._subCamera;
                {
                    subCamera.order = 1;
                    subCamera.fov = 50.0 * 0.017453292519943295 /* DEG_RAD */;
                    subCamera.far = 1000.0;
                    subCamera.near = 150.0;
                    subCamera.bufferMask = 256 /* Depth */;
                    subCamera.viewport.set(0.0, 0.0, 0.5, 1.0).update();
                    subCamera.transform.setLocalPosition(0.0, 0.0, 0.0);
                    //
                    var modelComponent = paper.GameObject.globalGameObject.getComponent(paper.editor.ModelComponent);
                    if (modelComponent) {
                        modelComponent.select(subCamera.gameObject);
                        paper.GameObject.globalGameObject.getComponent(paper.editor.GUIComponent).openComponents(egret3d.Camera);
                    }
                }
                {
                    mainCamera.fov = 50.0 * 0.017453292519943295 /* DEG_RAD */;
                    mainCamera.far = 10000.0;
                    mainCamera.near = 1500.0;
                    mainCamera.backgroundColor.set(0.0, 0.0, 0.0);
                    mainCamera.viewport.set(0.5, 0.0, 0.5, 1.0).update();
                    mainCamera.transform.setLocalPosition(0.0, 0.0, -2500.0).lookAt(this._subCamera.transform);
                }
                {
                    var mesh = egret3d.Mesh.create(10000, 0, ["POSITION" /* POSITION */]);
                    mesh.glTFMesh.primitives[0].mode = 0 /* Points */;
                    //
                    var vertices = mesh.getVertices();
                    for (var i = 0, l = vertices.length; i < l; i += 3) {
                        vertices[i] = egret3d.math.randFloatSpread(2000.0);
                        vertices[i + 1] = egret3d.math.randFloatSpread(2000.0);
                        vertices[i + 2] = egret3d.math.randFloatSpread(2000.0);
                    }
                    //
                    var gameObject = egret3d.DefaultMeshes.createObject(mesh, "Stars");
                    gameObject.renderer.material = egret3d.Material.create(egret3d.DefaultShaders.POINTS)
                        .setColor(0x888888);
                }
                {
                    var meshA = egret3d.MeshBuilder.createSphere(100.0, 0.0, 0.0, 0.0, 16, 8).addWireframeSubMesh(1);
                    var meshB = egret3d.MeshBuilder.createSphere(50.0, 0.0, 0.0, 0.0, 16, 8).addWireframeSubMesh(1);
                    var meshC = egret3d.MeshBuilder.createSphere(5.0, 0.0, 0.0, 0.0, 16, 8).addWireframeSubMesh(1);
                    var gameObjectA = this._gameObjectA = egret3d.DefaultMeshes.createObject(meshA, "Object A");
                    var gameObjectB = this._gameObjectB = egret3d.DefaultMeshes.createObject(meshB, "Object B");
                    var gameObjectC = this._gameObjectC = egret3d.DefaultMeshes.createObject(meshC, "Object C");
                    gameObjectA.renderer.materials = [null, egret3d.DefaultMaterials.MESH_BASIC.clone().setColor(egret3d.Color.WHITE)];
                    gameObjectB.renderer.materials = [null, egret3d.DefaultMaterials.MESH_BASIC.clone().setColor(egret3d.Color.GREEN)];
                    gameObjectC.renderer.materials = [null, egret3d.DefaultMaterials.MESH_BASIC.clone().setColor(egret3d.Color.BLUE)];
                    gameObjectB.transform.setParent(gameObjectA.transform);
                    gameObjectC.transform.setParent(subCamera.transform).setLocalPosition(0.0, 0.0, 150.0);
                }
            };
            Update.prototype.onUpdate = function () {
                var mainCamera = this._mainCamera;
                var subCamera = this._subCamera;
                var gameObjectA = this._gameObjectA;
                var gameObjectB = this._gameObjectB;
                var gameObjectC = this._gameObjectC;
                var r = paper.clock.time * 0.5;
                var lA = 700.0;
                var lB = 70.0;
                gameObjectA.transform.setLocalPosition(lA * Math.cos(r), lA * Math.sin(r), lA * Math.sin(r));
                gameObjectB.transform.setLocalPosition(lB * Math.cos(2.0 * r), 150.0, lB * Math.sin(r));
                subCamera.opvalue = (Math.sin(r * 0.25) + 1.0) * 0.5;
                subCamera.far = gameObjectA.transform.localPosition.length;
                subCamera.fov = (35.0 + 30.0 * Math.sin(0.5 * r)) * 0.017453292519943295 /* DEG_RAD */;
                subCamera.size = 300.0 + 100.0 * Math.sin(r);
                subCamera.transform.lookAt(gameObjectA.transform);
            };
            return Update;
        }(paper.Behaviour));
        __reflect(Update.prototype, "Update");
    })(camera = examples.camera || (examples.camera = {}));
})(examples || (examples = {}));
