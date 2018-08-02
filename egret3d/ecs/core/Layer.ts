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
    }
    /**
     * 
     */
    export const enum DefaultNames {
        NoName = "NoName",
        Default = "default",
        Global = "global",
        Editor = "editor",
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
        Global = "global",
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
        UserLayer11 = 0x000f00
    }

    export function layerTest(cullingMask: CullingMask, layer: Layer) {
        return (cullingMask & layer) !== 0;
    }
}