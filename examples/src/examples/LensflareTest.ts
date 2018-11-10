namespace examples {

    export class LensflareTest {

        async  start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            await RES.getResAsync("lensflare/shaders/a.shader.json");
            await RES.getResAsync("lensflare/shaders/b.shader.json");
            await RES.getResAsync("lensflare/shaders/lensflare.shader.json");
            await RES.getResAsync("lensflare/textures/lensflare0.png");
            await RES.getResAsync("lensflare/textures/lensflare1.png");
            await RES.getResAsync("lensflare/textures/lensflare2.png");
            await RES.getResAsync("lensflare/textures/lensflare3.png");
            // Create camera.
            egret3d.Camera.main;

            // const cameraObj = paper.GameObject.create();
            // cameraObj.addComponent(egret3d.Camera);
            // cameraObj.transform.setLocalPosition(0.0, 10.0, -10.0);
            //     cameraObj.transform.lookAt(egret3d.Vector3.ZERO);

            //
            const lensflare0 = RES.getRes("lensflare/textures/lensflare0.png");
            const lensflare1 = RES.getRes("lensflare/textures/lensflare1.png");
            const lensflare2 = RES.getRes("lensflare/textures/lensflare2.png");
            const lensflare3 = RES.getRes("lensflare/textures/lensflare3.png");

            // const cube = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "cube");

            const lensflareObj = paper.GameObject.create("Lensflare");
            const lensflareCom = lensflareObj.addComponent(Lensflare);
            lensflareCom.addElement({ texture: lensflare0, size: 700, distance: 0, color: egret3d.Color.create(0.55, 0.9, 1.0, 1.0), rotate: true, angle: 0 });
            lensflareCom.addElement({ texture: lensflare3, size: 60, distance: 0.6, color: egret3d.Color.WHITE.clone(), rotate: false, angle: 0 });
            lensflareCom.addElement({ texture: lensflare3, size: 70, distance: 0.7, color: egret3d.Color.WHITE.clone(), rotate: false, angle: 0 });
            lensflareCom.addElement({ texture: lensflare3, size: 120, distance: 0.9, color: egret3d.Color.WHITE.clone(), rotate: false, angle: 0 });
            lensflareCom.addElement({ texture: lensflare3, size: 70, distance: 1, color: egret3d.Color.WHITE.clone(), rotate: false, angle: 0 });
        }
    }

    export class Lensflare extends paper.Behaviour {
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
        private _tempMap: egret3d.GLTexture2D = new egret3d.GLTexture2D("tempMap", Lensflare.TEXTURE_SIZE.x, Lensflare.TEXTURE_SIZE.y, gltf.TextureFormat.RGB);;
        private _occlusionMap: egret3d.GLTexture2D = new egret3d.GLTexture2D("occlusionMap", Lensflare.TEXTURE_SIZE.x, Lensflare.TEXTURE_SIZE.y, gltf.TextureFormat.RGB);;

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
            this._tempMap.uploadImage(new Uint8Array(Lensflare.TEXTURE_SIZE.x * Lensflare.TEXTURE_SIZE.y * 3), false, false, false, false);
            this._occlusionMap.uploadImage(new Uint8Array(Lensflare.TEXTURE_SIZE.x * Lensflare.TEXTURE_SIZE.y * 3), false, false, false, false);

            this._material1a.setDepth(true, false);
            this._material1b.setDepth(false, false).setTexture(this._tempMap);
            this._materialLensflare.setDepth(true, false).setBlend(gltf.BlendMode.Additive, paper.RenderQueue.Transparent).setTexture("occlusionMap", this._occlusionMap);

            const meshFilter = this.gameObject.addComponent(egret3d.MeshFilter);
            meshFilter.mesh = this._meshLensflare;
            const meshRenderer = this.gameObject.addComponent(egret3d.MeshRenderer);
            meshRenderer.material = new egret3d.Material(egret3d.DefaultShaders.TRANSPARENT).setOpacity(0).setRenderQueue(paper.RenderQueue.Overlay + 1000);

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

            viewport.copy(camera.pixelViewport);

            var invAspect = viewport.h / viewport.w;
            var halfViewportWidth = viewport.w / 2.0;
            var halfViewportHeight = viewport.h / 2.0;

            var size = 16 / viewport.h;
            scale.set(size * invAspect, size);

            validArea.set(viewport.x, viewport.y, viewport.w - 16, viewport.h - 16);

            // calculate position in screen space
            positionScreen.copy(this.transform.position);
            positionScreen.applyMatrix(camera.worldToClipMatrix);

            // horizontal and vertical coordinate of the lower left corner of the pixels to copy
            screenPositionPixels.x = viewport.x + (positionScreen.x * halfViewportWidth) + halfViewportWidth - 8;
            screenPositionPixels.y = viewport.y + (positionScreen.y * halfViewportHeight) + halfViewportHeight - 8;

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