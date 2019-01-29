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
    var ThermalVisionPostProcess2 = (function (_super) {
        __extends(ThermalVisionPostProcess2, _super);
        function ThermalVisionPostProcess2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.hotLight = 3.0;
            _this._material = egret3d.Material.create(RES.getRes("shaders/thermalVision2/thermalVision2.shader.json"));
            _this._rnd = egret3d.Vector2.create();
            return _this;
        }
        ThermalVisionPostProcess2.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this._material.setTexture("heatLookupMap", RES.getRes("textures/HeatLookup.png"));
            this._material.setTexture("noiseMap", RES.getRes("textures/HeatNoise.png"));
        };
        ThermalVisionPostProcess2.prototype.uninitialize = function () {
            _super.prototype.uninitialize.call(this);
        };
        ThermalVisionPostProcess2.prototype.onRender = function (camera) {
            //
            this._rnd.set(Math.random(), Math.random());
            var material = this._material;
            material.setVector2("rnd", this._rnd);
            material.setFloat("hotLight", this.hotLight);
            material.setTexture(camera.postprocessingRenderTarget);
            this.blit(camera.postprocessingRenderTarget, material);
        };
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0, maximum: 5 })
        ], ThermalVisionPostProcess2.prototype, "hotLight", void 0);
        return ThermalVisionPostProcess2;
    }(egret3d.CameraPostprocessing));
    components.ThermalVisionPostProcess2 = ThermalVisionPostProcess2;
    __reflect(ThermalVisionPostProcess2.prototype, "components.ThermalVisionPostProcess2");
})(components || (components = {}));
