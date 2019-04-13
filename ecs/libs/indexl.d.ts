declare type int = number;
declare type uint = number;
declare type float = number;

declare const DEBUG: boolean;
declare namespace egret {
    declare function getQualifiedClassName(componentClass: any): string;
}

declare interface Window {
    gltf: any;
    paper: any;
    egret3d: any;
    // WX
    canvas: HTMLCanvasElement;
}