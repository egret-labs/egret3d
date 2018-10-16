namespace examples {

    export class MathTest {
        async start() {
            // Create camera.
            egret3d.Camera.main;

            paper.GameObject.globalGameObject.addComponent(PlaneIntersectsSphere);
            paper.GameObject.globalGameObject.addComponent(LerpTest);
        }
    }

    class PlaneIntersectsSphere extends paper.Behaviour {
        private readonly _plane = egret3d.Plane.create();
        private readonly _sphere = egret3d.Sphere.create();
        private readonly _planeObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Plane");
        private readonly _sphereObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.SPHERE, "Sphere");

        public onAwake() {
            {
                const material = egret3d.Material.create(egret3d.DefaultShaders.MATERIAL_COLOR);
                material.setCullFace(false).setDepth(true, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Transparent).setOpacity(0.7);
                (this._planeObject.renderer as egret3d.MeshRenderer).material = material;
            }

            {
                const material = egret3d.Material.create(egret3d.DefaultShaders.MATERIAL_COLOR);
                material.setDepth(true, true).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Transparent).setOpacity(0.7);
                (this._sphereObject.renderer as egret3d.MeshRenderer).material = material;
            }
        }

        public onUpdate() {
            this._plane.fromPoint(this._planeObject.transform.position, this._planeObject.transform.getForward().negate().release());
            this._sphere.set(this._sphereObject.transform.position, 0.5);

            const material = (this._sphereObject.renderer as egret3d.MeshRenderer).material!;

            if (egret3d.planeIntersectsSphere(this._plane, this._sphere)) {
                material.setColor(egret3d.ShaderUniformName.Diffuse, egret3d.Color.RED);
            }
            else {
                material.setColor(egret3d.ShaderUniformName.Diffuse, egret3d.Color.GREEN);
            }
        }
    }

    class LerpTest extends paper.Behaviour {
        private readonly _lineStart: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "LineStart");
        private readonly _lineEnd: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "LineEnd");
        private readonly _lines: paper.GameObject[] = [];

        public onAwake() {
            for (let i = 0; i < 50; ++i) {
                const line = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, `Line_${i}`);
                this._lines.push(line);
            }
        }

        public onUpdate() {
            const startPosition = this._lineStart.transform.position;
            const startRotation = this._lineStart.transform.rotation;
            const endPosition = this._lineEnd.transform.position;
            const endRotation = this._lineEnd.transform.rotation;

            const position = egret3d.Vector3.create().release();
            const rotation = egret3d.Quaternion.create().release();

            for (let i = 0, l = this._lines.length; i < l; ++i) {
                const t = (i + 1) / (l + 1);
                const line = this._lines[i];

                position.lerp(t, startPosition, endPosition);
                rotation.lerp(t, startRotation, endRotation);

                line.transform.position = position;
                line.transform.rotation = rotation;
            }
        }
    }
}
