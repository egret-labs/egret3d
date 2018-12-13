namespace egret3d {
    /**
     * @private
     */
    export class AnimationMask extends GLTFAsset {
        /**
         * 
         */
        public static create(name: string): AnimationMask;
        /**
         * @private
         */
        public static create(name: string, config: GLTF): AnimationMask;
        public static create(name: string, config?: GLTF) {
            let animationMask: AnimationMask;

            if (!config) {
                config = this.createConfig();
                config.nodes = [];
                config.extensions = {
                    paper: {
                        animationMasks: [{
                            retargeting: [],
                            joints: []
                        }]
                    },
                };
            }

            animationMask = new AnimationMask(name, config);
            animationMask.initialize();

            return animationMask;
        }
        /**
         * @internal
         */
        public _dirty: boolean = false;
        private _jointNamesDirty: boolean = false;
        private readonly _jointNames: string[] = [];

        private _addJoint(nodes: gltf.Node[], joints: uint[], jointIndex: uint, recursive: boolean) {
            if (joints.indexOf(jointIndex) < 0) {
                joints.push(jointIndex);
                this._dirty = true;
                this._jointNamesDirty = true;
            }

            if (recursive) {
                const node = nodes[jointIndex];
                const children = node.children;
                if (!children) {
                    return;
                }

                for (const index of children) {
                    this._addJoint(nodes, joints, index, recursive);
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

        public addJoint(name: string, recursive: boolean = true): this {
            let index = 0;
            const nodes = this.config.nodes!;
            const joints = this.config.extensions!.paper!.animationMasks![0].joints;

            for (const node of nodes) {
                if (node.name === name) {
                    this._addJoint(nodes, joints, index, recursive);
                    return this;
                }

                index++;
            }

            console.warn("Invalid joint mask name.", name);

            return this;
        }

        public removeJoint(name: string, recursive: boolean = true): this {
            let index = 0;
            const nodes = this.config.nodes!;
            const joints = this.config.extensions!.paper!.animationMasks![0].joints;

            for (const node of nodes) {
                if (node.name === name) {
                    if (joints.indexOf(index) >= 0) {
                        joints.splice(index, 1);
                    }
                    break;
                }

                index++;
            }

            // recursive // TODO

            return this;
        }

        public removeJoints(): this {
            const joints = this.config.extensions!.paper!.animationMasks![0].joints;
            joints.length = 0;
            this._dirty = true;
            this._jointNamesDirty = true;

            return this;
        }

        public get jointNames(): ReadonlyArray<string> {
            const jointNames = this._jointNames;
            if (this._jointNamesDirty) {
                const nodes = this.config.nodes!;
                const joints = this.config.extensions!.paper!.animationMasks![0].joints;
                jointNames.length = 0;

                for (const index of joints) {
                    const node = nodes[index];
                    jointNames.push(node.name!);
                }

                this._jointNamesDirty = false;
            }

            return jointNames;
        }
    }
}