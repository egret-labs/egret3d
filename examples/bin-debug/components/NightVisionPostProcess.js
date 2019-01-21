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
var components;
(function (components) {
    var NightVisionPostProcess = (function (_super) {
        __extends(NightVisionPostProcess, _super);
        function NightVisionPostProcess() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.fadeFX = 1.0;
            _this._matrix9 = [2, -2, -2, 1.95, 0.04, -1.6, 2, -2, -2, -2, 0.1, -2];
            _this._material = egret3d.Material.create(RES.getRes("shaders/nightVision/nightVision.shader.json"));
            _this._time = 0.0;
            return _this;
        }
        NightVisionPostProcess.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this._material.setFloatv("matrix9[0]", this._matrix9);
        };
        NightVisionPostProcess.prototype.uninitialize = function () {
            _super.prototype.uninitialize.call(this);
        };
        NightVisionPostProcess.prototype.onRender = function (camera) {
            this._time += paper.clock.deltaTime;
            if (this._time > 100) {
                this._time = 0.0;
            }
            //
            var material = this._material;
            material.setFloat("fadeFX", this.fadeFX);
            material.setFloat("time", this._time);
            material.setTexture(camera.postprocessingRenderTarget);
            this.blit(camera.postprocessingRenderTarget, material);
        };
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0, maximum: 1 })
        ], NightVisionPostProcess.prototype, "fadeFX", void 0);
        return NightVisionPostProcess;
    }(egret3d.CameraPostprocessing));
    components.NightVisionPostProcess = NightVisionPostProcess;
    __reflect(NightVisionPostProcess.prototype, "components.NightVisionPostProcess");
})(components || (components = {}));
