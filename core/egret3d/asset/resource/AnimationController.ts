namespace egret3d {
    /**
     * 
     */
    export interface StateMachineNode {
        _parent?: StateMachineNode;
    }
    /**
     * 
     */
    export interface StateMachine extends StateMachineNode {
        name: string;
        nodes: StateMachineNode[];
    }
    /**
     * 
     */
    export const enum AnimationBlendType {
        E1D = 0,
    }
    /**
     * 
     */
    export interface AnimationParameter {
        type: int;
        value: boolean | int | number;
    }
    /**
     * 
     */
    export interface AnimationLayer {
        additive: boolean;
        weight: number;
        name: string;
        source: string | null;
        machine: StateMachine;
    }
    /**
     * 
     */
    export interface AnimationBaseNode extends StateMachineNode {
        timeScale: number;
        positionX?: number;
        positionY?: number;
    }
    /**
     * 
     */
    export interface AnimationTree extends AnimationBaseNode {
        blendType: AnimationBlendType;
        name: string;
        parameters: string[];
        nodes: AnimationBaseNode[];
    }
    /**
     * 
     */
    export interface AnimationNode extends AnimationBaseNode {
        asset: string;
        clip: string;
    }
    /**
     * 
     */
    export class AnimationController extends GLTFAsset {
        public static create(): AnimationController {
            const controller = new AnimationController();
            const config = this._createConfig();
            config.extensions = {
                paper: {
                    animationControllers: [{
                        parameters: [],
                        layers: []
                    }]
                },
            };

            controller.config = config;

            return controller;
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
                this.createLayer(paper.DefaultNames.NoName);
            }

            return layers[index];
        }

        public get layers(): AnimationLayer[] {
            return this.config.extensions.paper!.animationControllers![0].layers;
        }
    }
}