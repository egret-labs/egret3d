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
        public weight: number;
        public totalWeight: number;
        public target: paper.BaseComponent | any;
        public bindPose: any;
        public layer: AnimationLayer | null;

        public results: any[] | null;
        public resultWeight: number[] | null;

        public updateTarget: () => void;

        private constructor() {
            super();
        }

        public onClear() {
            this.clear();

            if (this.bindPose && this.bindPose.release) { // TODO
                this.bindPose.release();
            }

            this.target = null!;
            this.bindPose = null;
            this.updateTarget = null!;
            this.results = null;
            this.resultWeight = null;
        }

        public clear() {
            this.dirty = 0;
            this.weight = 1.0;
            this.totalWeight = 0.0;
            this.layer = null;
        }

        public updateBlend(animationlayer: AnimationLayer, animationState: AnimationState) {
            const globalWeight = animationState._globalWeight;

            if (this.dirty > 0) {
                if (animationlayer.additive) {
                    this.dirty++;
                    this.weight = globalWeight;

                    return true;
                }
                else if (this.layer === animationState.animationLayer) {
                    this.dirty++;
                    this.weight = globalWeight;
                    this.totalWeight += this.weight;

                    return true;
                }
                else if (this.totalWeight < 1.0 - Const.EPSILON) {
                    this.dirty++;
                    this.weight = globalWeight * (1.0 - this.totalWeight);
                    this.totalWeight += this.weight;
                    this.layer = animationState.animationLayer;

                    return true;
                }

                return false;
            }

            this.dirty++;
            this.weight = globalWeight;
            this.layer = animationState.animationLayer;

            if (!animationlayer.additive) {
                this.totalWeight += globalWeight;
            }

            return true;
        }

        public onUpdateTranslation() {
            const transforms = this.target;
            const target = (transforms as Transform).localPosition as Vector3;

            if (this.totalWeight < 1.0 - Const.EPSILON) {
                const weight = 1.0 - this.totalWeight;
                const bindPose = this.bindPose as Vector3;

                if (this.dirty > 0) {
                    target.x += bindPose.x * weight;
                    target.y += bindPose.y * weight;
                    target.z += bindPose.z * weight;
                }
                else {
                    target.x = bindPose.x * weight;
                    target.y = bindPose.y * weight;
                    target.z = bindPose.z * weight;
                }
            }

            target.update();
        }

        public onUpdateRotation() {
            const transforms = this.target;
            const target = (transforms as Transform).localRotation as Quaternion;
            const bindPose = this.bindPose as Quaternion;
            const results = this.results;

            // if (results) {
            //     let posed = false;
            //     let i = results.length;

            //     while (i--) {
            //         const result = results[i];
            //         let weight = this.resultWeight![i];

            //         if (weight < 0.0) {
            //             if (!posed) {
            //                 target.x = bindPose.x;
            //                 target.y = bindPose.y;
            //                 target.z = bindPose.z;
            //                 target.w = bindPose.w;
            //             }

            //             if (weight === -1.0) {
            //                 target.multiply(result);
            //             }
            //             else {
            //                 target.multiply(result.lerp(Quaternion.IDENTITY, result, -weight));
            //             }
            //         }
            //         else if (!posed) {
            //             if (weight === 1.0) {
            //                 target.x = result.x;
            //                 target.y = result.y;
            //                 target.z = result.z;
            //                 target.w = result.w;
            //             }
            //             else {
            //                 target.lerp(target, result, weight);
            //             }
            //         }
            //         else {
            //             target.lerp(target, result, weight);
            //             target.x
            //         }

            //         posed = true;
            //     }
            // }

            if (this.totalWeight < 1.0 - Const.EPSILON) {
                const weight = 1.0 - this.totalWeight;

                if (this.dirty > 0) {
                    target.x += bindPose.x * weight;
                    target.y += bindPose.y * weight;
                    target.z += bindPose.z * weight;
                    target.w += bindPose.w * weight;
                }
                else {
                    target.x = bindPose.x * weight;
                    target.y = bindPose.y * weight;
                    target.z = bindPose.z * weight;
                    target.w = bindPose.w * weight;
                }
            }

            target.normalize();
            target.update();
        }

        public onUpdateScale() {
            const transforms = this.target;
            const target = (transforms as Transform).localScale as Vector3;

            if (this.totalWeight < 1.0 - Const.EPSILON) {
                const weight = 1.0 - this.totalWeight;
                const bindPose = this.bindPose as Vector3;

                if (this.dirty > 0) {
                    target.x += bindPose.x * weight;
                    target.y += bindPose.y * weight;
                    target.z += bindPose.z * weight;
                }
                else {
                    target.x = bindPose.x * weight;
                    target.y = bindPose.y * weight;
                    target.z = bindPose.z * weight;
                }
            }

            target.update();
        }
    }
}