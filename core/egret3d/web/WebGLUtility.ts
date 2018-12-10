namespace egret3d.web {
    /**
     * @internal
     */
    export function isPowerOfTwo(width: number, height: number): boolean {
        return math.isPowerOfTwo(width) && math.isPowerOfTwo(height);
    }
    /**
     * @internal
     */
    export function filterFallback(f: gltf.TextureFilter): gltf.TextureFilter {
        if (f === gltf.TextureFilter.NEAREST || f === gltf.TextureFilter.NEAREST_MIPMAP_NEAREST || f === gltf.TextureFilter.NEAREST_MIPMAP_LINEAR) {
            return gltf.TextureFilter.NEAREST;
        }

        return gltf.TextureFilter.LINEAR;
    }
    /**
     * @internal
     */
    export function setTexturexParameters(isPowerOfTwo: boolean, sampler: gltf.Sampler) {
        const webgl = WebGLRenderState.webgl!;
        const magFilter = sampler.magFilter!;
        const minFilter = sampler.minFilter!;
        const wrapS = sampler.wrapS!;
        const wrapT = sampler.wrapT!;
        if (isPowerOfTwo) {
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, magFilter);
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, minFilter);

            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, wrapS);
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, wrapT);
        }
        else {
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);

            if (wrapS !== gltf.TextureWrap.CLAMP_TO_EDGE || wrapT !== gltf.TextureWrap.CLAMP_TO_EDGE) {
                console.warn('Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to gltf.TextureWrap.CLAMP_TO_EDGE.');
            }

            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, filterFallback(magFilter));
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, filterFallback(minFilter));

            if (minFilter !== gltf.TextureFilter.NEAREST && minFilter !== gltf.TextureFilter.LINEAR) {
                console.warn('Texture is not power of two. Texture.minFilter should be set to gltf.TextureFilter.NEAREST or gltf.TextureFilter.LINEAR.');
            }
        }

        //TODO EXT_texture_filter_anisotropic
    }
}