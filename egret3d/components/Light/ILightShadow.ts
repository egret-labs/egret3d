namespace egret3d {
    export interface ILightShadow {
        renderTarget: IRenderTarget;
        map: WebGLTexture;
        bias: number;
        radius: number;
        matrix: Matrix;
        windowSize: number;
        camera: Camera;
        update(light: Light, face?: number): void;
    }
}