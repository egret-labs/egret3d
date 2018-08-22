namespace egret3d {
    export class Shader extends GLTFAsset {
        /**
         * @internal
         */
        public _renderQueue?: number;
        /**
         * @internal
         */
        public _states?: gltf.States;
        /**
         * @internal
         */
        public _defines?: string[];
    }
}