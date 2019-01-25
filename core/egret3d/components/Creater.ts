namespace egret3d.creater {
    /**
     * 根据提供的参数，快速创建一个带有网格渲染组件的实体。
     */
    export function createGameObject(name: string = paper.DefaultNames.NoName, {
        tag = paper.DefaultTags.Untagged,
        scene = null,
        mesh = null,
        material = null,
        materials = null,
        castShadows = false,
        receiveShadows = false,
    }: {
        tag?: paper.DefaultTags | string,
        scene?: paper.Scene | null,
        mesh?: Mesh | null,
        material?: Material | null,
        materials?: ReadonlyArray<Material> | null,
        castShadows?: boolean,
        receiveShadows?: boolean,
    } = {}) {
        const gameObject = paper.GameObject.create(name, tag, scene);
        const meshFilter = gameObject.addComponent(MeshFilter);
        const meshRenderer = gameObject.addComponent(MeshRenderer);
        meshRenderer.castShadows = castShadows;
        meshRenderer.receiveShadows = receiveShadows;

        if (mesh) {
            meshFilter.mesh = mesh;
        }

        if (materials) {
            meshRenderer.materials = materials;
        }
        else if (material) {
            meshRenderer.material = material;
        }

        return gameObject;
    }
}