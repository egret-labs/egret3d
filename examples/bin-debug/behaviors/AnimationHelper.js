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
    /**
     *
     */
    var AnimationHelper = (function (_super) {
        __extends(AnimationHelper, _super);
        function AnimationHelper() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.fadeTime = 0.3;
            _this.layerIndex = 0;
            _this.play = function () {
                var animation = _this.gameObject.getComponent(egret3d.Animation);
                if (animation) {
                    animation.fadeIn(_this.animation, _this.fadeTime, -1, _this.layerIndex);
                    var animationController = animation.animationController;
                    var layer = animationController.getOrAddLayer(_this.layerIndex);
                    var mask = layer.mask;
                    if (_this._maskJointNames) {
                        var masks = _this._maskJointNames.split(",");
                        if (!mask) {
                            layer.mask = mask = egret3d.AnimationMask.create("");
                            mask.createJoints(_this.gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer).mesh);
                        }
                        for (var _i = 0, masks_1 = masks; _i < masks_1.length; _i++) {
                            var joint = masks_1[_i];
                            mask.addJoint(joint);
                        }
                    }
                    else if (mask) {
                        mask.removeJoints();
                    }
                }
            };
            _this.logEvents = false;
            _this._animation = "";
            _this._maskJointNames = "";
            _this._animations = [];
            return _this;
        }
        Object.defineProperty(AnimationHelper.prototype, "animation", {
            get: function () {
                return this._animation;
            },
            set: function (value) {
                if (this._animation === value) {
                    return;
                }
                this._animation = value;
                this.play();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationHelper.prototype, "maskJointNames", {
            get: function () {
                return this._maskJointNames;
            },
            set: function (value) {
                if (this._maskJointNames === value) {
                    return;
                }
                this._maskJointNames = value;
            },
            enumerable: true,
            configurable: true
        });
        AnimationHelper.prototype.onAwake = function (logEvents) {
            if (logEvents) {
                this.logEvents = true;
            }
        };
        AnimationHelper.prototype.onStart = function () {
            var animation = this.gameObject.getComponent(egret3d.Animation);
            if (animation) {
                for (var _i = 0, _a = animation.animations; _i < _a.length; _i++) {
                    var animationAsset = _a[_i];
                    if (!animationAsset) {
                        continue;
                    }
                    for (var _b = 0, _c = animationAsset.config.animations; _b < _c.length; _b++) {
                        var glftAnimation = _c[_b];
                        for (var _d = 0, _e = glftAnimation.extensions.paper.clips; _d < _e.length; _d++) {
                            var animationClip = _e[_d];
                            this._animations.push({ label: animationClip.name, value: animationClip.name });
                        }
                    }
                }
            }
        };
        AnimationHelper.prototype.onAnimationEvent = function (animationEvent) {
            if (this.logEvents) {
                console.log(animationEvent.type, animationEvent.animationState.animationClip.name);
            }
        };
        __decorate([
            paper.editor.property("LIST" /* LIST */, { listItems: "_animations" })
        ], AnimationHelper.prototype, "animation", null);
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */, { minimum: 0.0, maximum: 10.0 })
        ], AnimationHelper.prototype, "fadeTime", void 0);
        __decorate([
            paper.editor.property("UINT" /* UINT */, { minimum: 0, maximum: 10 })
        ], AnimationHelper.prototype, "layerIndex", void 0);
        __decorate([
            paper.editor.property("TEXT" /* TEXT */)
        ], AnimationHelper.prototype, "maskJointNames", null);
        __decorate([
            paper.editor.property("BUTTON" /* BUTTON */)
        ], AnimationHelper.prototype, "play", void 0);
        __decorate([
            paper.editor.property("CHECKBOX" /* CHECKBOX */)
        ], AnimationHelper.prototype, "logEvents", void 0);
        AnimationHelper = __decorate([
            paper.allowMultiple
        ], AnimationHelper);
        return AnimationHelper;
    }(paper.Behaviour));
    behaviors.AnimationHelper = AnimationHelper;
    __reflect(AnimationHelper.prototype, "behaviors.AnimationHelper");
})(behaviors || (behaviors = {}));
