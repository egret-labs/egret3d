namespace behaviors {
    export class LensflareEffect extends paper.Behaviour {
        public static TEXTURE_SIZE = egret3d.Vector2.create(16, 16);
        private readonly _elements: LensflareElement[] = [];
        private readonly _renderState: egret3d.WebGLRenderState = paper.GameObject.globalGameObject.getOrAddComponent(egret3d.WebGLRenderState, false, this); // Set interface.
        private readonly _material1a: egret3d.Material = new egret3d.Material(RES.getRes("lensflare/shaders/a.shader.json"));
        private readonly _material1b: egret3d.Material = new egret3d.Material(RES.getRes("lensflare/shaders/b.shader.json"));
        private readonly _materialLensflare: egret3d.Material = new egret3d.Material(RES.getRes("lensflare/shaders/lensflare.shader.json"));
        private readonly _drawCall1a: egret3d.DrawCall = egret3d.DrawCall.create();
        private readonly _drawCall1b: egret3d.DrawCall = egret3d.DrawCall.create();
        private readonly _drawCallLensflare: egret3d.DrawCall = egret3d.DrawCall.create();
        private readonly _meshLensflare: egret3d.Mesh = egret3d.MeshBuilder.createPlane(2, 2);
        private _tempMap: egret3d.GLTexture2D = new egret3d.GLTexture2D("tempMap", LensflareEffect.TEXTURE_SIZE.x, LensflareEffect.TEXTURE_SIZE.y, gltf.TextureFormat.RGB);;
        private _occlusionMap: egret3d.GLTexture2D = new egret3d.GLTexture2D("occlusionMap", LensflareEffect.TEXTURE_SIZE.x, LensflareEffect.TEXTURE_SIZE.y, gltf.TextureFormat.RGB);;

        private readonly _positionScreen: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _scale: egret3d.Vector2 = egret3d.Vector2.create();
        private readonly _screenPositionPixels: egret3d.Vector2 = egret3d.Vector2.create();
        private readonly _validArea: egret3d.Rectangle = egret3d.Rectangle.create();
        private readonly _viewport: egret3d.Rectangle = egret3d.Rectangle.create();
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public angleSpeed: number = 0.0;
        @paper.editor.property(paper.editor.EditType.COLOR)
        public color: egret3d.Color = egret3d.Color.create(0.55, 0.9, 1.0, 1.0);
        public onAwake() {
            this._tempMap.uploadImage(new Uint8Array(LensflareEffect.TEXTURE_SIZE.x * LensflareEffect.TEXTURE_SIZE.y * 3), false, false, false);
            this._occlusionMap.uploadImage(new Uint8Array(LensflareEffect.TEXTURE_SIZE.x * LensflareEffect.TEXTURE_SIZE.y * 3), false, false, false);

            this._material1a.setDepth(true, false);
            this._material1b.setDepth(false, false).setTexture(this._tempMap);
            this._materialLensflare.setDepth(true, false).setBlend(gltf.BlendMode.Additive, paper.RenderQueue.Transparent).setTexture("occlusionMap", this._occlusionMap);

            const meshFilter = this.gameObject.addComponent(egret3d.MeshFilter);
            meshFilter.mesh = this._meshLensflare;
            const meshRenderer = this.gameObject.addComponent(egret3d.MeshRenderer);
            meshRenderer.frustumCulled = false;
            //最后渲染
            meshRenderer.material = new egret3d.Material(egret3d.DefaultShaders.TRANSPARENT).setOpacity(0).setRenderQueue(paper.RenderQueue.Overlay + Infinity);

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
        }

        public onDestroy() {
            this._elements.length = 0;
            this._tempMap.dispose();
            this._occlusionMap.dispose();

            this._material1a.dispose();
            this._material1b.dispose();
            this._materialLensflare.dispose();
        }

        public addElement(e: LensflareElement) {
            this._elements.push(e);
        }

        public onBeforeRender() {
            const camera = egret3d.Camera.current!;
            const renderState = this._renderState;
            const viewport = this._viewport;
            const scale = this._scale;
            const validArea = this._validArea;
            const positionScreen = this._positionScreen;
            const screenPositionPixels = this._screenPositionPixels;
            const textureSize = LensflareEffect.TEXTURE_SIZE;

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
                renderState.copyFramebufferToTexture(screenPositionPixels, this._tempMap as egret3d.ITexture);

                // render pink quad
                this._material1a.setVector2("tscale", scale);
                this._material1a.setVector3("screenPosition", positionScreen);

                renderState.draw(camera, this._drawCall1a);

                // copy result to occlusionMap
                renderState.copyFramebufferToTexture(screenPositionPixels, this._occlusionMap);

                // restore graphics
                this._material1b.setVector2("tscale", scale);
                this._material1b.setVector3("screenPosition", positionScreen);

                renderState.draw(camera, this._drawCall1b);

                // render elements
                const elements = this._elements;
                const material2 = this._materialLensflare;
                var vecX = - positionScreen.x * 2;
                var vecY = - positionScreen.y * 2;
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
                    const temp = egret3d.Vector3.create(positionScreen.x + vecX * element.distance, positionScreen.y + vecY * element.distance, 0.0).release();
                    material2.setVector3("screenPosition", temp);

                    renderState.draw(camera, this._drawCallLensflare);
                }
            }
            else {
            }
            return true;
        }
    }

    export interface LensflareElement {
        texture: egret3d.Texture;
        size: number;
        distance: number;
        color: egret3d.Color;
        rotate: boolean;
        angle: number;
    }
}
