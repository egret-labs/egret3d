namespace egret3d {
    /**
     * @private
     */
    export class AnimationController extends GLTFAsset {
        /**
         * 
         */
        public static create(name: string): AnimationController;
        /**
         * @private
         */
        public static create(name: string, config: GLTF): AnimationController;
        public static create(name: string, config?: GLTF) {
            let animationController: AnimationController;

            if (!config) {
                config = this.createConfig();
                config.extensions = {
                    paper: {
                        animationControllers: [{
                            layers: [],
                            parameters: []
                        }]
                    },
                };
            }

            animationController = new AnimationController(name, config);
            animationController.initialize();

            return animationController;
        }
        /**
         * 添加一个新的动画层。
         */
        public addLayer(name: string): AnimationLayer {
            const layers = this.layers;
            const layer: AnimationLayer = {
                additive: false,
                weight: 1.0,
                name: name,
                machine: {
                    name: paper.DefaultNames.Default,
                    nodes: [],
                },
            };

            layers.push(layer);

            return layer;
        }

        public createAnimationTree(machineOrTreen: StateMachine | AnimationTree, name: string): AnimationTree {
            const animationTree: AnimationTree = {
                timeScale: 1.0,

                blendType: AnimationBlendType.E1D,
                name: name,
                parameters: [],
                nodes: []
            };

            const nodes = machineOrTreen.nodes as any[];
            if (nodes.indexOf(animationTree) < 0) {
                nodes.push(animationTree);
            }

            return animationTree;
        }

        public createAnimationNode(machineOrTreen: StateMachine | AnimationTree, asset: string, clip: string): AnimationNode {
            const animationNode: AnimationNode = {
                asset: asset,
                clip: clip,
                timeScale: 1.0,
            };

            const nodes = machineOrTreen.nodes as any[];
            if (nodes.indexOf(animationNode) < 0) {
                nodes.push(animationNode);
            }

            return animationNode;
        }
        /**
         * 获取或添加一个动画层。
         * - 层索引强制连续。
         */
        public getOrAddLayer(layerIndex: uint): AnimationLayer {
            const layers = this.layers;
            if (layerIndex >= layers.length) {
                layerIndex = layers.length;
                this.addLayer(paper.DefaultNames.NoName);
            }

            return layers[layerIndex];
        }

        public get layers(): AnimationLayer[] {
            return this.config.extensions.paper!.animationControllers![0].layers;
        }
    }
}
