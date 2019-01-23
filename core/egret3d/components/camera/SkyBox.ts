namespace egret3d {
    /**
     * 天空盒组件。
     */
    export class SkyBox extends paper.BaseComponent {
        protected readonly _materials: (Material | null)[] = [];

        public uninitialize() {
            super.uninitialize();

            for (const material of this._materials) {
                if (material) {
                    material.release();
                }
            }

            this._materials.length = 0;
        }
        /**
         * 该组件的材质列表。
         */
        @paper.editor.property(paper.editor.EditType.MATERIAL_ARRAY)
        @paper.serializedField
        public get materials(): ReadonlyArray<Material | null> {
            return this._materials;
        }
        public set materials(value: ReadonlyArray<Material | null>) {
            const materials = this._materials;

            for (const material of materials) {
                if (material) {
                    material.release();
                }
            }

            if (value !== materials) {
                materials.length = 0;

                for (const material of value) {
                    materials.push(material);
                }
            }

            for (const material of materials) {
                if (material) {
                    material.retain();
                }
            }
        }
        /**
         * 该组件材质列表中的第一个材质。
         */
        public get material(): Material | null {
            const materials = this._materials;

            return materials.length > 0 ? materials[0] : null;
        }
        public set material(value: Material | null) {
            let dirty = false;
            const materials = this._materials;
            let existingMaterial: Material | null = null;

            if (materials.length > 0) {
                existingMaterial = materials[0];
                if (existingMaterial !== value) {
                    dirty = true;
                }
            }
            else if (value) {
                dirty = true;
            }

            if (dirty) {
                if (existingMaterial) {
                    existingMaterial.release();
                }

                if (value) {
                    value.retain();
                }

                materials[0] = value;
            }
        }
    }
}