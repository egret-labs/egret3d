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
    var ThermaVisionPostProcess = (function (_super) {
        __extends(ThermaVisionPostProcess, _super);
        function ThermaVisionPostProcess() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.thermaValue = 0.5;
            _this._material = egret3d.Material.create(RES.getRes("shaders/thermaVision/thermaVision.shader.json"));
            return _this;
        }
        ThermaVisionPostProcess.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
        };
        ThermaVisionPostProcess.prototype.uninitialize = function () {
            _super.prototype.uninitialize.call(this);
        };
        ThermaVisionPostProcess.prototype.onRender = function (camera) {
            //
            var material = this._material;
            material.setFloat("thermaValue", this.thermaValue);
            material.setTexture(camera.postprocessingRenderTarget);
            this.blit(camera.postprocessingRenderTarget, material);
        };
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0, maximum: 1 })
        ], ThermaVisionPostProcess.prototype, "thermaValue", void 0);
        return ThermaVisionPostProcess;
    }(egret3d.CameraPostprocessing));
    components.ThermaVisionPostProcess = ThermaVisionPostProcess;
    __reflect(ThermaVisionPostProcess.prototype, "components.ThermaVisionPostProcess");
})(components || (components = {}));
