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
    var tests;
    (function (tests) {
        var DefaultMeshesTest = (function () {
            function DefaultMeshesTest() {
            }
            DefaultMeshesTest.prototype.start = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // Load resource config.
                            return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/")];
                            case 1:
                                // Load resource config.
                                _a.sent();
                                return [4 /*yield*/, RES.getResAsync("threejs/textures/UV_Grid_Sm.jpg")];
                            case 2:
                                _a.sent();
                                // Create camera.
                                egret3d.Camera.main.gameObject.addComponent(Starter);
                                //
                                examples.createGridRoom();
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return DefaultMeshesTest;
        }());
        tests.DefaultMeshesTest = DefaultMeshesTest;
        __reflect(DefaultMeshesTest.prototype, "examples.tests.DefaultMeshesTest", ["examples.Example"]);
        var Starter = (function (_super) {
            __extends(Starter, _super);
            function Starter() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Starter.prototype.onAwake = function () {
                var defaultMeshes = [
                    egret3d.DefaultMeshes.QUAD,
                    egret3d.DefaultMeshes.CUBE,
                    egret3d.DefaultMeshes.PYRAMID,
                    egret3d.DefaultMeshes.CONE,
                    egret3d.DefaultMeshes.CYLINDER,
                    egret3d.DefaultMeshes.TORUS,
                    egret3d.DefaultMeshes.SPHERE,
                ];
                var material = egret3d.Material.create(egret3d.DefaultShaders.MESH_PHONG)
                    .setTexture(RES.getRes("threejs/textures/UV_Grid_Sm.jpg"))
                    .setCullFace(false);
                var index = 0;
                var total = Math.ceil(defaultMeshes.length / 4.0);
                for (var _i = 0, defaultMeshes_1 = defaultMeshes; _i < defaultMeshes_1.length; _i++) {
                    var mesh = defaultMeshes_1[_i];
                    var gameObject = egret3d.creater.createGameObject(mesh.name, { mesh: mesh, material: material, castShadows: true });
                    gameObject.transform.setLocalPosition((index % total) * 2.0 - 1.0, 1.0, Math.floor(index / total) * 2.0 - 2.0);
                    gameObject.addComponent(behaviors.Rotater);
                    index++;
                }
            };
            return Starter;
        }(paper.Behaviour));
        __reflect(Starter.prototype, "Starter");
    })(tests = examples.tests || (examples.tests = {}));
})(examples || (examples = {}));
