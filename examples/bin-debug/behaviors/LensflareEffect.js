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
    var LensflareEffect = (function (_super) {
        __extends(LensflareEffect, _super);
        function LensflareEffect() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._elements = [];
            _this._renderState = paper.GameObject.globalGameObject.getOrAddComponent(egret3d.RenderState, false, _this); // Set interface.
            _this._material1a = egret3d.Material.create(RES.getRes("shaders/lensflare/a.shader.json"));
            _this._material1b = egret3d.Material.create(RES.getRes("shaders/lensflare/b.shader.json"));
            _this._materialLensflare = egret3d.Material.create(RES.getRes("shaders/lensflare/lensflare.shader.json"));
            _this._drawCall1a = egret3d.DrawCall.create();
            _this._drawCall1b = egret3d.DrawCall.create();
            _this._drawCallLensflare = egret3d.DrawCall.create();
            _this._meshLensflare = egret3d.MeshBuilder.createPlane(2, 2);
            _this._tempMap = null;
            _this._occlusionMap = null;
            _this._positionScreen = egret3d.Vector3.create();
            _this._scale = egret3d.Vector2.create();
            _this._screenPositionPixels = egret3d.Vector2.create();
            _this._validArea = egret3d.Rectangle.create();
            _this._viewport = egret3d.Rectangle.create();
            _this.angleSpeed = 0.0;
            _this.color = egret3d.Color.create(0.55, 0.9, 1.0, 1.0);
            return _this;
        }
        LensflareEffect.prototype.onAwake = function () {
            this._tempMap = egret3d.Texture.create({
                source: new Uint8Array(LensflareEffect.TEXTURE_SIZE.x * LensflareEffect.TEXTURE_SIZE.y * 3),
                width: LensflareEffect.TEXTURE_SIZE.x, height: LensflareEffect.TEXTURE_SIZE.y,
                format: 6407 /* RGB */,
                wrapS: 33071 /* ClampToEdge */, wrapT: 33071 /* ClampToEdge */
            });
            this._occlusionMap = egret3d.Texture.create({
                source: new Uint8Array(LensflareEffect.TEXTURE_SIZE.x * LensflareEffect.TEXTURE_SIZE.y * 3),
                width: LensflareEffect.TEXTURE_SIZE.x, height: LensflareEffect.TEXTURE_SIZE.y,
                format: 6407 /* RGB */,
                wrapS: 33071 /* ClampToEdge */, wrapT: 33071 /* ClampToEdge */
            });
            // this._tempMap.uploadImage(new Uint8Array(LensflareEffect.TEXTURE_SIZE.x * LensflareEffect.TEXTURE_SIZE.y * 3), false, false, false);
            // this._occlusionMap.uploadImage(new Uint8Array(LensflareEffect.TEXTURE_SIZE.x * LensflareEffect.TEXTURE_SIZE.y * 3), false, false, false);
            this._material1a.setDepth(true, false);
            this._material1b.setDepth(false, false).setTexture(this._tempMap);
            this._materialLensflare.setDepth(true, false).setBlend(gltf.BlendMode.Additive, paper.RenderQueue.Transparent).setTexture("occlusionMap", this._occlusionMap);
            var meshFilter = this.gameObject.addComponent(egret3d.MeshFilter);
            meshFilter.mesh = this._meshLensflare;
            var meshRenderer = this.gameObject.addComponent(egret3d.MeshRenderer);
            meshRenderer.frustumCulled = false;
            //最后渲染
            meshRenderer.material = egret3d.Material.create(egret3d.DefaultShaders.TRANSPARENT).setOpacity(0).setRenderQueue(paper.RenderQueue.Overlay + Infinity);
            this._drawCall1a.subMeshIndex = 0;
            this._drawCall1a.matrix = egret3d.Matrix4.create();
            this._drawCall1a.material = this._material1a;
            this._drawCall1a.mesh = this._meshLensflare;
            this._drawCall1b.subMeshIndex = 0;
            this._drawCall1b.matrix = egret3d.Matrix4.create();
            this._drawCall1b.material = this._material1b;
            this._drawCall1b.mesh = this._meshLensflare;
            this._drawCallLensflare.subMeshIndex = 0;
            this._drawCallLensflare.matrix = egret3d.Matrix4.create();
            this._drawCallLensflare.material = this._materialLensflare;
            this._drawCallLensflare.mesh = this._meshLensflare;
        };
        LensflareEffect.prototype.onDestroy = function () {
            this._elements.length = 0;
            if (this._tempMap) {
                this._tempMap.dispose();
            }
            if (this._occlusionMap) {
                this._occlusionMap.dispose();
            }
            this._material1a.dispose();
            this._material1b.dispose();
            this._materialLensflare.dispose();
        };
        LensflareEffect.prototype.addElement = function (e) {
            this._elements.push(e);
        };
        LensflareEffect.prototype.onBeforeRender = function () {
            var camera = egret3d.Camera.current;
            var renderState = this._renderState;
            var viewport = this._viewport;
            var scale = this._scale;
            var validArea = this._validArea;
            var positionScreen = this._positionScreen;
            var screenPositionPixels = this._screenPositionPixels;
            var textureSize = LensflareEffect.TEXTURE_SIZE;
            viewport.copy(camera.pixelViewport);
            var invAspect = viewport.h / viewport.w;
            var halfViewportWidth = viewport.w / 2.0;
            var halfViewportHeight = viewport.h / 2.0;
            var size = 16 / viewport.h;
            scale.set(size * invAspect, size);
            validArea.set(viewport.x, viewport.y, viewport.w - textureSize.x, viewport.h - textureSize.y);
            // calculate position in screen space
            positionScreen.copy(this.transform.position);
            positionScreen.applyMatrix(camera.worldToClipMatrix);
            // horizontal and vertical coordinate of the lower left corner of the pixels to copy
            screenPositionPixels.x = viewport.x + (positionScreen.x * halfViewportWidth) + halfViewportWidth - textureSize.x / 2.0;
            screenPositionPixels.y = viewport.y + (positionScreen.y * halfViewportHeight) + halfViewportHeight - textureSize.y / 2.0;
            // screen cull
            if (validArea.contains(screenPositionPixels)) {
                // save current RGB to temp texture
                renderState.copyFramebufferToTexture(screenPositionPixels, this._tempMap);
                // render pink quad
                this._material1a.setVector2("tscale", scale);
                this._material1a.setVector3("screenPosition", positionScreen);
                renderState.draw(this._drawCall1a);
                // copy result to occlusionMap
                renderState.copyFramebufferToTexture(screenPositionPixels, this._occlusionMap);
                // restore graphics
                this._material1b.setVector2("tscale", scale);
                this._material1b.setVector3("screenPosition", positionScreen);
                renderState.draw(this._drawCall1b);
                // render elements
                var elements = this._elements;
                var material2 = this._materialLensflare;
                var vecX = -positionScreen.x * 2;
                var vecY = -positionScreen.y * 2;
                if (elements.length > 0) {
                    elements[0].color = this.color;
                }
                for (var i = 0, l = elements.length; i < l; i++) {
                    var element = elements[i];
                    var size = element.size / viewport.h;
                    var invAspect = viewport.h / viewport.w;
                    if (element.rotate) {
                        element.angle += this.angleSpeed;
                        material2.setFloat("radian", element.angle / 360.0 * Math.PI);
                    }
                    else {
                        material2.setFloat("radian", 0.0);
                    }
                    material2.setColor("color", element.color);
                    material2.setTexture("map", element.texture);
                    material2.setVector2("tscale", egret3d.Vector2.create(size * invAspect, size));
                    var temp = egret3d.Vector3.create(positionScreen.x + vecX * element.distance, positionScreen.y + vecY * element.distance, 0.0).release();
                    material2.setVector3("screenPosition", temp);
                    renderState.draw(this._drawCallLensflare);
                }
            }
            else {
            }
            return true;
        };
        LensflareEffect.TEXTURE_SIZE = egret3d.Vector2.create(16, 16);
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */)
        ], LensflareEffect.prototype, "angleSpeed", void 0);
        __decorate([
            paper.editor.property("COLOR" /* COLOR */)
        ], LensflareEffect.prototype, "color", void 0);
        return LensflareEffect;
    }(paper.Behaviour));
    behaviors.LensflareEffect = LensflareEffect;
    __reflect(LensflareEffect.prototype, "behaviors.LensflareEffect");
})(behaviors || (behaviors = {}));
