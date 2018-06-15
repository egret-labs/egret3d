namespace RES.processor {

    // 按照加载优先级排序
    enum AssetTypeEnum {
        Unknown,
        GLVertexShader,
        GLFragmentShader,
        Shader,
        Texture,
        TextureDesc,
        Material,
        GLTFBinary,
        Prefab,
        Scene
    }

    const typeMap = {
        ".vs.glsl": AssetTypeEnum.GLVertexShader,
        ".fs.glsl": AssetTypeEnum.GLFragmentShader,
        ".shader.json": AssetTypeEnum.Shader,
        ".png": AssetTypeEnum.Texture,
        ".jpg": AssetTypeEnum.Texture,
        ".imgdesc.json": AssetTypeEnum.TextureDesc,
        ".mat.json": AssetTypeEnum.Material,
        ".gltf.bin": AssetTypeEnum.GLTFBinary,
        ".glb": AssetTypeEnum.GLTFBinary,
        ".prefab.json": AssetTypeEnum.Prefab,
        ".scene.json": AssetTypeEnum.Scene
    }

    function calcType(url: string): AssetTypeEnum {
        let filei = url.lastIndexOf("/");
        let file = url.substr(filei + 1);
        let i = file.indexOf(".", 0);
        let extname = null;
        while (i >= 0) {
            extname = file.substr(i);
            if (typeMap[extname] != undefined) {
                return typeMap[extname];
            }
            i = file.indexOf(".", i + 1);
        }
        return AssetTypeEnum.Unknown;
    }

    function getFileName(url: string, removeEX: boolean = false): string {
        let filei = url.lastIndexOf("/");
        let file = url.substr(filei + 1);
        if (removeEX) {
            file = file.substring(0, file.indexOf("."));
        }

        return file;
    };

    function getPath(url: string): string {
        return url.substring(0, url.lastIndexOf("/"));
    }

    function getUrl(resource: RES.ResourceInfo) {
        return resource.root + resource.url;
    }

    function formatUrlAndSort(assets: any[], path: string, ): string[] {
        let list: { url: string, type: AssetTypeEnum }[] = [];
        list = assets.map<{ url: string, type: AssetTypeEnum }>(item => {
            return { url: egret3d.utils.combinePath(path + "/", item.url), type: calcType(item.url) }
        });
        return list.sort((a, b) => {
            return a.type - b.type;
        }).map(item => item.url);
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

    async function promisifySoundDecode(arrayBuffer: ArrayBuffer, resource: RES.ResourceInfo): Promise<any> {

        return new Promise((resolve, reject) => {
            let onSuccess = (audioBuffer) => {
                resolve(audioBuffer);
            }

            let onError = () => {
                let e = new RES.ResourceManagerError(1001, resource.url);
                reject(e);
            }
            egret3d.sound.WebAudio.instance.decodeAudioData(arrayBuffer, onSuccess, onError);
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
            let url = getUrl(resource);
            let filename = getFileName(url);
            let shader = new egret3d.Shader(filename, url);
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
            let texture = new egret3d.Texture(filename, url);
            texture.realName = _name;
            const gl = egret3d.WebGLKit.webgl;
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
            let gl = egret3d.WebGLKit.webgl;
            let url = getUrl(resource);
            let filename = getFileName(url);
            let loader = new egret.ImageLoader();
            loader.load(url);
            let image = await promisify(loader, resource);
            let _texture = new egret3d.Texture(filename, url);
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
            let data = await host.load(resource, "json");
            let url = getUrl(resource);
            let filename = getFileName(url);
            let material = new egret3d.Material(filename, url);
            material.$parse(data);
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
            const filename = getFileName(url, true);
            const glTF = new egret3d.GLTFAsset(filename, url);

            glTF.parseFromBinary(new Uint32Array(result));
            paper.Asset.register(glTF, true);

            return glTF;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    export const AtlasProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            const data = await host.load(resource, "json");
            const url = getUrl(resource);
            const filename = getFileName(url);
            let atlas = new egret3d.Atlas(filename, url);
            atlas.$parse(data);
            paper.Asset.register(atlas, true);
            return atlas;
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
            const filename = getFileName(url);
            // load ref assets
            const assets = data.assets;
            if (assets) {
                const list = formatUrlAndSort(assets, getPath(resource.url));
                for (let item of list) {
                    let r = RES.host.resourceConfig["getResource"](item);
                    if (r) {
                        let asset: paper.Asset = await host.load(r);
                    }
                }
            }

            const prefab = new egret3d.Prefab(filename, url);
            prefab.$parse(data);
            paper.Asset.register(prefab, true);

            return prefab;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    export const SceneProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            const data = await host.load(resource, "json");
            const url = getUrl(resource);
            const filename = getFileName(url);

            // load ref assets
            const assets = data.assets;
            if (assets) {
                const list = formatUrlAndSort(assets, getPath(resource.url));
                for (let item of list) {
                    let r = RES.host.resourceConfig["getResource"](item);
                    if (r) {
                        let asset: paper.Asset = await host.load(r);
                    }
                }
            }

            const scene = new egret3d.RawScene(filename, url);
            scene.$parse(data);
            paper.Asset.register(scene, true);

            return scene;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    export const Font3DProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            const data = await host.load(resource, "json");
            const url = getUrl(resource);
            const filename = getFileName(url);
            const font = new egret3d.Font(filename, url);
            font.$parse(data);
            paper.Asset.register(font, true);
            return font;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    export const Sound3DProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            let arrayBuffer: ArrayBuffer = await host.load(resource, "bin");
            let url = getUrl(resource);
            let filename = getFileName(url);
            let audioBuffer: AudioBuffer = await promisifySoundDecode(arrayBuffer, resource);
            let sound = new egret3d.Sound(filename, url);
            sound.buffer = audioBuffer;
            paper.Asset.register(sound, true);
            return sound;
        },

        async onRemoveStart(host, resource) {
            let data = host.get(resource);
            data.dispose();
        }

    };

    export const PathAssetProcessor: RES.processor.Processor = {

        async onLoadStart(host, resource) {
            const data = await host.load(resource, "json");
            const url = getUrl(resource);
            const filename = getFileName(url);
            const pathAsset = new egret3d.PathAsset(filename, url);
            pathAsset.$parse(data);
            paper.Asset.register(pathAsset, true);
            return pathAsset;
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
    RES.processor.map("Atlas", AtlasProcessor);
    RES.processor.map("Font", Font3DProcessor);
    RES.processor.map("pathAsset", PathAssetProcessor);
    RES.processor.map("Sound", Sound3DProcessor);
}