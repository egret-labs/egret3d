namespace egret3d {
    //TODO 本身应该是gltf资源的一部分，先放这里
    export class DefaultMaterial {
        private static _inited: boolean = false;
        public static readonly materialTemplates: { [key: string]: GLTFMaterial } = {};

        public static registerMaterial(material: GLTFMaterial) {
            this.materialTemplates[material.name] = material;
        }

        public static findMaterial(name: string) {
            if(this.materialTemplates[name]){
                return this.materialTemplates[name];
            }

            console.error("没有找到对应的material模板:" + name);
            return null;
        }


        public static init() {
            if (this._inited) {
                return;
            }

            this._inited = true;
            //
            {
                const gltfMaterial: GLTFMaterial = { name: "shader/lambert", alphaMode: "OPAQUE", doubleSided: false, extensions: { KHR_techniques_webgl: { technique: -1 } } };
                this.registerMaterial(gltfMaterial);
            }

            {
                const gltfMaterial: GLTFMaterial = { name: "diffuse.shader.json", alphaMode: "OPAQUE", doubleSided: false, extensions: { KHR_techniques_webgl: { technique: -1 } } };
                this.registerMaterial(gltfMaterial);
            }
        }
    }
}