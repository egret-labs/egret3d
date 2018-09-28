namespace helper {
    let resLoaded = false;

    function getResType(uri: string) {
        let file = uri.substr(uri.lastIndexOf("/") + 1);
        let i = file.indexOf(".", 0);
        let extname = "";

        while (i >= 0) {
            extname = file.substr(i);
            if (extname == ".vs.glsl") {
                return 'GLVertexShader';
            } else if (extname == ".assetbundle.json") {
                return 'Bundle';
            } else if (extname == ".fs.glsl") {
                return 'GLFragmentShader';
            } else if (extname == ".png" || extname == ".jpg") {
                return 'Texture';
            } else if (extname == ".pvr.bin" || extname == ".pvr") {
                return 'PVR';
            } else if (extname == ".prefab.json") {
                return 'Prefab';
            } else if (extname == ".scene.json") {
                return 'Scene';
            } else if (extname == ".atlas.json") {
                return 'Atlas';
            } else if (extname == ".font.json") {
                return 'Font';
            } else if (extname == ".json" || extname == ".txt" || extname == ".effect.json") {
                return 'TextAsset';
            } else if (extname == ".packs.bin") {
                return 'PackBin';
            } else if (extname == ".packs.txt") {
                return 'PackTxt';
            } else if (extname == ".path.json") {
                return 'pathAsset';
            } else if (extname == ".mp3" || extname == ".ogg") {
                return 'Sound';
            } else if (extname == ".shader.json") {
                return 'Shader';
            } else if (extname == ".image.json") {
                return 'TextureDesc';
            } else if (extname == ".mat.json") {
                return 'Material';
            } else if (extname == ".mesh.bin") {
                return 'Mesh';
            } else if (extname == ".ani.bin") {
                return 'Animation';
            }

            i = file.indexOf(".", i + 1);
        }

        return "Unknown";
    }
    /**
     * @internal
     */
    export async function getResAsync(uri: string, root: string = "resource/") {
        if (!resLoaded) {
            await RES.loadConfig("resource/default.res.json", root);
            resLoaded = true;
        }

        return new Promise((r) => {
            RES.getResByUrl(root + uri, (data: any) => {
                paper.Asset.register(data);
                r();
            }, RES, getResType(uri));
        });
    }
}