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
    var MathTest = (function () {
        function MathTest() {
        }
        MathTest.prototype.start = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Create camera.
                    egret3d.Camera.main;
                    paper.GameObject.globalGameObject.addComponent(PlaneIntersectsSphere);
                    paper.GameObject.globalGameObject.addComponent(LerpTest);
                    return [2 /*return*/];
                });
            });
        };
        return MathTest;
    }());
    examples.MathTest = MathTest;
    __reflect(MathTest.prototype, "examples.MathTest");
    var PlaneIntersectsSphere = (function (_super) {
        __extends(PlaneIntersectsSphere, _super);
        function PlaneIntersectsSphere() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._plane = egret3d.Plane.create();
            _this._sphere = egret3d.Sphere.create();
            _this._planeObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Plane");
            _this._sphereObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.SPHERE, "Sphere");
            return _this;
        }
        PlaneIntersectsSphere.prototype.onAwake = function () {
            {
                var material = egret3d.Material.create(egret3d.DefaultShaders.MATERIAL_COLOR);
                material.setCullFace(false).setDepth(true, false).setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent, 0.7);
                this._planeObject.renderer.material = material;
            }
            {
                var material = egret3d.Material.create(egret3d.DefaultShaders.MATERIAL_COLOR);
                material.setDepth(true, true).setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent, 0.7);
                this._sphereObject.renderer.material = material;
            }
        };
        PlaneIntersectsSphere.prototype.onUpdate = function () {
            this._plane.fromPoint(this._planeObject.transform.position, this._planeObject.transform.getForward().negate().release());
            this._sphere.set(this._sphereObject.transform.position, 0.5);
            var material = this._sphereObject.renderer.material;
            if (egret3d.planeIntersectsSphere(this._plane, this._sphere)) {
                material.setColor("diffuse" /* Diffuse */, egret3d.Color.RED);
            }
            else {
                material.setColor("diffuse" /* Diffuse */, egret3d.Color.GREEN);
            }
        };
        return PlaneIntersectsSphere;
    }(paper.Behaviour));
    __reflect(PlaneIntersectsSphere.prototype, "PlaneIntersectsSphere");
    var LerpTest = (function (_super) {
        __extends(LerpTest, _super);
        function LerpTest() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._lineStart = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "LineStart");
            _this._lineEnd = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "LineEnd");
            _this._lines = [];
            return _this;
        }
        LerpTest.prototype.onAwake = function () {
            for (var i = 0; i < 50; ++i) {
                var line = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "Line_" + i);
                this._lines.push(line);
            }
        };
        LerpTest.prototype.onUpdate = function () {
            var startPosition = this._lineStart.transform.position;
            var startRotation = this._lineStart.transform.rotation;
            var endPosition = this._lineEnd.transform.position;
            var endRotation = this._lineEnd.transform.rotation;
            var position = egret3d.Vector3.create().release();
            var rotation = egret3d.Quaternion.create().release();
            for (var i = 0, l = this._lines.length; i < l; ++i) {
                var t = (i + 1) / (l + 1);
                var line = this._lines[i];
                position.lerp(t, startPosition, endPosition);
                rotation.lerp(t, startRotation, endRotation);
                line.transform.position = position;
                line.transform.rotation = rotation;
            }
        };
        return LerpTest;
    }(paper.Behaviour));
    __reflect(LerpTest.prototype, "LerpTest");
})(examples || (examples = {}));
