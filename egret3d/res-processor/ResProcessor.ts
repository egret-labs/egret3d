namespace RES.processor {
    async function promisify(loader: egret.ImageLoader | egret.HttpRequest | egret.Sound, resource: RES.ResourceInfo): Promise<any> {

        return new Promise((resolve, reject) => {
            let onSuccess = () => {
                let texture = loader['data'] ? loader['data'] : loader['response'];
                resolve(texture);
            }

            let onError = () => {
                let e = new RES.ResourceManagerError(1001, resource.url);
                reject(e);
            }
            loader.addEventListener(egret.Event.COMPLETE, onSuccess, this);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
        })
    }

    export const TextureDescProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            let data = await host.load(resource, "json");

            let _name: string = data["name"];
            let _filterMode: string = data["filterMode"];
            let _format: string = data["format"];
            let _mipmap: boolean = data["mipmap"];
            let _wrap: string = data["wrap"];

            let _textureFormat = egret3d.TextureFormatEnum.RGBA;
            if (_format == "RGB") {
                _textureFormat = egret3d.TextureFormatEnum.RGB;
            } else if (_format == "Gray") {
                _textureFormat = egret3d.TextureFormatEnum.Gray;
            }

            let _linear: boolean = true;
            if (_filterMode.indexOf("linear") < 0) {
                _linear = false;
            }

            let _repeat: boolean = false;
            if (_wrap.indexOf("Repeat") >= 0) {
                _repeat = true;
            }

            const imgResource = RES.host.resourceConfig["getResource"](_name);
            let loader = new egret.ImageLoader();
            loader.load(imgResource.root + imgResource.url);
            let image = await promisify(loader, imgResource);
            const texture = new egret3d.GLTexture2D(resource.name, image.source.width, image.source.height, _textureFormat);
            texture.realName = _name;
            texture.uploadImage(image.source, _mipmap, _linear, true, _repeat);
            paper.Asset.register(texture);

            return texture;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    export const TextureProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            const loader = new egret.ImageLoader();
            loader.load(resource.root + resource.url);
            const image = await promisify(loader, resource);
            const texture = new egret3d.GLTexture2D(resource.name, image.source.width, image.source.height, egret3d.TextureFormatEnum.RGBA);
            texture.uploadImage(image.source, true, true, true, true);
            paper.Asset.register(texture);
            return texture;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    export const GLTFBinaryProcessor: RES.processor.Processor = {
        async onLoadStart(host, resource) {
            const result = await host.load(resource, RES.processor.BinaryProcessor);
            const glTF = new egret3d.GLTFAsset(resource.name);
            glTF.parseFromBinary(new Uint32Array(result));

            paper.Asset.register(glTF);
            return glTF;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }
    }

    export const GLTFProcessor: RES.processor.Processor = {
        async onLoadStart(host, resource) {
            const result = await host.load(resource, RES.processor.JsonProcessor);
            const glTF = new egret3d.GLTFAsset(resource.name);

            const buffers = [];
            glTF.parse(result, buffers);
            if (glTF.config.materials && glTF.config.materials.length > 0) {
                for (const mat of glTF.config.materials) {
                    const values = mat.extensions.KHR_techniques_webgl.values;
                    for (const key in values) {
                        const value = values[key];
                        if (typeof value === "string") {
                            const r = RES.host.resourceConfig["getResource"](value);
                            if (r) {
                                // const texture = await RES.getResAsync(r.name);
                                const texture = await host.load(r);
                                values[key] = texture;
                            }
                            else {
                                values[key] = egret3d.DefaultTextures.GRID;
                            }
                        }
                    }
                }
            }

            paper.Asset.register(glTF);

            return glTF;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    export const PrefabProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            const data: paper.ISerializedData = await host.load(resource, "json");
            // const url = getUrl(resource);
            const prefab = new paper.Prefab(resource.name);

            await loadSubAssets(data, resource)
            prefab.$parse(data);
            paper.Asset.register(prefab);

            return prefab;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }
    };

    export const SceneProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            const data: paper.ISerializedData = await host.load(resource, "json");
            // const url = getUrl(resource);
            const rawScene = new paper.RawScene(resource.name);

            await loadSubAssets(data, resource)
            rawScene.$parse(data);
            paper.Asset.register(rawScene);

            return rawScene;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }
    };

    async function loadSubAssets(data: paper.ISerializedData, resource: RES.ResourceInfo) {
        await Promise.all(data.assets.map((async (item) => {
            const r = RES.host.resourceConfig["getResource"](item);
            if (r) {
                await host.load(r);
            }
            else {
                console.error("")
            }
        })));
    }

    RES.processor.map("Texture", TextureProcessor);
    RES.processor.map("TextureDesc", TextureDescProcessor);
    RES.processor.map("GLTF", GLTFProcessor);
    RES.processor.map("GLTFBinary", GLTFBinaryProcessor);
    RES.processor.map("Prefab", PrefabProcessor);
    RES.processor.map("Scene", SceneProcessor);
}