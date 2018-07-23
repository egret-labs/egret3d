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


    type TempResult = { url: string, hashCode: number, uuid: string }

    function formatUrlAndSort(assets: any[], path: string, ): TempResult[] {
        let list: TempResult[] = [];
        list = assets.map(item => {
            return { url: combinePath(path + "/", item.url), hashCode: item.hashCode, uuid: item.uuid }
        });
        return list
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
            const url = getUrl(resource);
            let shader = new egret3d.Shader(url);
            shader.$parse(data);
            paper.Asset.register(shader, true);

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
            let url = getUrl(resource);
            let filename = getFileName(url);

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

            let textureUrl = url.replace(filename, _name);

            let loader = new egret.ImageLoader();
            loader.load(textureUrl);
            let image = await promisify(loader, resource);
            let texture = new egret3d.Texture(url);
            texture.realName = _name;
            const gl = egret3d.WebGLRenderUtils.webgl;
            let t2d = new egret3d.GlTexture2D(gl, _textureFormat);
            t2d.uploadImage(image.source, _mipmap, _linear, true, _repeat);
            texture.glTexture = t2d;
            paper.Asset.register(texture, true);

            return texture;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    export const TextureProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            let gl = egret3d.WebGLRenderUtils.webgl;
            let url = getUrl(resource);
            let loader = new egret.ImageLoader();
            loader.load(url);
            let image = await promisify(loader, resource);
            let _texture = new egret3d.Texture(url);
            let _textureFormat = egret3d.TextureFormatEnum.RGBA;
            let t2d = new egret3d.GlTexture2D(gl, _textureFormat);
            t2d.uploadImage(image.source, true, true, true, true);
            _texture.glTexture = t2d;
            paper.Asset.register(_texture, true);
            return _texture;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    export const MaterialProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            let json = await host.load(resource, "json") as egret3d.MaterialConfig
            let url = getUrl(resource);
            let material = new egret3d.Material(url);

            //UniformValue已经不放在Material中，改为Technique
            let shaderName = json.shader;
            const shader = paper.Asset.find<egret3d.Shader>(shaderName);
            material.setShader(shader);

            //现根据shaderName找出对应的Technique，然后再填充
            if (material._gltfMaterial && material._gltfTechnique) {
                const gltfTechnique = material._gltfTechnique;

                const mapUniform = json.mapUniform;
                for (let i in mapUniform) {
                    const jsonChild = mapUniform[i];
                    switch (jsonChild.type) {
                        case egret3d.UniformTypeEnum.Texture:
                            const value = jsonChild.value;
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
                            if (gltfTechnique.uniforms[i] && gltfTechnique.uniforms[i].type === gltf.UniformType.SAMPLER_2D) {
                                // gltfTechnique.uniforms[i].value = texture;
                                material.setTexture(i, texture);
                            }
                            else {
                                console.warn(`不存在的 Uniform 参数：${material.url},${i}`);
                            }
                            break;
                        case egret3d.UniformTypeEnum.Float:
                            if (gltfTechnique.uniforms[i] && gltfTechnique.uniforms[i].type === gltf.UniformType.FLOAT) {
                                // gltfTechnique.uniforms[i].value = jsonChild.value;
                                material.setFloat(i, jsonChild.value);
                            }
                            else {
                                console.warn(`不存在的 Uniform 参数：${material.url},${i}`);
                            }
                            break;
                        case egret3d.UniformTypeEnum.Float4:
                            if (gltfTechnique.uniforms[i] && gltfTechnique.uniforms[i].type === gltf.UniformType.FLOAT_VEC4) {
                                // gltfTechnique.uniforms[i].value = jsonChild.value;
                                material.setVector4v(i, jsonChild.value);
                            }
                            else {
                                console.warn(`不存在的 Uniform 参数：${material.url},${i}`);
                            }
                            break;
                        default:
                            console.warn(`不支持的 Uniform 参数：${material.url},${i}`);
                    }
                }

                //找到对应的Technique TODO
                // const webglTechnique = paper.Application.sceneManager.globalGameObject.getComponent(egret3d.GLTFWebglGlTechnique);
                // if (webglTechnique) {
                //     gltfProgram.vertexShader = webglTechnique.registerShader(techniqueTemplate.vertShader);
                //     gltfProgram.fragmentShader = webglTechnique.registerShader(techniqueTemplate.fragShader);

                //     gltfTechnique.program = webglTechnique.registerProgram(gltfProgram);

                //     gltfMaterial.extensions.KHR_techniques_webgl.technique = webglTechnique.registerTechnique(gltfTechnique);
                // }
                // else{
                //     console.error("缺少GLTFWebglGlTechnique组件");
                // }
            }

            // let shaderName = json.shader;
            // const shader = paper.Asset.find<egret3d.Shader>(shaderName);
            // material.setShader(shader);
            // let mapUniform = json.mapUniform;
            // for (let i in mapUniform) {
            //     const jsonChild = mapUniform[i];
            //     switch (jsonChild.type) {
            //         case egret3d.UniformTypeEnum.Texture:
            //             const value = jsonChild.value;
            //             const url = combinePath(dirname(resource.url) + "/", value)
            //             let texture = paper.Asset.find<egret3d.Texture>(url);
            //             if (!texture) {
            //                 const r = RES.host.resourceConfig["getResource"](url);
            //                 if (r) {
            //                     texture = await RES.getResAsync(r.name)
            //                 }
            //                 else {
            //                     texture = egret3d.DefaultTextures.GRID;
            //                 }
            //             }
            //             material.setTexture(i, texture);
            //             break;
            //         case egret3d.UniformTypeEnum.Float:
            //             material.setFloat(i, jsonChild.value);
            //             break;
            //         case egret3d.UniformTypeEnum.Float4:
            //             let tempValue = jsonChild.value as [number, number, number, number];
            //             if (Array.isArray(tempValue)) {
            //                 material.setVector4v(i, tempValue)
            //             } else {
            //                 console.error("不支持的旧格式，请访问 http://developer.egret.com/cn/docs/3d/file-format/ 进行升级");
            //             }
            //             break;
            //         default:
            //             console.warn(`不支持的 Uniform 参数：${material.url},${i}`);
            //     }
            // }
            paper.Asset.register(material, true);
            return material;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    export const GLTFProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            const result = await host.load(resource, "bin");
            const url = getUrl(resource);
            const glTF = new egret3d.GLTFAsset(url);

            glTF.parseFromBinary(new Uint32Array(result));
            paper.Asset.register(glTF, true);

            return glTF;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    export const PrefabProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            const data: egret3d.PrefabConfig = await host.load(resource, "json");
            const url = getUrl(resource);
            const subassets = await loadSubAssets(data, resource)


            const prefab = new egret3d.Prefab(url);
            prefab.$parse(data, subassets);
            paper.Asset.register(prefab, true);

            return prefab;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };


    async function loadSubAssets(data: egret3d.PrefabConfig, resource: RES.ResourceInfo) {

        // load ref assets
        const assets = data.assets;
        // const result: paper.Asset[] = [];
        // if (assets) {
        //     const list = formatUrlAndSort(assets, dirname(resource.url));

        //     for (let item of list) {
        //         let r = RES.host.resourceConfig["getResource"](item.url);
        //         if (r) {
        //             let asset: paper.Asset = await host.load(r);
        //             asset.hashCode = item.hashCode;
        //             result.push(asset)
        //         }
        //     }
        // }

        let result: paper.Asset[] = [];
        const list = formatUrlAndSort(assets, dirname(resource.url));
        await Promise.all(list.map((async (item) => {
            let r = RES.host.resourceConfig["getResource"](item.url);
            if (r) {
                let asset: paper.Asset = await host.load(r);
                asset.hashCode = item.hashCode;
                asset.uuid = item.uuid;
                result.push(asset)
            }
        })))

        return result;
    }

    export const SceneProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            const data = await host.load(resource, "json");
            const url = getUrl(resource);
            const subassets = await loadSubAssets(data, resource)

            const scene = new egret3d.RawScene(url);
            scene.$parse(data, subassets);
            paper.Asset.register(scene, true);
            return scene;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    RES.processor.map("GLVertexShader", GLVertexShaderProcessor);
    RES.processor.map("GLFragmentShader", GLFragmentShaderProcessor);
    RES.processor.map("Shader", ShaderProcessor);
    RES.processor.map("Texture", TextureProcessor);
    RES.processor.map("TextureDesc", TextureDescProcessor);
    RES.processor.map("Material", MaterialProcessor);
    RES.processor.map("GLTFBinary", GLTFProcessor);
    RES.processor.map("Prefab", PrefabProcessor);
    RES.processor.map("Scene", SceneProcessor);
}