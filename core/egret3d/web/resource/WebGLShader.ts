namespace egret3d.webgl {
    /**
     * @internal
     */
    export class WebGLShader extends Shader {
        public readonly programs: { [key: string]: WebGLProgramBinder | null } = {};

        public dispose() {
            if (super.dispose()) {
                const { programs } = this;

                for (const k in programs) {
                    const program = programs[k];

                    if (program !== null) {
                        program.dispose();
                    }

                    delete programs[k];
                }

                return true;
            }

            return false;
        }
    }
    // Retargeting.
    egret3d.Shader = WebGLShader;
}
