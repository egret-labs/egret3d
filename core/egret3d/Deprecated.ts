namespace paper {
    /**
     * @deprecated
     */
    export type CullingMask = Layer;
    /**
     * @deprecated
     */
    export const CullingMask = (paper as any).Layer as any;
    /**
     * @deprecated
     */
    export type RenderQueue = egret3d.RenderQueue;
    /**
     * @deprecated
     */
    export const RenderQueue = (egret3d as any).RenderQueue as any;
    /**
     * @deprecated 
     * @see paper.clock
     */
    export const Time: Clock = null!;
}

namespace gltf {
    /**
     * @deprecated
     */
    export type BlendMode = egret3d.BlendMode;
    /**
     * @deprecated
     */
    export const BlendMode = (egret3d as any).BlendMode as any;
    /**
     * @deprecated
     */
    export type MeshAttributeType = AttributeSemantics;
    /**
     * @deprecated
     */
    export const MeshAttributeType = (gltf as any).AttributeSemantics as any;
}

namespace egret3d {
    /**
     * @deprecated
     */
    export const RAD_DEG = Const.RAD_DEG;
    /**
     * @deprecated
     */
    export const DEG_RAD = Const.DEG_RAD;
    /**
     * @deprecated
     */
    export const EPSILON = Const.EPSILON;
    /**
     * @deprecated
     */
    export const floatClamp = math.clamp;
    /**
     * @deprecated
     */
    export const numberLerp = math.lerp;
    /**
     * @deprecated
     */
    export type AABB = Box;
    /**
     * @deprecated
     */
    export const AABB = Box;
    /**
     * @deprecated
     */
    export type Matrix = Matrix4;
    /**
     * @deprecated
     */
    export const Matrix = Matrix4;
    /**
     * @deprecated
     */
    export const Prefab = paper.Prefab;
    /**
     * @deprecated
     */
    export type Prefab = paper.Prefab;
    /**
     * @deprecated
     */
    export const RawScene = paper.RawScene;
    /**
     * @deprecated
     */
    export type RawScene = paper.RawScene;

    export const enum RenderQueue {
        /**
         * @deprecated
         */
        AlphaTest = Mask,
        /**
         * @deprecated
         */
        Transparent = Blend,
    }

    export const enum BlendMode {
        /**
         * @deprecated
         */
        Blend = Normal,
        /**
         * @deprecated
         */
        Blend_PreMultiply = Normal_PreMultiply,
        /**
         * @deprecated
         */
        Add = Additive,
        /**
         * @deprecated
         */
        Add_PreMultiply = Additive_PreMultiply,
    }
    /**
     * @deprecated
     * @internal
     */
    export const WebGLCapabilities = webgl.WebGLRenderState;
    /**
     * @deprecated
     */
    export const InputManager = {
        /**
         * @deprecated
         * @see egret3d.inputCollecter
         */
        mouse: {
            /**
             * @deprecated
             * @see egret3d.inputCollecter.defaultPointer.isHold()
             */
            isPressed: function (button: number) {
                const buttons = [egret3d.PointerButtonsType.LeftMouse, egret3d.PointerButtonsType.MiddleMouse, egret3d.PointerButtonsType.RightMouse];
                return egret3d.inputCollecter.defaultPointer.isHold(buttons[button]);
            },
            /**
             * @deprecated
             * @see egret3d.inputCollecter.defaultPointer.isDown()
             */
            wasPressed: function (button: number) {
                const buttons = [egret3d.PointerButtonsType.LeftMouse, egret3d.PointerButtonsType.MiddleMouse, egret3d.PointerButtonsType.RightMouse];
                return egret3d.inputCollecter.defaultPointer.isDown(buttons[button]);
            },
            /**
             * @deprecated
             * @see egret3d.inputCollecter.defaultPointer.isUp()
             */
            wasReleased: function (button: number) {
                const buttons = [egret3d.PointerButtonsType.LeftMouse, egret3d.PointerButtonsType.MiddleMouse, egret3d.PointerButtonsType.RightMouse];
                return egret3d.inputCollecter.defaultPointer.isUp(buttons[button]);
            },
        },
        /**
         * @deprecated
         * @see egret3d.inputCollecter
         */
        touch: {
            /**
             * @deprecated
             * @see egret3d.inputCollecter.defaultPointer
             */
            getTouch: function (button: number) {
                return inputCollecter.getHoldPointers()[button];
            },
        },
        /**
         * @deprecated
         * @see egret3d.inputCollecter
         */
        keyboard: {
            /**
             * @deprecated
             * @see egret3d.inputCollecter.getKey()
             */
            isPressed: function (key: string | number) {
                return egret3d.inputCollecter.getKey(key as any).isHold();
            },
            /**
             * @deprecated
             * @see egret3d.inputCollecter.getKey()
             */
            wasPressed: function (key: string | number) {
                return egret3d.inputCollecter.getKey(key as any).isUp();
            },
        },
    };
}