namespace egret3d {
    /**
     * 动画资源。
     */
    export class AnimationAsset extends GLTFAsset {
        /**
         * @internal
         */
        public _modify(mesh: BaseMesh) {
            const config = this.config;
            if (config.version) {
                return;
            }

            const meshConfig = mesh.config;
            if (meshConfig.skins) {
                const nodeIndices = mesh.boneIndices!;
                const bindTransforms = mesh._bindTransforms!;

                for (const glTFAnimation of config.animations!) {
                    const samplers = glTFAnimation.samplers;
                    for (const channel of glTFAnimation.channels) {
                        const animationNodeName = config.nodes![channel.target.node!].name!;
                        if (!(animationNodeName in nodeIndices)) {
                            continue;
                        }

                        let inputIndex = 0;
                        let outputOffset = 0;
                        const bindTransformOffset = nodeIndices[animationNodeName] * 10;
                        const inputs = this.createTypeArrayFromAccessor(this.getAccessor(samplers[channel.sampler].input));
                        const outputs = this.createTypeArrayFromAccessor(this.getAccessor(samplers[channel.sampler].output));

                        for (const input of <any>inputs as number[]) {
                            switch (channel.target.path) {
                                case "translation":
                                    outputOffset = inputIndex * 3;
                                    outputs[outputOffset++] -= bindTransforms[bindTransformOffset + 0];
                                    outputs[outputOffset++] -= bindTransforms[bindTransformOffset + 1];
                                    outputs[outputOffset++] -= bindTransforms[bindTransformOffset + 2];
                                    break;

                                case "rotation":
                                    outputOffset = inputIndex * 4;
                                    // outputs[outputOffset++] -= bindTransforms[bindTransformOffset + 3];
                                    // outputs[outputOffset++] -= bindTransforms[bindTransformOffset + 4];
                                    // outputs[outputOffset++] -= bindTransforms[bindTransformOffset + 5];
                                    // outputs[outputOffset++] -= bindTransforms[bindTransformOffset + 6];
                                    break;

                                case "scale":
                                    outputOffset = inputIndex * 3;
                                    // outputs[outputOffset++] -= bindTransforms[bindTransformOffset + 7];
                                    // outputs[outputOffset++] -= bindTransforms[bindTransformOffset + 8];
                                    // outputs[outputOffset++] -= bindTransforms[bindTransformOffset + 9];
                                    break;
                            }

                            inputIndex++;
                        }
                    }
                }
            }

            config.version = "4";
        }
        /*
         * 获取动画剪辑。
         */
        public getAnimationClip(name: string): GLTFAnimationClip | null {
            if (
                !this.config.animations ||
                this.config.animations.length === 0

            ) { // TODO 动画数据暂不合并。
                return null;
            }

            const animation = this.config.animations[0] as GLTFAnimation;
            if (animation.extensions.paper.clips.length === 0) {
                return null;
            }

            if (!name) {
                return animation.extensions.paper.clips[0];
            }

            for (const animation of this.config.animations) {
                for (const animationClip of animation.extensions.paper.clips) {
                    if (animationClip.name === name) {
                        return animationClip;
                    }
                }
            }

            return null;
        }
    }
}