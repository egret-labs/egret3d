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
var behaviors;
(function (behaviors) {
    var Wander = (function (_super) {
        __extends(Wander, _super);
        function Wander() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.radius = 10.0;
            _this.timeScale = egret3d.Vector3.create(1.0, 0.7, 0.4);
            _this.center = egret3d.Vector3.create();
            _this.target = null;
            return _this;
        }
        Wander.prototype.onUpdate = function () {
            var time = paper.clock.time;
            var radius = this.radius;
            var timeScale = this.timeScale;
            var center = this.center;
            if (this.target) {
                center.copy(this.target.transform.position);
            }
            this.gameObject.transform.setLocalPosition(Math.sin(time * timeScale.x) * radius + center.x, Math.cos(time * timeScale.y) * radius + center.y, Math.cos(time * timeScale.z) * radius + center.z);
        };
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */)
        ], Wander.prototype, "radius", void 0);
        __decorate([
            paper.editor.property("VECTOR3" /* VECTOR3 */)
        ], Wander.prototype, "timeScale", void 0);
        __decorate([
            paper.editor.property("VECTOR3" /* VECTOR3 */)
        ], Wander.prototype, "center", void 0);
        return Wander;
    }(paper.Behaviour));
    behaviors.Wander = Wander;
    __reflect(Wander.prototype, "behaviors.Wander");
})(behaviors || (behaviors = {}));
