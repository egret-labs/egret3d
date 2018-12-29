
async function main() {
    exampleStart();
    // new examples.SceneTest().start();
}

namespace examples {

    export abstract class BaseExample {
        abstract async start(): Promise<void>;

        public async addBackground(): Promise<void> {
            // Create camera.
            egret3d.Camera.main;

            { // Create light.
                const gameObject = paper.GameObject.create("Light");
                gameObject.transform.setLocalPosition(1.0, 20.0, -1.0);
                gameObject.transform.lookAt(egret3d.Vector3.ZERO);

                const light = gameObject.addComponent(egret3d.PointLight);
                light.intensity = 1.0;
            }

            const textureA = await RES.getResAsync("textures/grid_a.png") as egret3d.Texture;
            const textureB = await RES.getResAsync("textures/grid_b.png") as egret3d.Texture;

            textureA.gltfTexture.extensions.paper.anisotropy = 8;
            textureB.gltfTexture.extensions.paper.anisotropy = 8;

            const mesh = egret3d.MeshBuilder.createCube(
                40.0, 40.0, 40.0, 0.0, 20.0, 0.0, 40, 40, 40,
                false, true
            );

            const gameObject = egret3d.DefaultMeshes.createObject(mesh, "Background");
            gameObject.renderer!.materials = [
                egret3d.DefaultMaterials.MESH_LAMBERT.clone()
                    .setTexture(textureA)
                    .setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Front)
                    .setUVTransform(egret3d.Matrix3.create().fromUVTransform(0.0, 0.0, 20, 20, 0.0, 0.0, 0.0).release())
                ,
                egret3d.DefaultMaterials.MESH_LAMBERT.clone()
                    .setTexture(textureB)
                    .setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent)
                    .setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Front)
                ,
            ];
            gameObject.hideFlags = paper.HideFlags.NotTouchable;
        }
    }
}

function exampleStart() {
    const exampleString = getCurrentExampleString();
    let exampleClass: { new(): examples.BaseExample };

    if (exampleString.indexOf(".") > 0) { // Package
        const params = exampleString.split(".");
        exampleClass = (window as any).examples[params[0]][params[1]];
    }
    else {
        exampleClass = (window as any).examples[exampleString];
    }

    createGUI(exampleString);

    const exampleObj: examples.BaseExample = new exampleClass();
    exampleObj.start();

    function createGUI(exampleString: string) {
        const namespaceExamples = (window as any).examples;
        const examples: string[] = [];

        for (const k in namespaceExamples) {
            const element = namespaceExamples[k];
            if (element.constructor === Object) { // Package
                for (const kB in element) {
                    examples.push([k, kB].join("."));
                }
            }
            else {
                examples.push(k);
            }
        }

        const guiComponent = paper.GameObject.globalGameObject.getOrAddComponent(paper.editor.GUIComponent);
        const gui = guiComponent.hierarchy.addFolder("Examples");
        const options = {
            example: exampleString
        };
        gui.add(options, "example", examples).onChange((example: string) => {
            location.href = getNewUrl(example);
        });
        gui.open();
    }

    function getNewUrl(exampleString: string[] | string) {
        let url = location.href;
        const index = url.indexOf("?");
        if (index !== -1) {
            url = url.slice(0, index);
        }
        if (url.indexOf(".html") === -1) {
            url += "index.html";
        }
        url += "?example=" + exampleString;
        return url;
    }

    function getCurrentExampleString() {
        let appFile = "Test";

        let str = location.search;
        str = str.slice(1, str.length);
        const totalArray = str.split("&");
        for (let i = 0; i < totalArray.length; i++) {
            const itemArray = totalArray[i].split("=");
            if (itemArray.length === 2) {
                const key = itemArray[0];
                const value = itemArray[1];
                if (key === "example") {
                    appFile = value;
                    break;
                }
            }
        }

        return appFile;
    }
}