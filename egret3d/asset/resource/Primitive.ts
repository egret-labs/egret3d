namespace egret3d.Primitive {
    /**
     * 
     */
    export const enum Type {
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
    export function create(type: Type) {
        const gameObject = paper.GameObject.create();
        const meshFilter = gameObject.addComponent(MeshFilter);
        const renderer = gameObject.addComponent(MeshRenderer);

        switch (type) {
            case Type.Axises: {
                meshFilter.mesh = DefaultMeshes.AXISES;
                renderer.material = DefaultMaterials.LINEDASHED_COLOR;
                break;
            }

            case Type.Quad:
                meshFilter.mesh = DefaultMeshes.QUAD;
                break;

            case Type.QuadParticle:
                meshFilter.mesh = DefaultMeshes.QUAD_PARTICLE;
                break;

            case Type.Plane:
                meshFilter.mesh = DefaultMeshes.PLANE;
                break;

            case Type.Cube:
                meshFilter.mesh = DefaultMeshes.CUBE;
                break;

            case Type.Pyramid:
                meshFilter.mesh = DefaultMeshes.PYRAMID;
                break;

            case Type.Cylinder:
                meshFilter.mesh = DefaultMeshes.CYLINDER;
                break;

            case Type.Sphere:
                meshFilter.mesh = DefaultMeshes.SPHERE;
                break;

            default:
                throw new Error(); // Never.
        }

        return gameObject;
    }
}