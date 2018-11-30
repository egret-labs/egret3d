namespace egret3d {
    /**
     * 动画资源。
     */
    export class AnimationMask extends GLTFAsset {
        public static create(): AnimationMask {
            const asset = new AnimationMask();
            const config = this._createConfig();
            config.nodes = [];
            config.extensions = {
                paper: {
                    animationMasks: [{
                        retargeting: [],
                        joints: []
                    }]
                },
            };

            asset.config = config;

            return asset;
        }

        private constructor() {
            super(); // TODO GLTFAsset protected
        }

        private _addJointChildren(nodes: gltf.Node[], joints: uint[], node: gltf.Node) {
            const children = node.children;
            if (!children) {
                return;
            }

            for (const index of children) {
                if (joints.indexOf(index) < 0) {
                    joints.push(index);
                    this._addJointChildren(nodes, joints, nodes[index]);
                }
            }
        }

        public createJoints(mesh: Mesh): this {
            const nodes = this.config.nodes!;
            nodes.length = 0;

            for (const meshNode of mesh.config.nodes!) {
                const node: gltf.Node = {
                    name: meshNode.name
                };
                if (meshNode.children) {
                    node.children = meshNode.children.concat();
                }

                nodes.push(node);
            }

            return this;
        }

        public addJointMask(name: string, recursive: boolean = true): this {
            let index = 0;
            const nodes = this.config.nodes!;
            const joints = this.config.extensions!.paper!.animationMasks![0].joints;

            for (const node of nodes) {
                if (node.name === name) {
                    if (joints.indexOf(index) < 0) {
                        joints.push(index); // Success.

                        if (recursive) { // add children.
                            this._addJointChildren(nodes, joints, node);
                        }
                    }
                    else {
                        console.warn("The joint have been added.", name);
                    }

                    return this;
                }

                index++;
            }

            console.warn("Invalid joint mask name.", name);

            return this;
        }

        public removeJointMask(name: string, recursive: boolean = true): this { 
            
            return this;
        }
    }
}