namespace egret3d {

    // function promisify(loader: egret.HttpRequest | egret.Sound | any, resource: RES.ResourceInfo): Promise<any> {

    //     return new Promise((resolve, reject) => {
    //         let onSuccess = () => {
    //             let texture = loader['data'] ? loader['data'] : loader['response'];
    //             resolve(texture);
    //         }

    //         let onError = () => {
    //             let e = new RES.ResourceManagerError(1001, resource.url);
    //             reject(e);
    //         }
    //         loader.addEventListener(egret.Event.COMPLETE, onSuccess, this);
    //         loader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
    //     });
    // }

    export const BitmapDataProcessor: RES.processor.Processor = {

        onLoadStart(host, resource) {
            const loader = new egret.ImageLoader();
            loader.load(resource.root + resource.url);

            return new Promise((resolve, reject) => {
                const onSuccess = () => {
                    const bitmapData = loader.data;
                    loader.removeEventListener(egret.Event.COMPLETE, onSuccess, this);
                    loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
                    resolve(bitmapData);
                }

                const onError = () => {
                    loader.removeEventListener(egret.Event.COMPLETE, onSuccess, this);
                    loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
                    const e = new RES.ResourceManagerError(1001, resource.url);
                    reject(e);
                }
                loader.addEventListener(egret.Event.COMPLETE, onSuccess, this);
                loader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
            })
        },

        onRemoveStart(host, resource) {
            return Promise.resolve();
        }
    }

    export const ShaderProcessor: RES.processor.Processor = {
        async onLoadStart(host, resource) {
            const result = await host.load(resource, 'json') as GLTF;

            const shaders = result.extensions.KHR_techniques_webgl!.shaders;
            if (shaders && shaders.length === 2) {
                for (const shader of shaders) {
                    const source = (RES.host.resourceConfig as any)["getResource"](shader.uri);
                    if (source) {
                        const shaderSource = await host.load(source, "text");
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

            const glTF = Shader.create(resource.name, result);
            paper.Asset.register(glTF);

            return glTF;
        },
        onRemoveStart(host, resource) {
            const data = host.get(resource);
            data.dispose();
            // data.release();

            return Promise.resolve();
        }
    };

    export const ImageProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, "bitmapdata").then((bitmapData: egret.BitmapData) => {
                const texture = Texture
                    .create({ name: resource.name, source: bitmapData.source, format: gltf.TextureFormat.RGBA, mipmap: true })
                    .setLiner(true)
                    .setRepeat(true);
                paper.Asset.register(texture);
                return texture;
            })
        },
        onRemoveStart(host, resource) {
            const data = host.get(resource) as Texture;
            data.dispose();
            // data.release();

            return Promise.resolve();
        }
    };

    export const TextureProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, "json").then((data: {
                name: string;
                filterMode: string;
                format: string;
                mipmap: boolean;
                wrap: string;
                premultiply: any;
            }): any => {
                const name = data.name;
                const filterMode = data.filterMode;
                const format = data.format;
                const mipmap = data.mipmap;
                const wrap = data.wrap;

                let textureFormat = gltf.TextureFormat.RGBA;
                if (format === "RGB") {
                    textureFormat = gltf.TextureFormat.RGB;
                } else if (format === "Gray") {
                    textureFormat = gltf.TextureFormat.Luminance;
                }

                let linear: boolean = true;
                if (filterMode.indexOf("linear") < 0) {
                    linear = false;
                }

                let repeat: boolean = false;
                if (wrap.indexOf("Repeat") >= 0) {
                    repeat = true;
                }

                let premultiplyAlpha: 0 | 1 = 0;
                if (data["premultiply"] !== undefined) {
                    premultiplyAlpha = data["premultiply"] > 0 ? 1 : 0;
                }

                const imgResource = (RES.host.resourceConfig as any)["getResource"](name);
                if (imgResource) {
                    return host.load(imgResource, "bitmapdata").then((bitmapData: egret.BitmapData) => {
                        const texture = Texture
                            .create({ name: resource.name, source: bitmapData.source, format: textureFormat, mipmap, premultiplyAlpha })
                            .setLiner(linear)
                            .setRepeat(repeat);
                        paper.Asset.register(texture);
                        return texture;

                    });
                }
            });
        },
        onRemoveStart(host, resource) {
            const data = host.get(resource) as Texture;
            data.dispose();
            // data.release();

            return Promise.resolve();
        }
    };

    export const MaterialProcessor: RES.processor.Processor = {
        async onLoadStart(host, resource) {
            const result = await host.load(resource, 'json') as GLTF;

            if (result.materials) {
                for (const material of result.materials as GLTFMaterial[]) {
                    const techniqueRes = (RES.host.resourceConfig as any)["getResource"](material.extensions.KHR_techniques_webgl.technique);
                    if (techniqueRes && techniqueRes.indexOf("builtin/") < 0) {
                        await host.load(techniqueRes, "Shader"); // TODO
                    }

                    const values = material.extensions.KHR_techniques_webgl.values;
                    if (values) {
                        for (const k in values) {
                            const value = values[k];
                            if (value && typeof value === "string") { // A string value must be texture uri.
                                const r = (RES.host.resourceConfig as any)["getResource"](value);

                                if (r) {
                                    await host.load(r, "TextureDesc"); // TODO
                                }
                                else {
                                    console.log("Load image error.", value);
                                }
                            }
                        }
                    }
                }
            }

            const material = Material.create(resource.name, result);
            paper.Asset.register(material);

            return material;
        },
        onRemoveStart(host, resource) {
            const data = host.get(resource) as Material;
            data.dispose();
            // data.release();

            return Promise.resolve();
        }
    };

    export const MeshProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, "bin").then((result) => {
                const parseResult = GLTFAsset.parseFromBinary(result instanceof ArrayBuffer ? new Uint32Array(result) : result)!;
                const mesh = Mesh.create(resource.name, parseResult.config, parseResult.buffers);
                paper.Asset.register(mesh);
                
                return mesh;
            });
        },
        onRemoveStart(host, resource) {
            const data = host.get(resource) as Material;
            data.dispose();
            // data.release();

            return Promise.resolve();
        }
    };

    export const AnimationProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, "bin").then((result) => {
                const parseResult = GLTFAsset.parseFromBinary(new Uint32Array(result))!;
                const animation = AnimationAsset.create(resource.name, parseResult.config, parseResult.buffers);
                paper.Asset.register(animation);

                return animation;
            });
        },
        onRemoveStart(host, resource) {
            const data = host.get(resource) as AnimationAsset;
            data.dispose();
            // data.release();

            return Promise.resolve();
        }
    };

    export const PrefabProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, "json").then((data: paper.ISerializedData) => {
                return loadSubAssets(data, resource).then(() => {
                    const prefab = new paper.Prefab(data, resource.name); // TODO
                    paper.Asset.register(prefab);

                    return prefab;
                });
            });
        },
        onRemoveStart(host, resource) {
            const data = host.get(resource) as paper.Prefab;
            data.dispose();
            // data.release();

            return Promise.resolve();
        }
    };

    export const SceneProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, "json").then((data: paper.ISerializedData) => {
                return loadSubAssets(data, resource).then(() => {
                    const rawScene = new paper.RawScene(data, resource.name); // TODO
                    paper.Asset.register(rawScene);

                    return rawScene;
                });
            });
        },
        onRemoveStart(host, resource) {
            const data = host.get(resource) as paper.RawScene;
            data.dispose();
            // data.release();

            return Promise.resolve();
        }
    };

    function loadSubAssets(data: paper.ISerializedData, resource: RES.ResourceInfo) {
        return Promise.all(data.assets!.map(((item) => {
            const host = RES.host;
            const r = (host.resourceConfig as any)["getResource"](item);
            if (r) {
                return host.load(r);
            }
            else {
                if (item.indexOf("builtin/") !== 0) {
                    console.error("加载不存在的资源", item);
                }

                return Promise.resolve();
            }
        })));
    }

    function getResType(uri: string) {
        const file = uri.substr(uri.lastIndexOf("/") + 1);
        let i = file.indexOf(".", 0);
        let extname = "";

        while (i >= 0) {
            extname = file.substr(i);
            if (extname === ".assetbundle.json") {
                return 'Bundle';
            } else if (extname === ".png" || extname === ".jpg") {
                return 'Texture';
            } else if (extname === ".pvr.bin" || extname === ".pvr") {
                return 'PVR';
            } else if (extname === ".atlas.json") {
                return 'Atlas';
            } else if (extname === ".font.json") {
                return 'Font';
            } else if (extname === ".json" || extname === ".txt" || extname === ".effect.json") {
                return 'TextAsset';
            } else if (extname === ".packs.bin") {
                return 'PackBin';
            } else if (extname === ".packs.txt") {
                return 'PackTxt';
            } else if (extname === ".path.json") {
                return 'pathAsset';
            } else if (extname === ".mp3" || extname === ".ogg") {
                return 'Sound';
            } else if (extname === ".prefab.json") {
                return 'Prefab';
            } else if (extname === ".scene.json") {
                return 'Scene';
            } else if (extname === ".vs.glsl") {
                return 'text';
            } else if (extname === ".fs.glsl") {
                return 'text';
            } else if (extname === ".glsl") {
                return 'text';
            } else if (extname === ".shader.json") {
                return 'Shader';
            } else if (extname === ".image.json") {
                return 'TextureDesc';
            } else if (extname === ".mat.json") {
                return 'Material';
            } else if (extname === ".mesh.bin") {
                return 'Mesh';
            } else if (extname === ".ani.bin") {
                return 'Animation';
            }

            i = file.indexOf(".", i + 1);
        }

        return "Unknown";
    }

    async function getResByURL(uri: string, root: string) {
        return new Promise((r) => {
            RES.getResByUrl(root + uri, (data: any) => {
                paper.Asset.register(data);
                r(data);
            }, RES, getResType(uri));
        });
    }

    RES.processor.map("Shader", ShaderProcessor);
    RES.processor.map("Texture", ImageProcessor);
    RES.processor.map("TextureDesc", TextureProcessor);
    RES.processor.map("Material", MaterialProcessor);
    RES.processor.map("Mesh", MeshProcessor);
    RES.processor.map("Animation", AnimationProcessor);
    RES.processor.map("Prefab", PrefabProcessor);
    RES.processor.map("Scene", SceneProcessor);
    RES.processor.map("bitmapdata", BitmapDataProcessor);
}