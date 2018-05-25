namespace paper {

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
}