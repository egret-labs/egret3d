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

    const _onlyImages: { [key: string]: boolean } = {};

    function _transformGLSLCode(code: string) {
        const transformedCode = code
            .replace(/\r/g, '\n') // \r to \n
            .replace(/[ \t]*\/\/.*\n/g, '\n') // remove //
            .replace(/[ \t]*\/\*[\s\S]*?\*\//g, '\n') // remove /* */
            .replace(/\n{2,}/g, '\n'); // \n+ to \n

        return transformedCode;
    }

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
                };

                const onError = () => {
                    loader.removeEventListener(egret.Event.COMPLETE, onSuccess, this);
                    loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
                    const e = new RES.ResourceManagerError(1001, resource.url);
                    reject(e);
                };
                loader.addEventListener(egret.Event.COMPLETE, onSuccess, this);
                loader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
            });
        },

        onRemoveStart(host, resource) {
            return Promise.resolve();
        }
    };

    export const ShaderProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, 'json').then((result: GLTF) => {
                const subAssets: paper.ISerializedData = { assets: [] };
                const shaders = result.extensions.KHR_techniques_webgl!.shaders;

                for (const shader of shaders) {
                    subAssets.assets!.push(shader.uri!);
                }

                return loadSubAssets(subAssets, resource).then((texts: string[]) => {
                    for (let i = 0, l = texts.length; i < l; ++i) {
                        shaders[i].uri = _transformGLSLCode(texts[i]);
                    }

                    const shader = Shader.create(resource.name, result);
                    paper.Asset.register(shader);
                    return shader;
                });
            });
        },
        onRemoveStart(host, resource) {
            const data = host.get(resource) as paper.Asset;
            if (data) {
                data.dispose();
            }

            return Promise.resolve();
        }
    };

    export const ImageProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, "bitmapdata").then((bitmapData: egret.BitmapData) => {
                if (_onlyImages[resource.name]) {
                    delete _onlyImages[resource.name];

                    return bitmapData.source;
                }

                const texture = Texture
                    .create({ name: resource.name, source: bitmapData.source })
                    .setLiner(true)
                    .setRepeat(true)
                    .setMipmap(true);
                paper.Asset.register(texture);

                return texture;
            });
        },
        onRemoveStart(host, resource) {
            const data = host.get(resource) as paper.Asset;
            if (data) {
                data.dispose();
            }

            return Promise.resolve();
        }
    };

    type ImageConfig = {
        name: string;
        filterMode: string;
        format: string;
        mipmap: boolean;
        wrap: string;
        premultiply: any;
        anisotropy: any;
    };

    export const TextureProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, "json").then((data: ImageConfig | GLTF): any => {
                if ("asset" in data) {
                    const glTFData = data as GLTF;
                    const glTFImage = glTFData.images![glTFData.textures![0].source!];

                    if (glTFImage.uri !== undefined) {
                        const subAssets: paper.ISerializedData = { assets: [] };

                        if (Array.isArray(glTFImage.uri)) {
                            if (glTFImage.uri.length > 0) {
                                for (const uri of glTFImage.uri) {
                                    _onlyImages[uri] = true;
                                    subAssets.assets!.push(uri);
                                }
                            }
                            else {
                                if (DEBUG) {
                                    console.error("Invalid image uri.");
                                }

                                // TODO 根据纹理类型填充 MISS 的数据。
                            }
                        }
                        else if (glTFImage.uri.length > 0) {
                            _onlyImages[glTFImage.uri] = true;
                            subAssets.assets!.push(glTFImage.uri);
                        }
                        else if (DEBUG) {
                            console.error("Invalid image uri.");
                            // TODO 根据纹理类型填充 MISS 的数据。
                        }

                        return loadSubAssets(subAssets, resource).then((images: gltf.ImageSource[]) => {
                            if (Array.isArray(glTFImage.uri!)) {
                                glTFImage.extras = { data: [] };

                                for (let i = 0, l = subAssets.assets!.length; i < l; ++i) {
                                    const imageSource = images[i];
                                    (glTFImage.extras.data as gltf.ImageSource[])[i] = imageSource;
                                    host.save((RES.host.resourceConfig as any)["getResource"](subAssets.assets![i]), imageSource);
                                }
                            }
                            else {
                                const imageSource = images[0];
                                glTFImage.extras = { data: imageSource };
                                host.save((RES.host.resourceConfig as any)["getResource"](subAssets.assets![0]), imageSource);
                            }

                            const texture = Texture.create(resource.name, glTFData, null);
                            paper.Asset.register(texture);

                            return texture;
                        });
                    }
                }
                else {
                    const dataB = data as ImageConfig;
                    const name = dataB.name;
                    const filterMode = dataB.filterMode;
                    const format = dataB.format;
                    const mipmap = dataB.mipmap;
                    const wrap = dataB.wrap;

                    let textureFormat = gltf.TextureFormat.RGBA;
                    const exr = name.substring(name.lastIndexOf("."));//兼容以前的
                    if (format === "RGB" || exr === ".jpg") {
                        textureFormat = gltf.TextureFormat.RGB;
                    }
                    else if (format === "Gray") {
                        textureFormat = gltf.TextureFormat.Luminance;
                    }
                    //Trilinear   Bilinear
                    let linear: FilterMode = FilterMode.Point;
                    if (filterMode.indexOf("Trilinear") >= 0) {
                        linear = FilterMode.Trilinear;
                    }
                    else if (filterMode.indexOf("Bilinear") >= 0) {
                        linear = FilterMode.Bilinear;
                    }

                    let repeat: boolean = false;
                    if (wrap.indexOf("Repeat") >= 0) {
                        repeat = true;
                    }

                    let anisotropy: uint = 1;
                    if (dataB.anisotropy !== undefined) {
                        anisotropy = dataB.anisotropy;
                    }

                    let premultiplyAlpha: 0 | 1 = 0;
                    if (dataB.premultiply !== undefined) {
                        premultiplyAlpha = dataB.premultiply > 0 ? 1 : 0;
                    }

                    // const subAssets: paper.ISerializedData = { assets: [name] };
                    // _onlyImages[name as string] = true;

                    // return loadSubAssets(subAssets, resource).then((images: gltf.ImageSource[]) => {
                    //     const texture = Texture
                    //         .create({ name: resource.name, source: images[0], format: textureFormat, premultiplyAlpha, anisotropy })
                    //         .setLiner(linear)
                    //         .setMipmap(mipmap)
                    //         .setRepeat(repeat);
                    //     paper.Asset.register(texture);
                    //     host.save((RES.host.resourceConfig as any)["getResource"](name), images[0]); // TODO

                    //     return texture;
                    // });

                    const imgResource = (RES.host.resourceConfig as any)["getResource"](name);
                    if (imgResource) {
                        return host.load(imgResource, "bitmapdata").then((bitmapData: egret.BitmapData) => {
                            const texture = Texture
                                .create({ name: resource.name, source: bitmapData.source, format: textureFormat, premultiplyAlpha, anisotropy })
                                .setLiner(linear)
                                .setMipmap(mipmap)
                                .setRepeat(repeat);
                            paper.Asset.register(texture);
                            host.save(imgResource, bitmapData);
                            (texture as any)._bitmapData = bitmapData; // TODO

                            return texture;
                        });
                    }
                    else {
                        throw new Error(); // TODO
                    }
                }
            });
        },
        onRemoveStart(host, resource) {
            const data = host.get(resource) as paper.Asset;
            if (data) {
                // host.save(imgResource, bitmapData);
                data.dispose();
            }

            return Promise.resolve();
        }
    };

    export const MaterialProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, "json").then((result: GLTF): any => {
                const subAssets: paper.ISerializedData = { assets: [] };

                for (const materialConfig of result.materials as GLTFMaterial[]) {
                    subAssets.assets!.push(materialConfig.extensions.KHR_techniques_webgl.technique);

                    const values = materialConfig.extensions.KHR_techniques_webgl.values;
                    if (values) {
                        for (const k in values) {
                            const value = values[k];
                            if (value && typeof value === "string") { // A string value must be texture uri.
                                subAssets.assets!.push(value);
                            }
                        }
                    }
                }

                return loadSubAssets(subAssets, resource).then(() => {
                    const material = Material.create(resource.name, result);
                    paper.Asset.register(material);

                    return material;
                });
            });
        },
        onRemoveStart(host, resource) {
            const data = host.get(resource) as paper.Asset;
            if (data) {
                data.dispose();
            }

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
            const data = host.get(resource) as paper.Asset;
            if (data && data.dispose) { // TODO???
                data.dispose();
            }

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
            const data = host.get(resource) as paper.Asset;
            if (data) {
                data.dispose();
            }

            return Promise.resolve();
        }
    };

    export const PrefabProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, "json").then((data: paper.ISerializedData) => {
                return loadSubAssets(data, resource).then(() => {
                    const prefab = new paper.Prefab(data, resource.name); // TODO
                    prefab.initialize();
                    paper.Asset.register(prefab);

                    return prefab;
                });
            });
        },
        onRemoveStart(host, resource) {
            const data = host.get(resource) as paper.Asset;
            if (data) {
                data.dispose();
            }

            return Promise.resolve();
        }
    };

    export const SceneProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, "json").then((data: paper.ISerializedData) => {
                return loadSubAssets(data, resource).then(() => {
                    const rawScene = new paper.RawScene(data, resource.name); // TODO
                    rawScene.initialize();
                    paper.Asset.register(rawScene);

                    return rawScene;
                });
            });
        },
        onRemoveStart(host, resource) {
            const data = host.get(resource) as paper.Asset;
            if (data) {
                data.dispose();
            }

            return Promise.resolve();
        }
    };

    function loadSubAssets(data: paper.ISerializedData, resource: RES.ResourceInfo) {
        return Promise.all(data.assets!.map(((item) => {
            const host = RES.host;
            const r = (host.resourceConfig as any)["getResource"](item);
            if (r) {
                return host.load(r).then((data) => {
                    if (data instanceof paper.Asset) { //!??!?!?
                        host.save(r, data);
                    }

                    return data;
                });
            }
            else {
                if (item.indexOf("builtin/") !== 0) {
                    console.error("加载不存在的资源", item);
                }

                return Promise.resolve();
            }
        })));
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