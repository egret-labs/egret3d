namespace egret3d {
    /**
     * @private
     */
    export class AnimationController extends GLTFAsset {
        public static create(): AnimationController {
            const asset = new AnimationController();
            const config = this._createConfig();
            config.extensions = {
                paper: {
                    animationControllers: [{
                        layers: [],
                        parameters: []
                    }]
                },
            };

            asset.config = config;

            return asset;
        }

        private constructor() {
            super(); // TODO GLTFAsset protected
        }

        public createLayer(name: string): AnimationLayer {
            const layers = this.layers;
            const layer: AnimationLayer = {
                additive: false,
                weight: 1.0,
                name: name,
                source: null,
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

        public getLayer(index: uint): AnimationLayer {
            const layers = this.layers;
            if (index >= layers.length) {
                index = layers.length;
                this.createLayer(paper.DefaultNames.NoName);
            }

            return layers[index];
        }

        public get layers(): AnimationLayer[] {
            return this.config.extensions.paper!.animationControllers![0].layers;
        }
    }
}