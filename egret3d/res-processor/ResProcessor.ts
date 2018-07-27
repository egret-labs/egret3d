namespace RES.processor {

    function getFileName(url: string, removeEX: boolean = false): string {
        let filei = url.lastIndexOf("/");
        let file = url.substr(filei + 1);
        if (removeEX) {
            file = file.substring(0, file.indexOf("."));
        }

        return file;
    };

    function dirname(url: string): string {
        return url.substring(0, url.lastIndexOf("/"));
    }

    function getUrl(resource: RES.ResourceInfo) {
        return resource.root + resource.url;
    }

    function combinePath(base: string, relative: string): string {
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); // remove current file name (or empty string)
        // (omit if "base" is the current folder without trailing slash)
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }

    function formatUrlAndSort(assets: string[], path: string, ) {
        return assets.map(item => {
            return item;
        });
    }

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

    export const GLVertexShaderProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            let text = await host.load(resource, "text");
            let url = getUrl(resource);
            let filename = getFileName(url);
            let name = filename.substring(0, filename.indexOf("."));
            return egret3d.Shader.registerVertShader(name, text);
        },

        async onRemoveStart(host, resource) {

        }

        // getData(host, resource, key, subkey) { //可选函数

        // }

    };

    export const GLFragmentShaderProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            let text = await host.load(resource, "text");
            let url = getUrl(resource);
            let filename = getFileName(url);
            let name = filename.substring(0, filename.indexOf("."));
            return egret3d.Shader.registerFragShader(name, text);
        },

        async onRemoveStart(host, resource) {

        }

    };

    export const ShaderProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            let data = await host.load(resource, "json");
            // const url = getUrl(resource);
            let shader = new egret3d.Shader(resource.url);
            shader.$parse(data);
            paper.Asset.register(shader);

            return shader;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

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

            let url = getUrl(resource);
            let filename = getFileName(resource.url);
            let textureUrl = url.replace(filename, _name);

            let loader = new egret.ImageLoader();
            loader.load(textureUrl);
            let image = await promisify(loader, resource);
            let texture = new egret3d.Texture(resource.url);
            texture.realName = _name;
            const gl = egret3d.WebGLCapabilities.webgl;
            let t2d = new egret3d.GlTexture2D(gl, _textureFormat);
            t2d.uploadImage(image.source, _mipmap, _linear, true, _repeat);
            texture.glTexture = t2d;
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
            let gl = egret3d.WebGLCapabilities.webgl;
            // let url = getUrl(resource);
            let loader = new egret.ImageLoader();
            loader.load(resource.url);
            let image = await promisify(loader, resource);
            let _texture = new egret3d.Texture(resource.url);
            let _textureFormat = egret3d.TextureFormatEnum.RGBA;
            let t2d = new egret3d.GlTexture2D(gl, _textureFormat);
            t2d.uploadImage(image.source, true, true, true, true);
            _texture.glTexture = t2d;
            paper.Asset.register(_texture);
            return _texture;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    export const MaterialProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            // let json = await host.load(resource, "json") as egret3d.MaterialConfig
            // let material = new egret3d.Material(resource.url);

            // // const shader = paper.Asset.find<egret3d.Shader>(json.shader);
            // const shader = paper.Asset.find<egret3d.GLTFAsset>(json.shader);
            // material.setShader(shader);

            // //现根据shaderName找出对应的Technique，然后再填充
            // if (material._gltfTechnique) {
            //     const gltfTechnique = material._gltfTechnique;

            //     const mapUniform = json.mapUniform;
            //     for (let i in mapUniform) {
            //         const jsonChild = mapUniform[i];
            //         switch (jsonChild.type) {
            //             case egret3d.UniformTypeEnum.Texture:
            //                 const value = jsonChild.value;
            //                 const url = combinePath(dirname(resource.url) + "/", value)
            //                 let texture = paper.Asset.find<egret3d.Texture>(url);
            //                 if (!texture) {
            //                     const r = RES.host.resourceConfig["getResource"](url);
            //                     if (r) {
            //                         texture = await RES.getResAsync(r.name)
            //                     }
            //                     else {
            //                         texture = egret3d.DefaultTextures.GRID;
            //                     }
            //                 }
            //                 if (gltfTechnique.uniforms[i] && gltfTechnique.uniforms[i].type === gltf.UniformType.SAMPLER_2D) {
            //                     material.setTexture(i, texture);
            //                 }
            //                 else {
            //                     console.warn(`不存在的 Uniform 参数：${material.name},${i}`);
            //                 }
            //                 break;
            //             case egret3d.UniformTypeEnum.Float:
            //                 if (gltfTechnique.uniforms[i] && gltfTechnique.uniforms[i].type === gltf.UniformType.FLOAT) {
            //                     material.setFloat(i, jsonChild.value);
            //                 }
            //                 else {
            //                     console.warn(`不存在的 Uniform 参数：${material.name},${i}`);
            //                 }
            //                 break;
            //             case egret3d.UniformTypeEnum.Float4:
            //                 if (gltfTechnique.uniforms[i] && gltfTechnique.uniforms[i].type === gltf.UniformType.FLOAT_VEC4) {
            //                     material.setVector4v(i, jsonChild.value);
            //                 }
            //                 else {
            //                     console.warn(`不存在的 Uniform 参数：${material.name},${i}`);
            //                 }
            //                 break;
            //             default:
            //                 console.warn(`不支持的 Uniform 参数：${material.name},${i}`);
            //         }
            //     }
            // }


            // paper.Asset.register(material);
            // return material;
            return null;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    export const GLTFProcessor: RES.processor.Processor = {
        async onLoadStart(host, resource) {
            const result = await host.load(resource, resource.type === "GLTF" ? RES.processor.JsonProcessor : RES.processor.BinaryProcessor);
            // const url = getUrl(resource);
            const glTF = new egret3d.GLTFAsset(resource.url);

            if (resource.type === "GLTF") {
                const glTFBuffers = (result as gltf.GLTF).buffers;
                const buffers = [];

                if (glTFBuffers) {
                    for (const buffer of glTFBuffers) {
                        const url = combinePath(dirname(resource.url) + "/", buffer.uri)
                        let r = RES.host.resourceConfig["getResource"](url); // TODO
                        if (r) {
                            const buffer = await host.load(r, RES.processor.BinaryProcessor);
                            if (buffer) {
                                buffers.push(new Uint32Array(buffer));
                            }
                            else {
                                console.error("Load glTF resource error.", url);
                            }
                        }
                    }
                }
                glTF.parse(result, buffers);
                if(glTF.config.materials && glTF.config.materials.length > 0){
                    for(const mat of glTF.config.materials){
                        const values = mat.extensions.KHR_techniques_webgl.values;
                        for(const key in values){
                            const value = values[key];
                            if(typeof value === "string"){
                                const url = combinePath(dirname(resource.url) + "/", value)
                                let texture = paper.Asset.find<egret3d.Texture>(url);
                                if (!texture) {
                                    const r = RES.host.resourceConfig["getResource"](url);
                                    if (r) {
                                        texture = await RES.getResAsync(r.name)
                                    }
                                    else {
                                        texture = egret3d.DefaultTextures.GRID;
                                    }
                                }
                                values[key] = texture;
                            }
                        }
                    }
                }
               
                //
                const extensions = glTF.config.extensions;
                if (extensions && extensions.KHR_techniques_webgl) {
                    const techniques = extensions.KHR_techniques_webgl.techniques;
                    for (const technique of techniques) {
                        for (const key in technique.uniforms) {
                            const uniform = technique.uniforms[key];
                            if (uniform.type === gltf.UniformType.SAMPLER_2D) {
                                const value = uniform.value.uri;
                                const url = combinePath(dirname(resource.url) + "/", value)
                                let texture = paper.Asset.find<egret3d.Texture>(url);
                                if (!texture) {
                                    const r = RES.host.resourceConfig["getResource"](url);
                                    if (r) {
                                        texture = await RES.getResAsync(r.name)
                                    }
                                    else {
                                        texture = egret3d.DefaultTextures.GRID;
                                    }
                                }

                                uniform.value = texture;
                            }
                        }
                    }
                }

            }
            else {
                glTF.parseFromBinary(new Uint32Array(result));
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
            const prefab = new paper.Prefab(resource.url);

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
            const rawScene = new paper.RawScene(resource.url);

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
        // const list = formatUrlAndSort(data.assets, dirname(resource.url));

        await Promise.all(data.assets.map((async (item) => {
            const r = RES.host.resourceConfig["getResource"](item);
            if (r) {
                await host.load(r);
            }
        })));
    }

    RES.processor.map("GLVertexShader", GLVertexShaderProcessor);
    RES.processor.map("GLFragmentShader", GLFragmentShaderProcessor);
    RES.processor.map("Shader", ShaderProcessor);
    RES.processor.map("Texture", TextureProcessor);
    RES.processor.map("TextureDesc", TextureDescProcessor);
    // RES.processor.map("Material", MaterialProcessor);
    RES.processor.map("GLTF", GLTFProcessor);
    RES.processor.map("GLTFBinary", GLTFProcessor);
    RES.processor.map("Prefab", PrefabProcessor);
    RES.processor.map("Scene", SceneProcessor);
}