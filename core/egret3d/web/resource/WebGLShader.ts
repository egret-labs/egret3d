namespace egret3d.webgl {
    /**
     * @internal
     */
    export class WebGLShader extends Shader {
        public readonly programs: { [key: string]: WebGLProgramBinder | null } = {};

        // public onReferenceCountChange(isZero: boolean) { // TODO
        //     if (isZero) {
        //         for (const k in this.programs) {
        //             const program = this.programs[k];
        //             if (program) {
        //                 program.dispose();
        //             }

        //             delete this.programs[k];
        //         }

        //         // this.programs;

        //         return true;
        //     }

        //     return false;
        // }
    }
    // Retargeting.
    egret3d.Shader = WebGLShader;
}