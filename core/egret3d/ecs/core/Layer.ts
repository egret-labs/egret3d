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
        MissingPrefab = "Missing Prefab",
    }

    /**
     * 
     */
    export const enum DefaultTags {
        Untagged = "",
        Respawn = "Respawn",
        Finish = "Finish",
        EditorOnly = "EditorOnly",
        MainCamera = "MainCamera",
        Player = "Player",
        GameController = "GameController",
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
     * 内置层级和自定义层级。
     */
    export const enum Layer {
        CullingMaskNothing = 0x00000000,
        CullingMaskEverything = 0xFFFFFFFF,

        BuiltinLayer0 = 0x0000001,
        BuiltinLayer1 = 0x0000002,
        BuiltinLayer2 = 0x0000004,
        BuiltinLayer3 = 0x0000008,
        BuiltinLayer4 = 0x0000010,
        BuiltinLayer5 = 0x0000020,
        BuiltinLayer6 = 0x0000040,
        BuiltinLayer7 = 0x0000080,

        UserLayer8 = 0x00000100,
        UserLayer9 = 0x00000200,
        UserLayer10 = 0x00000400,
        UserLayer11 = 0x00000800,
        UserLayer12 = 0x00001000,
        UserLayer13 = 0x00002000,
        UserLayer14 = 0x00004000,
        UserLayer15 = 0x00008000,
        UserLayer16 = 0x00010000,
        UserLayer17 = 0x00020000,
        UserLayer18 = 0x00040000,
        UserLayer19 = 0x00080000,
        UserLayer20 = 0x00100000,
        UserLayer21 = 0x00200000,
        UserLayer22 = 0x00400000,
        UserLayer23 = 0x00800000,
        UserLayer24 = 0x01000000,
        UserLayer25 = 0x02000000,
        UserLayer26 = 0x04000000,
        UserLayer27 = 0x08000000,
        UserLayer28 = 0x10000000,
        UserLayer29 = 0x20000000,
        UserLayer30 = 0x40000000,
        UserLayer31 = 0x80000000,

        Default = BuiltinLayer0,
        TransparentFX = BuiltinLayer1,
        IgnoreRayCast = BuiltinLayer2,
        Water = BuiltinLayer4,
        UI = BuiltinLayer5,
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
        Everything = 0xFFFFFFFF,
        Nothing = 0x000001,
        Default = 0x000002,
        UI = 0x000004,
        
        UserLayer1 = 0x000008,

        UserLayer2 = 0x000010,
        UserLayer3 = 0x000020,
        UserLayer4 = 0x000040,
        UserLayer5 = 0x000080,
        UserLayer6 = 0x000100,

        UserLayer7 = 0x000200,
        UserLayer8 = 0x000400,
        UserLayer9 = 0x000800,
        UserLayer10 = 0x001000,
        UserLayer11 = 0x002000,

        UserLayer12 = 0x004000,
        UserLayer13 = 0x008000,
        UserLayer14 = 0x010000,
        UserLayer15 = 0x020000,
        UserLayer16 = 0x040000,

        UserLayer17 = 0x080000,
        UserLayer18 = 0x100000,
        UserLayer19 = 0x200000,
        UserLayer20 = 0x400000,
        UserLayer21 = 0x800000,

        UserLayer22 = 0x01000000,
        UserLayer23 = 0x02000000,
        UserLayer24 = 0x04000000,
        UserLayer25 = 0x08000000,
        UserLayer26 = 0x10000000,
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