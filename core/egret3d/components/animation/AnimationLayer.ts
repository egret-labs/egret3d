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
        public totalWeight: number;
        public weight: number;
        public additivePose: any | null;

        private constructor() {
            super();
        }

        public onClear() {
            this.clear();
            
            this.additivePose = null;
        }

        public clear() {
            this.dirty = 0;
            this.totalWeight = 0.0;
            this.weight = 1.0;

            return this;
        }

        public updateLayerAndWeight(animationLayer: AnimationLayer, animationState: AnimationState) {
            const globalWeight = animationState._globalWeight;

            if (this.dirty > 0) {
                if (this.totalWeight < 1.0 - Const.EPSILON) {
                    this.dirty++;
                    this.totalWeight += globalWeight;
                    this.weight = globalWeight; // TODO

                    return true;
                }

                return false;
            }

            this.dirty++;
            this.totalWeight += globalWeight;
            this.weight = globalWeight;

            return true;
        }
    }
}