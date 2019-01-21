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
    var InputTest = (function () {
        function InputTest() {
        }
        InputTest.prototype.start = function () {
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
                                light.castShadows = true;
                            }
                            paper.GameObject.globalGameObject.addComponent(Updater);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return InputTest;
    }());
    examples.InputTest = InputTest;
    __reflect(InputTest.prototype, "examples.InputTest");
    var Updater = (function (_super) {
        __extends(Updater, _super);
        function Updater() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._cubeLeft = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
            _this._cubeMiddle = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
            _this._cubeRight = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
            _this._cubeBack = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
            _this._cubeForward = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
            _this._cubeEraser = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
            _this._holdCubes = {};
            return _this;
        }
        Updater.prototype.onAwake = function () {
            this._cubeLeft.transform.setLocalPosition(-2.0, 1.0, 0.0).gameObject.renderer.material = egret3d.DefaultMaterials.MESH_LAMBERT;
            this._cubeMiddle.transform.setLocalPosition(0.0, 1.0, 0.0).gameObject.renderer.material = egret3d.DefaultMaterials.MESH_LAMBERT;
            this._cubeRight.transform.setLocalPosition(2.0, 1.0, 0.0).gameObject.renderer.material = egret3d.DefaultMaterials.MESH_LAMBERT;
            this._cubeBack.transform.setLocalPosition(-2.0, -1.0, 0.0).gameObject.renderer.material = egret3d.DefaultMaterials.MESH_LAMBERT;
            this._cubeForward.transform.setLocalPosition(0.0, -1.0, 0.0).gameObject.renderer.material = egret3d.DefaultMaterials.MESH_LAMBERT;
            this._cubeEraser.transform.setLocalPosition(2.0, -1.0, 0.0).gameObject.renderer.material = egret3d.DefaultMaterials.MESH_LAMBERT;
        };
        Updater.prototype.onUpdate = function () {
            var camera = egret3d.Camera.main;
            var inputCollecter = this.gameObject.getComponent(egret3d.InputCollecter);
            var defaultPointer = inputCollecter.defaultPointer;
            // Mouse wheel.
            var mouseWheel = inputCollecter.mouseWheel * 0.5;
            if (mouseWheel !== 0.0) {
                this._cubeLeft.transform.rotate(mouseWheel, 0.0, 0.0);
                this._cubeMiddle.transform.rotate(mouseWheel, 0.0, 0.0);
                this._cubeRight.transform.rotate(mouseWheel, 0.0, 0.0);
                this._cubeBack.transform.rotate(mouseWheel, 0.0, 0.0);
                this._cubeForward.transform.rotate(mouseWheel, 0.0, 0.0);
                this._cubeEraser.transform.rotate(mouseWheel, 0.0, 0.0);
            }
            // Mouse key or default touch.
            if (defaultPointer.isDown()) {
                this._cubeLeft.transform.setLocalScale(2.0, 2.0, 2.0);
            }
            else if (defaultPointer.isHold()) {
                this._cubeLeft.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (defaultPointer.isUp()) {
                this._cubeLeft.transform.setLocalScale(1.0, 1.0, 1.0);
                this._cubeLeft.transform.setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (defaultPointer.isDown(4 /* MiddleMouse */)) {
                this._cubeMiddle.transform.setLocalScale(2.0, 2.0, 2.0);
            }
            else if (defaultPointer.isHold(4 /* MiddleMouse */)) {
                this._cubeMiddle.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (defaultPointer.isUp(4 /* MiddleMouse */)) {
                this._cubeMiddle.transform.setLocalScale(1.0, 1.0, 1.0);
                this._cubeMiddle.transform.setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (defaultPointer.isDown(2 /* RightMouse */)) {
                this._cubeRight.transform.setLocalScale(2.0, 2.0, 2.0);
                this._cubeLeft.transform.setLocalEuler(0.0, 0.0, 0.0);
            }
            else if (defaultPointer.isHold(2 /* RightMouse */)) {
                this._cubeRight.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (defaultPointer.isUp(2 /* RightMouse */)) {
                this._cubeRight.transform.setLocalScale(1.0, 1.0, 1.0);
                this._cubeRight.transform.setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (defaultPointer.isDown(8 /* Back */)) {
                this._cubeBack.transform.setLocalScale(2.0, 2.0, 2.0);
            }
            else if (defaultPointer.isHold(8 /* Back */)) {
                this._cubeBack.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (defaultPointer.isUp(8 /* Back */)) {
                this._cubeBack.transform.setLocalScale(1.0, 1.0, 1.0);
                this._cubeBack.transform.setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (defaultPointer.isDown(16 /* Forward */)) {
                this._cubeForward.transform.setLocalScale(2.0, 2.0, 2.0);
            }
            else if (defaultPointer.isHold(16 /* Forward */)) {
                this._cubeForward.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (defaultPointer.isUp(16 /* Forward */)) {
                this._cubeForward.transform.setLocalScale(1.0, 1.0, 1.0);
                this._cubeForward.transform.setLocalEuler(0.0, 0.0, 0.0);
            }
            //
            if (defaultPointer.isDown(32 /* PenEraser */)) {
                this._cubeEraser.transform.setLocalScale(2.0, 2.0, 2.0);
            }
            else if (defaultPointer.isHold(32 /* PenEraser */)) {
                this._cubeEraser.transform.rotate(0.0, 0.05, 0.0);
            }
            else if (defaultPointer.isUp(32 /* PenEraser */)) {
                this._cubeEraser.transform.setLocalScale(1.0, 1.0, 1.0);
                this._cubeEraser.transform.setLocalEuler(0.0, 0.0, 0.0);
            }
            // Muti-touch.
            for (var _i = 0, _a = inputCollecter.getDownPointers(); _i < _a.length; _i++) {
                var pointer = _a[_i];
                if (!(pointer.event.pointerId in this._holdCubes)) {
                    var cube = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
                    cube.renderer.material = egret3d.DefaultMaterials.MESH_LAMBERT;
                    this._holdCubes[pointer.event.pointerId] = cube;
                }
            }
            for (var _b = 0, _c = inputCollecter.getHoldPointers(); _b < _c.length; _b++) {
                var pointer = _c[_b];
                var cube = this._holdCubes[pointer.event.pointerId];
                if (cube) {
                    var ray = camera.createRayByScreen(pointer.position.x, pointer.position.y).release();
                    var plane = egret3d.Plane.create().fromPoint(egret3d.Vector3.ZERO, egret3d.Vector3.UP).release();
                    var raycastInfo = egret3d.RaycastInfo.create().release();
                    if (plane.raycast(ray, raycastInfo)) {
                        cube.transform.localPosition = raycastInfo.position;
                    }
                }
            }
            for (var _d = 0, _e = inputCollecter.getUpPointers(); _d < _e.length; _d++) {
                var pointer = _e[_d];
                var cube = this._holdCubes[pointer.event.pointerId];
                if (cube) {
                    cube.destroy();
                    delete this._holdCubes[pointer.event.pointerId];
                }
            }
            // Key board.
            for (var _f = 0, _g = inputCollecter.getDownKeys(); _f < _g.length; _f++) {
                var key = _g[_f];
                console.log("KeyDown", key.event.code, key.event.key, key.event.keyCode);
            }
            for (var _h = 0, _j = inputCollecter.getUpKeys(); _h < _j.length; _h++) {
                var key = _j[_h];
                console.log("KeyUp", key.event.code, key.event.key, key.event.keyCode);
            }
        };
        return Updater;
    }(paper.Behaviour));
    __reflect(Updater.prototype, "Updater");
})(examples || (examples = {}));
