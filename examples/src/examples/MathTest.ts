namespace MathTest {
    export async function start() {
        // Create camera.
        egret3d.Camera.main;

        paper.GameObject.globalGameObject.addComponent(PlaneIntersectsSphere);
    }

    class PlaneIntersectsSphere extends paper.Behaviour {
        private readonly _plane = egret3d.Plane.create();
        private readonly _sphere = egret3d.Sphere.create();
        private readonly _planeObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Plane");
        private readonly _sphereObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.SPHERE, "Sphere");

        public onAwake() {
            const material = egret3d.Material.create(egret3d.DefaultShaders.MATERIAL_COLOR);
            (this._sphereObject.renderer as egret3d.MeshRenderer).material = material;
        }

        public onUpdate() {
            this._plane.fromPoint(this._planeObject.transform.position, this._planeObject.transform.getForward().negate().release());
            this._sphere.set(this._sphereObject.transform.position, 0.5);

            const material = (this._sphereObject.renderer as egret3d.MeshRenderer).material;

            if (egret3d.planeIntersectsSphere(this._plane, this._sphere)) {
                material.setColor(egret3d.ShaderUniformNames.Diffuse, egret3d.Color.RED);
            }
            else {
                material.setColor(egret3d.ShaderUniformNames.Diffuse, egret3d.Color.GREEN);
            }
        }
    }
}