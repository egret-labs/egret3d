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
    var animations;
    (function (animations) {
        var Tree = (function () {
            function Tree() {
            }
            Tree.prototype.start = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // Load resource config.
                            return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/")];
                            case 1:
                                // Load resource config.
                                _a.sent();
                                // Load prefab resource.
                                return [4 /*yield*/, RES.getResAsync("Assets/Models/Mixamo/xbot.prefab.json")];
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
                                paper.GameObject.globalGameObject.addComponent(Starter);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return Tree;
        }());
        animations.Tree = Tree;
        __reflect(Tree.prototype, "examples.animations.Tree", ["examples.Example"]);
        var Starter = (function (_super) {
            __extends(Starter, _super);
            function Starter() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Starter.prototype.onAwake = function () {
                var gameObject = paper.Prefab.create("Assets/Models/Mixamo/xbot.prefab.json");
                var animation = gameObject.getOrAddComponent(egret3d.Animation);
                gameObject.getOrAddComponent(Updater);
                animation.animations = [
                    RES.getRes("Assets/Animations/Mixamo/Looking_Around.ani.bin"),
                    RES.getRes("Assets/Animations/Mixamo/Walking.ani.bin"),
                    RES.getRes("Assets/Animations/Mixamo/Running.ani.bin"),
                ];
                animation.play("Looking_Around");
                //
                var animationController = animation.animationController;
                var layer = animationController.getOrAddLayer(0);
                var tree = animationController.createAnimationTree(layer.machine, "WalkAndRun");
                animationController.createAnimationNode(tree, "Assets/Animations/Mixamo/Walking.ani.bin", "Walking");
                animationController.createAnimationNode(tree, "Assets/Animations/Mixamo/Running.ani.bin", "Running");
                animation.play("WalkAndRun");
                //
                egret3d.Camera.main.gameObject.addComponent(behaviors.RotateAround);
                //
                examples.createGridRoom();
            };
            return Starter;
        }(paper.Behaviour));
        __reflect(Starter.prototype, "Starter");
        var Updater = (function (_super) {
            __extends(Updater, _super);
            function Updater() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Updater.prototype.onUpdate = function () {
                var animation = this.gameObject.getComponent(egret3d.Animation);
                var walkState = animation.getState("Walking");
                var runningState = animation.getState("Running");
                this._blending1DStates(walkState, runningState, (Math.sin(paper.clock.time) + 1.0) * 0.5);
            };
            Updater.prototype._blending1DStates = function (a, b, lerp) {
                a.weight = 1.0 - lerp;
                b.weight = lerp;
                a.timeScale = egret3d.math.lerp(1.0, b.totalTime / a.totalTime, lerp);
                b.timeScale = egret3d.math.lerp(a.totalTime / b.totalTime, 1.0, lerp);
            };
            return Updater;
        }(paper.Behaviour));
        __reflect(Updater.prototype, "Updater");
    })(animations = examples.animations || (examples.animations = {}));
})(examples || (examples = {}));
