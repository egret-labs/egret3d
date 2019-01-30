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
    var PositionReseter = (function (_super) {
        __extends(PositionReseter, _super);
        function PositionReseter() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.original = egret3d.Vector3.create(0.0, 0.01, 0.0);
            _this.box = egret3d.Box.create();
            return _this;
        }
        PositionReseter.prototype.onAwake = function () {
            this.original.copy(this.gameObject.transform.localPosition);
        };
        PositionReseter.prototype.onUpdate = function () {
            if (!this.box.contains(this.gameObject.transform.localPosition)) {
                this.gameObject.transform.localPosition = this.original;
            }
        };
        __decorate([
            paper.editor.property("VECTOR3" /* VECTOR3 */)
        ], PositionReseter.prototype, "original", void 0);
        __decorate([
            paper.editor.property("NESTED" /* NESTED */)
        ], PositionReseter.prototype, "box", void 0);
        return PositionReseter;
    }(paper.Behaviour));
    behaviors.PositionReseter = PositionReseter;
    __reflect(PositionReseter.prototype, "behaviors.PositionReseter");
})(behaviors || (behaviors = {}));
