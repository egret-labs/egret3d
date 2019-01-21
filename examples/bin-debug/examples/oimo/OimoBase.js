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
    var oimo;
    (function (oimo) {
        var OimoBase = (function () {
            function OimoBase() {
            }
            OimoBase.prototype.start = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var gameObject, light, groundSize, gameObject, renderer, rigidbody, boxCollider, i, gameObject, cubeSize, renderer, rigidbody, boxCollider;
                    return __generator(this, function (_a) {
                        // Create camera.
                        egret3d.Camera.main;
                        {
                            gameObject = paper.GameObject.create("Light");
                            gameObject.transform.setLocalPosition(1.0, 10.0, -1.0);
                            gameObject.transform.lookAt(egret3d.Vector3.ZERO);
                            light = gameObject.addComponent(egret3d.DirectionalLight);
                            light.intensity = 0.5;
                            light.castShadows = true;
                            light.shadow.bias = -0.001;
                            light.shadow.size = 20.0;
                        }
                        {
                            groundSize = egret3d.Vector3.create(10.0, 0.1, 10.0);
                            gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "Ground");
                            gameObject.transform.setLocalScale(groundSize);
                            renderer = gameObject.getComponent(egret3d.MeshRenderer);
                            // renderer.castShadows = true;
                            renderer.receiveShadows = true;
                            renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT);
                            rigidbody = gameObject.addComponent(egret3d.oimo.Rigidbody);
                            boxCollider = gameObject.addComponent(egret3d.oimo.BoxCollider);
                            rigidbody.type = 1 /* STATIC */;
                            boxCollider.size = groundSize;
                            groundSize.release();
                        }
                        {
                            for (i = 0; i < 100; i++) {
                                gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "Cube_" + i);
                                gameObject.transform.setLocalPosition(Math.random() * 8.0 - 4.0, Math.random() * 8.0 + 4.0, Math.random() * 8.0 - 4.0);
                                cubeSize = egret3d.Vector3.create(Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5).release();
                                gameObject.transform.setLocalScale(cubeSize);
                                renderer = gameObject.getComponent(egret3d.MeshRenderer);
                                renderer.castShadows = true;
                                renderer.receiveShadows = true;
                                renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT);
                                rigidbody = gameObject.addComponent(egret3d.oimo.Rigidbody);
                                boxCollider = gameObject.addComponent(egret3d.oimo.BoxCollider);
                                boxCollider.size = cubeSize;
                                rigidbody.mass = 1.0;
                            }
                        }
                        paper.GameObject.globalGameObject.addComponent(TeleportRigidBodies);
                        return [2 /*return*/];
                    });
                });
            };
            return OimoBase;
        }());
        oimo.OimoBase = OimoBase;
        __reflect(OimoBase.prototype, "examples.oimo.OimoBase");
        var TeleportRigidBodies = (function (_super) {
            __extends(TeleportRigidBodies, _super);
            function TeleportRigidBodies() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.top = 20.0;
                _this.bottom = -20.0;
                _this.area = 10.0;
                return _this;
            }
            TeleportRigidBodies.prototype.onUpdate = function () {
                var pos = egret3d.Vector3.create().release();
                var physicsSystem = paper.Application.systemManager.getSystem(egret3d.oimo.PhysicsSystem);
                var rigidBody = physicsSystem.oimoWorld.getRigidBodyList();
                while (rigidBody !== null) {
                    rigidBody.getPositionTo(pos);
                    if (pos.y < this.bottom) {
                        pos.y = this.top;
                        pos.x = Math.random() * this.area - this.area * 0.5;
                        pos.z = Math.random() * this.area - this.area * 0.5;
                        rigidBody.setPosition(pos);
                        rigidBody.setLinearVelocity(egret3d.Vector3.ZERO);
                    }
                    rigidBody = rigidBody.getNext();
                }
            };
            return TeleportRigidBodies;
        }(paper.Behaviour));
        __reflect(TeleportRigidBodies.prototype, "TeleportRigidBodies");
    })(oimo = examples.oimo || (examples.oimo = {}));
})(examples || (examples = {}));
