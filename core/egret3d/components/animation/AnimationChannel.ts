namespace egret3d {
    const _helpQuaternionA = Quaternion.create();
    const _helpQuaternionB = Quaternion.create();
    /**
     * @private
     */
    export class AnimationChannel extends paper.BaseRelease<AnimationChannel> {
        private static _instances = [] as AnimationChannel[];

        public static create() {
            let instance: AnimationChannel;
            if (this._instances.length > 0) {
                instance = this._instances.pop()!;
                instance._released = false;
            }
            else {
                instance = new AnimationChannel();
            }

            return instance;
        }

        public isEnd: boolean;
        public glTFChannel: GLTFAnimationChannel;
        public glTFSampler: gltf.AnimationSampler;
        public inputBuffer: Float32Array;
        public outputBuffer: ArrayBufferView & ArrayLike<number>;
        public components: paper.BaseComponent | paper.BaseComponent[];
        public updateTarget: ((animationlayer: AnimationLayer, animationState: AnimationState) => void) | null;
        public binder: AnimationBinder | null;

        private constructor() {
            super();
        }

        public onClear() {
            this.isEnd = false;
            this.updateTarget = null;
            this.binder = null;
        }

        public onUpdateTranslation(animationlayer: AnimationLayer, animationState: AnimationState) {
            const additive = animationlayer.additive;
            const currentTime = animationState._currentTime;
            const interpolation = this.glTFSampler.interpolation;
            const outputBuffer = this.outputBuffer;
            const components = this.components;
            const binder = this.binder!;
            const frameIndex = this.getFrameIndex(currentTime);

            let x: number, y: number, z: number;

            if (frameIndex >= 0) {
                let offset = frameIndex * 3;
                x = outputBuffer[offset++];
                y = outputBuffer[offset++];
                z = outputBuffer[offset++];

                if (!interpolation || interpolation !== "STEP") {
                    const inputBuffer = this.inputBuffer;
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

            const isArray = Array.isArray(components);
            const weight = binder.weight;
            const target = (isArray ? (components as Transform[])[0].localPosition : (components as Transform).localPosition) as Vector3;

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

            if (this.isEnd) {
                if (binder.totalWeight < 1.0 - Const.EPSILON) {
                    const weight = 1.0 - binder.totalWeight;
                    const bindPose = binder.bindPose as Vector3;
                    target.x += bindPose.x * weight;
                    target.y += bindPose.y * weight;
                    target.z += bindPose.z * weight;
                }

                if (isArray) {
                    for (const component of components as Transform[]) {
                        component.localPosition = target;
                    }
                }
                else {
                    target.update();
                }
            }
        }

        public onUpdateRotation(animationlayer: AnimationLayer, animationState: AnimationState) {
            const helpQuaternionA = _helpQuaternionA;
            const helpQuaternionB = _helpQuaternionB;
            const additive = animationlayer.additive;
            const currentTime = animationState._currentTime;
            const interpolation = this.glTFSampler.interpolation;
            const outputBuffer = this.outputBuffer;
            const components = this.components;
            const binder = this.binder!;
            const frameIndex = this.getFrameIndex(currentTime);

            let x: number, y: number, z: number, w: number;

            if (frameIndex >= 0) {
                let offset = frameIndex * 4;
                x = outputBuffer[offset++];
                y = outputBuffer[offset++];
                z = outputBuffer[offset++];
                w = outputBuffer[offset++];

                if (!interpolation || interpolation !== "STEP") {
                    const inputBuffer = this.inputBuffer;
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

            const isArray = Array.isArray(components);
            let weight = binder.weight;
            const target = (isArray ? (components as Transform[])[0].localRotation : (components as Transform).localRotation) as Quaternion;

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

            if (this.isEnd) {
                if (binder.totalWeight < 1.0 - Const.EPSILON) {
                    const weight = 1.0 - binder.totalWeight;
                    const bindPose = binder.bindPose as Quaternion;
                    target.x += bindPose.x * weight;
                    target.y += bindPose.y * weight;
                    target.z += bindPose.z * weight;
                    target.w += bindPose.w * weight;
                }

                if (isArray) {
                    for (const component of components as Transform[]) {
                        component.localRotation = target;
                    }
                }
                else {
                    target.update();
                }
            }
        }

        public onUpdateScale(animationlayer: AnimationLayer, animationState: AnimationState) {
            const additive = animationlayer.additive;
            const currentTime = animationState._currentTime;
            const interpolation = this.glTFSampler.interpolation;
            const outputBuffer = this.outputBuffer;
            const components = this.components;
            const binder = this.binder!;
            const frameIndex = this.getFrameIndex(currentTime);

            let x: number, y: number, z: number;

            if (frameIndex >= 0) {
                let offset = frameIndex * 3;
                x = outputBuffer[offset++];
                y = outputBuffer[offset++];
                z = outputBuffer[offset++];

                if (!interpolation || interpolation !== "STEP") {
                    const inputBuffer = this.inputBuffer;
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

            const isArray = Array.isArray(components);
            const weight = binder.weight;
            const target = (isArray ? (components as Transform[])[0].localScale : (components as Transform).localScale) as Vector3;

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

            if (this.isEnd) {
                if (binder.totalWeight < 1.0 - Const.EPSILON) {
                    const weight = 1.0 - binder.totalWeight;
                    const bindPose = binder.bindPose as Vector3;
                    target.x += bindPose.x * weight;
                    target.y += bindPose.y * weight;
                    target.z += bindPose.z * weight;
                }

                if (isArray) {
                    for (const component of components as Transform[]) {
                        component.localScale = target;
                    }
                }
                else {
                    target.update();
                }
            }
        }

        public onUpdateActive(animationlayer: AnimationLayer, animationState: AnimationState) {
            const currentTime = animationState._currentTime;
            const outputBuffer = this.outputBuffer;
            const components = this.components;
            const frameIndex = this.getFrameIndex(currentTime);
            //
            const activeSelf = (frameIndex >= 0 ? outputBuffer[frameIndex] : outputBuffer[0]) !== 0;

            if (this.isEnd) {
                if (Array.isArray(components)) {
                    for (const component of components as Transform[]) {
                        component.gameObject.activeSelf = activeSelf;
                    }
                }
                else {
                    (components as Transform).gameObject.activeSelf = activeSelf;
                }
            }
        }

        public getFrameIndex(currentTime: number): uint {
            const inputBuffer = this.inputBuffer;
            const frameCount = inputBuffer.length;

            if (DEBUG && frameCount === 0) {
                throw new Error();
            }

            if (frameCount === 1) {
                return -1;
            }
            else if (currentTime <= inputBuffer[0]) {
                return 0;
            }
            else if (currentTime >= inputBuffer[frameCount - 1]) {
                return frameCount - 2;
            }

            let beginIndex = 0;
            let endIndex = frameCount - 1;

            while (endIndex - beginIndex > 1) {
                const middleIndex = beginIndex + ((endIndex - beginIndex) * 0.5) >> 0;
                if (currentTime >= inputBuffer[middleIndex]) {
                    beginIndex = middleIndex;
                }
                else {
                    endIndex = middleIndex;
                }
            }

            return beginIndex;
        }
    }
}