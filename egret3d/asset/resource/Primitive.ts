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

    export const Axises = Type.Axises;
    export const Quad = Type.Quad;
    export const QuadParticle = Type.QuadParticle;
    export const Plane = Type.Plane;
    export const Cube = Type.Cube;
    export const Pyramid = Type.Pyramid;
    export const Cylinder = Type.Cylinder;
    export const Sphere = Type.Sphere;
    /**
     * 
     */
    export function create(type: Type, name?: string, tag?: string, scene?: paper.Scene) {
        const gameObject = paper.GameObject.create(name, tag, scene);
        const meshFilter = gameObject.addComponent(MeshFilter);
        const renderer = gameObject.addComponent(MeshRenderer);

        switch (type) {
            case Type.Axises:
                meshFilter.mesh = DefaultMeshes.AXISES;
                renderer.material = DefaultMaterials.LINEDASHED_COLOR;
                break;

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