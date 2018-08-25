namespace RES.processor {

    function promisify(loader: egret.ImageLoader | egret.HttpRequest | egret.Sound, resource: RES.ResourceInfo): Promise<any> {

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

    export const ShaderProcessor: RES.processor.Processor = {
        async onLoadStart(host, resource) {
            const result = await host.load(resource, 'json') as egret3d.GLTF;

            if (result.extensions.KHR_techniques_webgl.shaders && result.extensions.KHR_techniques_webgl.shaders.length === 2) {
                const shaders = result.extensions.KHR_techniques_webgl.shaders;
                for (const shader of shaders) {
                    const source = (RES.host.resourceConfig as any)["getResource"](shader.uri);
                    if (source) {
                        const shaderSource = await host.load(source);
                        if (shaderSource) {
                            shader.uri = shaderSource;
                        }
                        else {
                            console.error("Load shader error.", shader.uri);
                        }
                    }
                }
            }
            else {
                console.error("错误的Shader格式数据");
            }

            const glTF = new egret3d.Shader(result, resource.name);
            paper.Asset.register(glTF);

            return glTF;
        },
        onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
            return Promise.resolve();
        }
    };

    export const TextureDescProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, "json").then((data) => {
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
                const imgResource = (RES.host.resourceConfig as any)["getResource"](_name);
                let loader = new egret.ImageLoader();
                loader.load(imgResource.root + imgResource.url);
                return promisify(loader, imgResource)
                    .then((image) => {
                        const texture = new egret3d.GLTexture2D(resource.name, image.source.width, image.source.height, _textureFormat);
                        texture.uploadImage(image.source, _mipmap, _linear, true, _repeat);
                        paper.Asset.register(texture);
                        return texture;
                    });
            });
        },
        onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
            return Promise.resolve();
        }
    };

    export const TextureProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            const loader = new egret.ImageLoader();
            loader.load(resource.root + resource.url);
            return promisify(loader, resource).then((image) => {
                const texture = new egret3d.GLTexture2D(resource.name, image.source.width, image.source.height, egret3d.TextureFormatEnum.RGBA);
                texture.uploadImage(image.source, true, true, true, true);
                paper.Asset.register(texture);
                return texture;
            });
        },
        onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
            return Promise.resolve();
        }
    };

    export const MaterialProcessor: RES.processor.Processor = {
        async onLoadStart(host, resource) {
            const result = await host.load(resource, 'json') as egret3d.GLTF;

            if (result.materials && result.materials.length > 0) {
                for (const mat of result.materials as egret3d.GLTFMaterial[]) {
                    const values = mat.extensions.KHR_techniques_webgl.values;
                    for (const key in values) {
                        const value = values[key];
                        if (typeof value === "string") { // A string value must be texture uri.
                            const r = (RES.host.resourceConfig as any)["getResource"](value);
                            if (r) {
                                const texture = await host.load(r, "TextureDesc");
                                values[key] = texture;
                            }
                            else {
                                console.log("Load image error.", value);
                                values[key] = egret3d.DefaultTextures.MISSING;
                            }
                        }
                    }
                }
            }

            const material = new egret3d.Material(result, resource.name);
            paper.Asset.register(material);

            return material;
        },
        onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
            return Promise.resolve();
        }
    };

    export const MeshProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, RES.processor.BinaryProcessor).then((result) => {
                const parseResult = egret3d.GLTFAsset.parseFromBinary(new Uint32Array(result));
                let glb: egret3d.GLTFAsset;

                if (parseResult.config.meshes) {
                    glb = new egret3d.Mesh(parseResult.config, parseResult.buffers, resource.name);
                }
                else {
                    glb = new egret3d.GLTFAsset();
                    glb.name = resource.name;
                    glb.config = parseResult.config;
                    for (const b of parseResult.buffers) {
                        glb.buffers.push(b);
                    }
                }

                paper.Asset.register(glb);
                return glb;
            });
        },
        onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
            return Promise.resolve();
        }
    };

    export const AnimationProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, RES.processor.BinaryProcessor).then((result) => {
                const parseResult = egret3d.GLTFAsset.parseFromBinary(new Uint32Array(result));
                const animation: egret3d.GLTFAsset = new egret3d.GLTFAsset();
                animation.name = resource.name;
                animation.config = parseResult.config;

                for (const b of parseResult.buffers) {
                    animation.buffers.push(b);
                }

                paper.Asset.register(animation);

                return animation;
            });
        },
        onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
            return Promise.resolve();
        }
    };

    export const PrefabProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, "json").then((data: paper.ISerializedData) => {
                const prefab = new paper.Prefab(resource.name);
                return loadSubAssets(data, resource).then(() => {
                    prefab.$parse(data);
                    paper.Asset.register(prefab);
                    return prefab;
                });
            });
        },
        onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
            return Promise.resolve();
        }
    };

    export const SceneProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, "json").then((data: paper.ISerializedData) => {
                const rawScene = new paper.RawScene(resource.name);
                return loadSubAssets(data, resource).then(() => {
                    rawScene.$parse(data);
                    paper.Asset.register(rawScene);
                    return rawScene;
                });
            });
        },
        onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
            return Promise.resolve();
        }
    };

    function loadSubAssets(data: paper.ISerializedData, resource: RES.ResourceInfo) {
        return Promise.all(data.assets.map(((item) => {
            const r = (RES.host.resourceConfig as any)["getResource"](item);
            if (r) {
                return host.load(r);
            }
            else {
                console.error("加载不存在的资源", item);
                return Promise.resolve();
            }
        })));
    }

    RES.processor.map("Shader", ShaderProcessor);
    RES.processor.map("Texture", TextureProcessor);
    RES.processor.map("TextureDesc", TextureDescProcessor);
    RES.processor.map("Material", MaterialProcessor);
    RES.processor.map("Mesh", MeshProcessor);
    RES.processor.map("Animation", AnimationProcessor);
    RES.processor.map("Prefab", PrefabProcessor);
    RES.processor.map("Scene", SceneProcessor);
}