namespace egret3d {
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
    /**
     * @deprecated
     */
    export const InputManager = {
        /**
         * @deprecated
         * @see egret3d.inputCollecter
         */
        keyboard: {
            /**
             * @deprecated
             * @see egret3d.inputCollecter.getKey()
             */
            isPressed: function (key: string) {
                return egret3d.inputCollecter.getKey("Key" + key.toUpperCase()).isHold();
            },
            /**
             * @deprecated
             * @see egret3d.inputCollecter.getKey()
             */
            wasPressed: function (key: string) {
                return egret3d.inputCollecter.getKey("Key" + key.toUpperCase()).isUp();
            },
        }
    };
}