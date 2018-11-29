namespace egret3d {
    /**
     * @private
     */
    export class AnimationBinder extends paper.BaseRelease<AnimationBinder> {
        private static _instances = [] as AnimationBinder[];

        public static create() {
            let instance: AnimationBinder;
            if (this._instances.length > 0) {
                instance = this._instances.pop()!;
                instance._released = false;
            }
            else {
                instance = new AnimationBinder();
                instance.onClear();
            }

            return instance;
        }

        public dirty: uint;
        public totalWeight: number;
        public weight: number;
        public bindPose: any;

        private constructor() {
            super();
        }

        public onClear() {
            this.clear();

            this.bindPose = null!;
        }

        public clear() {
            this.dirty = 0;
            this.totalWeight = 0.0;
            this.weight = 1.0;
        }

        public updateBlend(animationLayer: AnimationLayer, animationState: AnimationState) {
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