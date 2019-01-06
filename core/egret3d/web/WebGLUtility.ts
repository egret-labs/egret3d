namespace egret3d.webgl {
    /**
     * @internal
     */
    export function setTexturexParameters(type: gltf.TextureType, sampler: gltf.Sampler, anisotropy: number) {
        const webgl = WebGLRenderState.webgl!;

        webgl.texParameteri(type, gltf.WebGL.TEXTURE_MAG_FILTER, sampler.magFilter!);
        webgl.texParameteri(type, gltf.WebGL.TEXTURE_MIN_FILTER, sampler.minFilter!);
        webgl.texParameteri(type, gltf.WebGL.TEXTURE_WRAP_S, sampler.wrapS!);
        webgl.texParameteri(type, gltf.WebGL.TEXTURE_WRAP_T, sampler.wrapT!);

        if (renderState.textureFilterAnisotropic && anisotropy > 1) {
            webgl.texParameterf(type, renderState.textureFilterAnisotropic.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(anisotropy, renderState.maxAnisotropy));
        }
    }
}