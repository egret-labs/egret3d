namespace paper {
    /**
     * 
     */
    export const enum HideFlags {
        /**
         * 
         */
        None,
        /**
         * 
         */
        NotEditable,
        /**
         * 
         */
        Hide,
        /**
         * 
         */
        HideAndDontSave,
    }
    /**
     * 
     */
    export const enum DefaultNames {
        NoName = "NoName",
        Global = "Global",
        MainCamera = "Main Camera",
        EditorCamera = "Editor Camera",
        EditorOnly = "Editor Only",
    }
    /**
     * 
     */
    export const enum DefaultTags {
        Untagged = "",
        Respawn = "Respawn",
        Finish = "Finish",
        EditorOnly = "Editor Only",
        MainCamera = "Main Camera",
        Player = "Player",
        GameController = "Game Controller",
        Global = "Global",
    }
    /**
     * 系统排序。
     */
    export const enum SystemOrder {
        Begin = 0,
        Enable = 1000,
        Start = 2000,
        FixedUpdate = 3000,
        Update = 4000,
        Animation = 5000,
        LaterUpdate = 6000,
        Renderer = 7000,
        Draw = 8000,
        Disable = 9000,
        End = 10000,
    }
    /**
     * 渲染排序。
     */
    export const enum RenderQueue {
        Background = 1000,
        Geometry = 2000,
        AlphaTest = 2450,
        Transparent = 3000,
        Overlay = 4000,
    }
    /**
     * 这里暂未实现用户自定义层级，但用户可以使用预留的UserLayer。
     * 这个属性可以实现相机的选择性剔除。
     */
    export const enum Layer {
        Default = 0x000002,
        UI = 0x000004,
        UserLayer1 = 0x000008,
        UserLayer2 = 0x000010,
        UserLayer3 = 0x000020,
        UserLayer4 = 0x000040,
        UserLayer5 = 0x000080,
        UserLayer6 = 0x0000f0,
        UserLayer7 = 0x000100,
        UserLayer8 = 0x000200,
        UserLayer9 = 0x000400,
        UserLayer10 = 0x000800,
        UserLayer11 = 0x000f00,
    }
    /**
     * culling mask
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * culling mask 枚举。
     * 相机的cullingmask与renderer的renderLayer相匹配，才会执行渲染。否则将会被跳过。
     * 这个属性可以实现相机的选择性剔除。
     * @version paper 1.0
     * @platform Web
     * @language
     */
    export const enum CullingMask {
        Everything = 0xFFFFFF,
        Nothing = 0x000001,
        Default = 0x000002,
        UI = 0x000004,
        UserLayer1 = 0x000008,
        UserLayer2 = 0x000010,
        UserLayer3 = 0x000020,
        UserLayer4 = 0x000040,
        UserLayer5 = 0x000080,
        UserLayer6 = 0x0000f0,
        UserLayer7 = 0x000100,
        UserLayer8 = 0x000200,
        UserLayer9 = 0x000400,
        UserLayer10 = 0x000800,
        UserLayer11 = 0x000f00,
    }
    // /**
    //  * 
    //  * @param cullingMask 
    //  * @param layer 
    //  */
    // export function layerTest(cullingMask: CullingMask, layer: Layer) {
    //     return (cullingMask & layer) !== 0;
    // }
    // /**
    //  * 
    //  * @param cullingMask 
    //  * @param layer 
    //  */
    // export function removeLayer(cullingMask: CullingMask, layer: Layer) {
    //     return cullingMask & ~layer;
    // }
}