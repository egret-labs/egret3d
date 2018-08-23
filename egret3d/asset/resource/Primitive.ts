namespace egrer3d.Primitive {
    /**
     * 
     */
    export const enum PrimitiveType {
        Axises,
        Quad,
        QuadParticle,
        Plane,
        Cube,
        Pyramid,
        Cylinder,
        Sphere,
    }
    /**
     * 
     */
    export function create(type: PrimitiveType) {
        const gameObject = paper.GameObject.create();
        const meshFilter = gameObject.addComponent(egret3d.MeshFilter);
        const renderer = gameObject.addComponent(egret3d.MeshRenderer);

        switch (type) {
            case PrimitiveType.Axises: {
                meshFilter.mesh = egret3d.DefaultMeshes.AXISES;
                renderer.materials = [egret3d.DefaultMaterials.LINEDASHED_COLOR];
                break;
            }

            case PrimitiveType.Quad:
                meshFilter.mesh = egret3d.DefaultMeshes.QUAD;
                break;

            case PrimitiveType.QuadParticle:
                meshFilter.mesh = egret3d.DefaultMeshes.QUAD_PARTICLE;
                break;

            case PrimitiveType.Plane:
                meshFilter.mesh = egret3d.DefaultMeshes.PLANE;
                break;

            case PrimitiveType.Cube:
                meshFilter.mesh = egret3d.DefaultMeshes.CUBE;
                break;

            case PrimitiveType.Pyramid:
                meshFilter.mesh = egret3d.DefaultMeshes.PYRAMID;
                break;

            case PrimitiveType.Cylinder:
                meshFilter.mesh = egret3d.DefaultMeshes.CYLINDER;
                break;

            case PrimitiveType.Sphere:
                meshFilter.mesh = egret3d.DefaultMeshes.SPHERE;
                break;

            default:
                throw new Error(); // Never.
        }

        return gameObject;
    }
}