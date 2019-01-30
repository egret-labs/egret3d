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
    var RaycastTest = (function () {
        function RaycastTest() {
        }
        RaycastTest.prototype.start = function () {
            return __awaiter(this, void 0, void 0, function () {
                var gameObject, light, gameObject, line, rendererRaycast, gameObject, line, rendererRaycast, gameObject, line, rendererRaycast, gameObject, boxCollider, boxCollider, sphereCollider, cylinderCollider, line;
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
                            {
                                gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.TRIANGLE, "TriangleMesh");
                                gameObject.transform.setLocalPosition(0.0, 3.0, 0.0);
                                gameObject.renderer.material = egret3d.DefaultMaterials.MESH_LAMBERT;
                                line = paper.GameObject.create("MeshRendererRaycast");
                                line.transform.setLocalPosition(0.0, 3.0, -2.0);
                                line.addComponent(behaviors.RotateAround).target = gameObject;
                                rendererRaycast = line.addComponent(behaviors.RendererRaycast);
                                rendererRaycast.raycastMesh = true;
                                rendererRaycast.target = gameObject;
                                //
                                rendererRaycast.target.addComponent(MeshTriangleFollower).rendererRaycaster = rendererRaycast;
                            }
                            {
                                gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CYLINDER, "CylinderMesh");
                                gameObject.transform.setLocalPosition(0.0, 0.0, 0.0);
                                gameObject.renderer.material = egret3d.DefaultMaterials.MESH_LAMBERT;
                                line = paper.GameObject.create("MeshRendererRaycast");
                                line.transform.setLocalPosition(0.0, 0.0, -2.0);
                                line.addComponent(behaviors.RotateAround).target = gameObject;
                                rendererRaycast = line.addComponent(behaviors.RendererRaycast);
                                rendererRaycast.raycastMesh = true;
                                rendererRaycast.target = gameObject;
                            }
                            // Load prefab resource.
                            return [4 /*yield*/, RES.getResAsync("Assets/C_xiaohuangren_D_01_ANIM.prefab.json")];
                        case 2:
                            // Load prefab resource.
                            _a.sent();
                            gameObject = paper.Prefab.create("Assets/C_xiaohuangren_D_01_ANIM.prefab.json");
                            gameObject.transform.setLocalPosition(-3.0, 0.0, 0.0);
                            gameObject.getComponentInChildren(egret3d.Animation).play("run01");
                            line = paper.GameObject.create("SkinnedMeshRendererRaycast");
                            line.transform.setLocalPosition(-3.0, 0.5, -2.0);
                            rendererRaycast = line.addComponent(behaviors.RendererRaycast);
                            rendererRaycast.raycastMesh = true;
                            rendererRaycast.target = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer).gameObject;
                            //
                            rendererRaycast.target.addComponent(MeshTriangleFollower).rendererRaycaster = rendererRaycast;
                            {
                                gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PYRAMID, "Collider");
                                gameObject.transform.setLocalPosition(3.0, 0.0, 0.0);
                                gameObject.renderer.material = egret3d.DefaultMaterials.MESH_LAMBERT;
                                {
                                    boxCollider = gameObject.addComponent(egret3d.BoxCollider);
                                    boxCollider.box.size = egret3d.Vector3.create(2.0, 2.0, 2.0).release();
                                    boxCollider.box.center = egret3d.Vector3.create(0.0, 0.0, 2.0).release();
                                }
                                {
                                    boxCollider = gameObject.addComponent(egret3d.BoxCollider);
                                    boxCollider.box.size = egret3d.Vector3.create(2.0, 2.0, 2.0).release();
                                    boxCollider.box.center = egret3d.Vector3.create(0.0, 0.0, -2.0).release();
                                }
                                {
                                    sphereCollider = gameObject.addComponent(egret3d.SphereCollider);
                                    sphereCollider.sphere.radius = 1.0;
                                    sphereCollider.sphere.center.set(1.0, 0.0, 0.0);
                                }
                                {
                                    cylinderCollider = gameObject.addComponent(egret3d.CylinderCollider);
                                    cylinderCollider.topRadius = 1.0;
                                    cylinderCollider.bottomRadius = 1.0;
                                    cylinderCollider.center.set(-1.0, 0.0, 0.0);
                                }
                                line = paper.GameObject.create("ColliderRaycast");
                                line.transform.setLocalPosition(3.0, 2.0, -2.0);
                                line.addComponent(behaviors.RotateAround).target = gameObject;
                                line.addComponent(behaviors.ColliderRaycast).target = gameObject;
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        return RaycastTest;
    }());
    examples.RaycastTest = RaycastTest;
    __reflect(RaycastTest.prototype, "examples.RaycastTest");
    var MeshTriangleFollower = (function (_super) {
        __extends(MeshTriangleFollower, _super);
        function MeshTriangleFollower() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.rendererRaycaster = null;
            _this._normal = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "SkinnedMeshTriangleFollower");
            return _this;
        }
        MeshTriangleFollower.prototype.onLateUpdate = function () {
            if (!this.rendererRaycaster) {
                this._normal.activeSelf = false;
                return;
            }
            var triangleIndex = this.rendererRaycaster.raycastInfo.triangleIndex;
            if (triangleIndex < 0) {
                this._normal.activeSelf = false;
                return;
            }
            var raycastInfo = this.rendererRaycaster.raycastInfo;
            var meshRender = this.rendererRaycaster.target.renderer;
            var coord = raycastInfo.coord;
            var triangle = meshRender.getTriangle(triangleIndex).release();
            this._normal.transform.position = triangle.getPointAt(coord.x, coord.y).release();
            this._normal.transform.lookRotation(triangle.getNormal().release());
            this._normal.activeSelf = true;
        };
        return MeshTriangleFollower;
    }(paper.Behaviour));
    __reflect(MeshTriangleFollower.prototype, "MeshTriangleFollower");
})(examples || (examples = {}));
