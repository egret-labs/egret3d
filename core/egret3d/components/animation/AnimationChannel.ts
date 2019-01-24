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
                instance.onClear();
            }

            return instance;
        }

        public enabled: boolean;
        public glTFChannel: GLTFAnimationChannel;
        public glTFSampler: gltf.AnimationSampler;
        public inputBuffer: Float32Array;
        public outputBuffer: ArrayBufferView & ArrayLike<number>;
        public binder: paper.BaseComponent | AnimationBinder | any;
        public updateTarget: ((animationlayer: AnimationLayer, animationState: AnimationState) => void) | null;
        public needUpdate: ((dirty: int) => void) | null;

        private constructor() {
            super();
        }

        public onClear() {
            this.enabled = true;
            this.binder = null!;
            this.updateTarget = null;
            this.needUpdate = null;
        }

        public onUpdateTranslation(animationlayer: AnimationLayer, animationState: AnimationState) {
            const additive = animationlayer.additive;
            const currentTime = animationState._currentTime;
            const interpolation = this.glTFSampler.interpolation;
            const outputBuffer = this.outputBuffer;
            const binder = this.binder as AnimationBinder;
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

            if (additive) { // TODO position
                x -= outputBuffer[0];
                y -= outputBuffer[1];
                z -= outputBuffer[2];
            }

            const weight = binder.weight;
            const target = (binder.target as Transform).localPosition as Vector3;

            if (this.glTFChannel.target.node === animationState.animationClip.root) {
                if (weight !== 1.0) {
                    y *= weight;
                }

                if (binder.dirty > 1) {
                    target.y += y;
                }
                else {
                    target.x = outputBuffer[0];
                    target.y = y;
                    target.z = outputBuffer[2];
                }

                animationState._applyRootMotion(x, 0.0, z, weight);
            }
            else {
                if (weight !== 1.0) {
                    x *= weight;
                    y *= weight;
                    z *= weight;
                }

                if (binder.dirty > 1) {
                    target.x += x;
                    target.y += y;
                    target.z += z;
                }
                else {
                    target.x = x;
                    target.y = y;
                    target.z = z;
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
            const binder = this.binder as AnimationBinder;
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

            let weight = binder.weight;
            const target = (binder.target as Transform).localRotation as Quaternion;

            if (binder.dirty > 1) {
                if (additive) {
                    target.multiply(helpQuaternionA.lerp(Quaternion.IDENTITY, helpQuaternionA, weight));
                }
                else {
                    if (helpQuaternionA.set(x, y, z, w).dot(target) < 0.0) {
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
            else if (weight === 1.0) {
                target.x = x;
                target.y = y;
                target.z = z;
                target.w = w;
            }
            else {
                target.x = x * weight;
                target.y = y * weight;
                target.z = z * weight;
                target.w = w * weight;
            }
        }

        public onUpdateScale(animationlayer: AnimationLayer, animationState: AnimationState) {
            const additive = animationlayer.additive;
            const currentTime = animationState._currentTime;
            const interpolation = this.glTFSampler.interpolation;
            const outputBuffer = this.outputBuffer;
            const binder = this.binder as AnimationBinder;
            const frameIndex = this.getFrameIndex(currentTime);
            const transforms = binder.target;

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

            const weight = binder.weight;
            const target = (binder.target as Transform).localScale as Vector3;

            if (binder.dirty > 1) {
                target.x += x * weight;
                target.y += y * weight;
                target.z += z * weight;
            }
            else if (weight === 1.0) {
                target.x = x;
                target.y = y;
                target.z = z;
            }
            else {
                target.x = x * weight;
                target.y = y * weight;
                target.z = z * weight;
            }
        }

        public onUpdateActive(animationlayer: AnimationLayer, animationState: AnimationState) {
            const currentTime = animationState._currentTime;
            const outputBuffer = this.outputBuffer;
            const frameIndex = this.getFrameIndex(currentTime);
            //
            (this.binder as paper.BaseComponent).gameObject.activeSelf = (frameIndex >= 0 ? outputBuffer[frameIndex] : outputBuffer[0]) !== 0;

        }

        public onUpdateFloat(animationlayer: AnimationLayer, animationState: AnimationState) {
            const additive = animationlayer.additive;
            const currentTime = animationState._currentTime;
            const interpolation = this.glTFSampler.interpolation;
            const outputBuffer = this.outputBuffer;
            const frameIndex = this.getFrameIndex(currentTime);
            const target = this.binder;
            const extension = this.glTFChannel.extensions!.paper;

            let x: number;

            if (frameIndex >= 0) {
                let offset = frameIndex;
                x = outputBuffer[offset++];

                if (!interpolation || interpolation !== "STEP") {
                    const inputBuffer = this.inputBuffer;
                    const frameStart = inputBuffer[frameIndex];
                    const progress = (currentTime - frameStart) / (inputBuffer[frameIndex + 1] - frameStart);
                    x += (outputBuffer[offset++] - x) * progress;
                }
            }
            else {
                x = outputBuffer[0];
            }

            if (additive) {
                x -= outputBuffer[0];
            }

            target[extension.property] = x;

            if (this.needUpdate) {
                this.needUpdate(extension.needUpdate!);
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