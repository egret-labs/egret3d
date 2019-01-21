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
    var BehaviourLifeCycleTest = (function () {
        function BehaviourLifeCycleTest() {
        }
        BehaviourLifeCycleTest.prototype.start = function () {
            return __awaiter(this, void 0, void 0, function () {
                var gameObject, gameObject;
                return __generator(this, function (_a) {
                    // Create camera.
                    egret3d.Camera.main;
                    {
                        gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "CubeA");
                        gameObject.transform.setLocalPosition(2.0, 0.0, 0.0);
                        gameObject.activeSelf = false;
                        gameObject.addComponent(BehaviourTest);
                        gameObject.addComponent(BehaviourTest);
                    }
                    {
                        gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "CubeB");
                        gameObject.transform.setLocalPosition(-2.0, 0.0, 0.0);
                        gameObject.addComponent(BehaviourTest);
                        gameObject.addComponent(BehaviourTest);
                    }
                    return [2 /*return*/];
                });
            });
        };
        return BehaviourLifeCycleTest;
    }());
    examples.BehaviourLifeCycleTest = BehaviourLifeCycleTest;
    __reflect(BehaviourLifeCycleTest.prototype, "examples.BehaviourLifeCycleTest", ["examples.Example"]);
    var BehaviourTest = (function (_super) {
        __extends(BehaviourTest, _super);
        function BehaviourTest() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BehaviourTest.prototype.onAwake = function () {
            console.info("onAwake", this.gameObject.name);
        };
        BehaviourTest.prototype.onEnable = function () {
            console.info("onEnable", this.gameObject.name);
        };
        BehaviourTest.prototype.onStart = function () {
            console.info("onStart", this.gameObject.name);
        };
        BehaviourTest.prototype.onFixedUpdate = function (ct, tt) {
            // console.info("onFixedUpdate", ct, tt);
        };
        BehaviourTest.prototype.onUpdate = function (deltaTime) {
            // console.info("onUpdate");
        };
        BehaviourTest.prototype.onLateUpdate = function (deltaTime) {
            // console.info("onLateUpdate");
        };
        BehaviourTest.prototype.onDisable = function () {
            console.info("onDisable", this.gameObject.name);
        };
        BehaviourTest.prototype.onDestroy = function () {
            console.info("onDestroy", this.gameObject.name);
        };
        BehaviourTest = __decorate([
            paper.allowMultiple
        ], BehaviourTest);
        return BehaviourTest;
    }(paper.Behaviour));
    __reflect(BehaviourTest.prototype, "BehaviourTest");
})(examples || (examples = {}));
