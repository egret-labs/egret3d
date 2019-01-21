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
    var DisplacementMapTest = (function () {
        function DisplacementMapTest() {
        }
        DisplacementMapTest.prototype.start = function () {
            return __awaiter(this, void 0, void 0, function () {
                var lightObj, light, ninja;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Load resource config.
                        return [4 /*yield*/, RES.loadConfig("default.res.json", "resource/")];
                        case 1:
                            // Load resource config.
                            _a.sent();
                            // Load scene resource.
                            return [4 /*yield*/, RES.getResAsync("Assets/ninjaHead_Low.prefab.json")];
                        case 2:
                            // Load scene resource.
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("Assets/Models/ninja/normal.image.json")];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("Assets/Models/ninja/ao.image.json")];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, RES.getResAsync("Assets/Models/ninja/displacement.image.json")];
                        case 5:
                            _a.sent();
                            egret3d.Camera.main;
                            lightObj = paper.GameObject.create("light");
                            light = lightObj.addComponent(egret3d.DirectionalLight);
                            light.color.set(1.0, 0.0, 0.0, 1.0);
                            ninja = paper.Prefab.create("Assets/ninjaHead_Low.prefab.json");
                            ninja.transform.position.set(0, -185, -63).update();
                            ninja.transform.localEulerAngles.set(-38, 179, 0).update();
                            ninja.addComponent(GUIScript);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return DisplacementMapTest;
    }());
    examples.DisplacementMapTest = DisplacementMapTest;
    __reflect(DisplacementMapTest.prototype, "examples.DisplacementMapTest");
    var GUIScript = (function (_super) {
        __extends(GUIScript, _super);
        function GUIScript() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.metalness = 1.0;
            _this.roughness = 0.4;
            _this.aoMapIntensity = 1.0;
            // @paper.editor.property(paper.editor.EditType.FLOAT)
            // public envMapIntensity: number = 0.0;
            _this.displacementScale = 2.436143;
            _this.displacementBias = -0.428408;
            _this.normalScale = 1.0;
            _this._material = null;
            return _this;
        }
        GUIScript.prototype.onAwake = function () {
            var normalMap = RES.getRes("Assets/Models/ninja/normal.image.json");
            var aoMap = RES.getRes("Assets/Models/ninja/ao.image.json");
            var displacementMap = RES.getRes("Assets/Models/ninja/displacement.image.json");
            this._material = egret3d.Material.create(egret3d.DefaultShaders.MESH_PHYSICAL);
            this._material.setColor("diffuse", egret3d.Color.WHITE);
            this._material.setTexture("normalMap", normalMap).setTexture("aoMap", aoMap).setTexture("displacementMap", displacementMap);
            this._material.addDefine("STANDARD");
            this.gameObject.renderer.material = this._material;
        };
        GUIScript.prototype.onUpdate = function () {
            var material = this._material;
            material.setFloat("metalness", this.metalness);
            material.setFloat("roughness", this.roughness);
            material.setFloat("aoMapIntensity", this.aoMapIntensity);
            material.setFloat("displacementScale", this.displacementScale);
            material.setFloat("displacementBias", this.displacementBias);
            material.setVector2("normalScale", egret3d.Vector2.create(1, 1).multiplyScalar(this.normalScale).release());
        };
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0.0, maximum: 1.0 })
        ], GUIScript.prototype, "metalness", void 0);
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0.0, maximum: 1.0 })
        ], GUIScript.prototype, "roughness", void 0);
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0.0, maximum: 1.0 })
        ], GUIScript.prototype, "aoMapIntensity", void 0);
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0.0, maximum: 3.0 })
        ], GUIScript.prototype, "displacementScale", void 0);
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */)
        ], GUIScript.prototype, "displacementBias", void 0);
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */, { minimum: -1.0, maximum: 1.0 })
        ], GUIScript.prototype, "normalScale", void 0);
        return GUIScript;
    }(paper.Behaviour));
    __reflect(GUIScript.prototype, "GUIScript");
})(examples || (examples = {}));
