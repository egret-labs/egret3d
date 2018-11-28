namespace egret3d {
    const _helpQuaternionA = Quaternion.create();
    const _helpQuaternionB = Quaternion.create();
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

        public static onUpdateTranslation(channel: AnimationChannel, animationlayer: AnimationLayer, animationState: AnimationState) {
            const additive = animationlayer.additive;
            const interpolation = channel.glTFSampler.interpolation;
            const currentTime = animationState._currentTime;
            const outputBuffer = channel.outputBuffer;
            const binder = channel.binder;
            const frameIndex = channel.getFrameIndex(currentTime);

            let x: number, y: number, z: number;

            if (frameIndex >= 0) {
                let offset = frameIndex * 3;
                x = outputBuffer[offset++];
                y = outputBuffer[offset++];
                z = outputBuffer[offset++];

                if (!interpolation || interpolation !== "STEP") {
                    const inputBuffer = channel.inputBuffer;
                    const frameStart = inputBuffer[frameIndex];
                    const progress = (currentTime - frameStart) / (inputBuffer[frameIndex + 1] - frameStart);
                    x += (outputBuffer[offset++] - x) * progress;
                    y += (outputBuffer[offset++] - y) * progress;
                    z += (outputBuffer[offset++] - z) * progress;
                }
            }
            else {
                x = outputBuffer[0];
                y = outputBuffer[1];
                z = outputBuffer[2];
            }

            if (additive) {
                x -= outputBuffer[0];
                y -= outputBuffer[1];
                z -= outputBuffer[2];
            }

            const isArray = Array.isArray(binder.components);
            const weight = binder.weight;
            const target = (isArray ? (binder.components as Transform[])[0].localPosition : (binder.components as Transform).localPosition) as Vector3;

            if (binder.dirty > 1) {
                target.x += x * weight;
                target.y += y * weight;
                target.z += z * weight;
            }
            else {
                if (weight !== 1.0) {
                    target.x = x * weight;
                    target.y = y * weight;
                    target.z = z * weight;
                }
                else {
                    target.x = x;
                    target.y = y;
                    target.z = z;
                }
            }

            if (channel.isEnd) {
                if (binder.totalWeight < 1.0 - Const.EPSILON) {
                    const weight = 1.0 - binder.totalWeight;
                    const bindPose = binder.bindPose as Vector3;
                    target.x += bindPose.x * weight;
                    target.y += bindPose.y * weight;
                    target.z += bindPose.z * weight;
                }

                if (isArray) {
                    for (const component of binder.components as Transform[]) {
                        component.localPosition = target;
                    }
                }
                else {
                    target.update();
                }
            }
        }

        public static onUpdateRotation(channel: AnimationChannel, animationlayer: AnimationLayer, animationState: AnimationState) {
            const helpQuaternionA = _helpQuaternionA;
            const helpQuaternionB = _helpQuaternionB;
            const additive = animationlayer.additive;
            const interpolation = channel.glTFSampler.interpolation;
            const currentTime = animationState._currentTime;
            const outputBuffer = channel.outputBuffer;
            const binder = channel.binder;
            const frameIndex = channel.getFrameIndex(currentTime);

            let x: number, y: number, z: number, w: number;

            if (frameIndex >= 0) {
                let offset = frameIndex * 4;
                x = outputBuffer[offset++];
                y = outputBuffer[offset++];
                z = outputBuffer[offset++];
                w = outputBuffer[offset++];

                if (!interpolation || interpolation !== "STEP") {
                    const inputBuffer = channel.inputBuffer;
                    const frameStart = inputBuffer[frameIndex];
                    const progress = (currentTime - frameStart) / (inputBuffer[frameIndex + 1] - frameStart);
                    x += (outputBuffer[offset++] - x) * progress;
                    y += (outputBuffer[offset++] - y) * progress;
                    z += (outputBuffer[offset++] - z) * progress;
                    w += (outputBuffer[offset++] - w) * progress;
                }
            }
            else {
                x = outputBuffer[0];
                y = outputBuffer[1];
                z = outputBuffer[2];
                w = outputBuffer[3];
            }

            if (additive) {
                helpQuaternionA.fromArray(outputBuffer).multiply(helpQuaternionB.set(x, y, z, w)).inverse();
            }

            const isArray = Array.isArray(binder.components);
            let weight = binder.weight;
            const target = (isArray ? (binder.components as Transform[])[0].localRotation : (binder.components as Transform).localRotation) as Quaternion;

            if (binder.dirty > 1) {
                if (additive) {
                    target.multiply(helpQuaternionA.lerp(Quaternion.IDENTITY, helpQuaternionA, weight));
                }
                else {
                    if (_helpQuaternionA.set(x, y, z, w).dot(target) < 0.0) {
                        weight = -weight;
                    }

                    target.x += x * weight;
                    target.y += y * weight;
                    target.z += z * weight;
                    target.w += w * weight;
                }
            }
            else if (additive) { // TODO
                const bindPose = binder.bindPose as Quaternion;
                target.x = bindPose.x;
                target.y = bindPose.y;
                target.z = bindPose.z;
                target.w = bindPose.w;

                if (weight !== 1.0) {
                    target.multiply(helpQuaternionA.lerp(Quaternion.IDENTITY, helpQuaternionA, weight));
                }
                else {
                    target.multiply(helpQuaternionA);
                }
            }
            else if (weight !== 1.0) {
                target.x = x * weight;
                target.y = y * weight;
                target.z = z * weight;
                target.w = w * weight;
            }
            else {
                target.x = x;
                target.y = y;
                target.z = z;
                target.w = w;
            }

            if (channel.isEnd) {
                if (binder.totalWeight < 1.0 - Const.EPSILON) {
                    const weight = 1.0 - binder.totalWeight;
                    const bindPose = binder.bindPose as Quaternion;
                    target.x += bindPose.x * weight;
                    target.y += bindPose.y * weight;
                    target.z += bindPose.z * weight;
                    target.w += bindPose.w * weight;
                }

                if (isArray) {
                    for (const component of binder.components as Transform[]) {
                        component.localRotation = target;
                    }
                }
                else {
                    target.update();
                }
            }
        }

        public static onUpdateScale(channel: AnimationChannel, animationlayer: AnimationLayer, animationState: AnimationState) {
            const additive = animationlayer.additive;
            const interpolation = channel.glTFSampler.interpolation;
            const currentTime = animationState._currentTime;
            const outputBuffer = channel.outputBuffer;
            const binder = channel.binder;
            const frameIndex = channel.getFrameIndex(currentTime);

            let x: number, y: number, z: number;

            if (frameIndex >= 0) {
                let offset = frameIndex * 3;
                x = outputBuffer[offset++];
                y = outputBuffer[offset++];
                z = outputBuffer[offset++];

                if (!interpolation || interpolation !== "STEP") {
                    const inputBuffer = channel.inputBuffer;
                    const frameStart = inputBuffer[frameIndex];
                    const progress = (animationState._currentTime - frameStart) / (inputBuffer[frameIndex + 1] - frameStart);
                    x += (outputBuffer[offset++] - x) * progress;
                    y += (outputBuffer[offset++] - y) * progress;
                    z += (outputBuffer[offset++] - z) * progress;
                }
            }
            else {
                x = outputBuffer[0];
                y = outputBuffer[1];
                z = outputBuffer[2];
            }

            if (additive) {
                x -= outputBuffer[0];
                y -= outputBuffer[1];
                z -= outputBuffer[2];
            }

            const isArray = Array.isArray(binder.components);
            const weight = binder.weight;
            const target = (isArray ? (binder.components as Transform[])[0].localScale : (binder.components as Transform).localScale) as Vector3;

            if (binder.dirty > 1) {
                target.x += x * weight;
                target.y += y * weight;
                target.z += z * weight;
            }
            else {
                if (weight !== 1.0) {
                    target.x = x * weight;
                    target.y = y * weight;
                    target.z = z * weight;
                }
                else {
                    target.x = x;
                    target.y = y;
                    target.z = z;
                }
            }

            if (channel.isEnd) {
                if (binder.totalWeight < 1.0 - Const.EPSILON) {
                    const weight = 1.0 - binder.totalWeight;
                    const bindPose = binder.bindPose as Vector3;
                    target.x += bindPose.x * weight;
                    target.y += bindPose.y * weight;
                    target.z += bindPose.z * weight;
                }

                if (isArray) {
                    for (const component of binder.components as Transform[]) {
                        component.localScale = target;
                    }
                }
                else {
                    target.update();
                }
            }
        }

        public static onUpdateActive(channel: AnimationChannel, animationlayer: AnimationLayer, animationState: AnimationState) {
            const currentTime = animationState._currentTime;
            const outputBuffer = channel.outputBuffer;
            const binder = channel.binder;
            const frameIndex = channel.getFrameIndex(currentTime);
            //
            const activeSelf = (frameIndex >= 0 ? outputBuffer[frameIndex] : outputBuffer[0]) !== 0;

            if (Array.isArray(binder.components)) {
                for (const component of binder.components as Transform[]) {
                    component.gameObject.activeSelf = activeSelf;
                }
            }
            else {
                (binder.components as Transform).gameObject.activeSelf = activeSelf;
            }
        }

        public dirty: uint;
        public totalWeight: number;
        public weight: number;
        public components: paper.BaseComponent | paper.BaseComponent[];
        public bindPose: any;
        public updateTarget: (channel: AnimationChannel, animationlayer: AnimationLayer, animationState: AnimationState) => void;

        private constructor() {
            super();
        }

        public onClear() {
            this.clear();

            this.components = null!;
            this.bindPose = null!;
            this.updateTarget = null!;
        }

        public clear() {
            this.dirty = 0;
            this.totalWeight = 0.0;
            this.weight = 1.0;

            return this;
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