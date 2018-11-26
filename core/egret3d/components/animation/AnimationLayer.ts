namespace egret3d {
    /**
     * @private
     */
    export class BlendLayer extends paper.BaseRelease<BlendLayer> {
        private static _instances = [] as BlendLayer[];

        public static create() {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!;
                instance._released = false;
                return instance;
            }

            return new BlendLayer().clear();
        }

        public dirty: uint;
        public layer: int;
        public leftWeight: number;
        public layerWeight: number;
        public blendWeight: number;

        private constructor() {
            super();
        }

        public onClear() {
            this.clear();
        }

        public clear() {
            this.dirty = 0;
            this.layer = 0;
            this.leftWeight = 0.0;
            this.layerWeight = 0.0;
            this.blendWeight = 0.0;

            return this;
        }

        public updateLayerAndWeight(animationLayer: AnimationLayer, animationState: AnimationState) {
            const additive = animationState.additive;
            const animationLayer = animationState.layer;
            let animationWeight = animationState._globalWeight;

            if (this.dirty > 0) {
                if (this.leftWeight > Const.EPSILON) {
                    if (!additive && this.layer !== animationLayer) {
                        if (this.layerWeight >= this.leftWeight) {
                            this.leftWeight = 0.0;

                            return false;
                        }

                        this.layer = animationLayer;
                        this.leftWeight -= this.layerWeight;
                        // this.layerWeight = animationWeight * this.leftWeight;
                        this.layerWeight = 0.0;
                    }

                    animationWeight *= this.leftWeight;
                    this.dirty++;
                    this.blendWeight = animationWeight;
                    this.layerWeight += animationWeight;

                    return true;
                }

                return false;
            }

            this.dirty++;
            this.layer = animationLayer;
            this.leftWeight = 1.0;
            this.layerWeight = animationWeight;
            this.blendWeight = animationWeight;

            return true;
        }
    }
}