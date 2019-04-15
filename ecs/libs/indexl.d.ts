declare const DEBUG: boolean;
declare namespace egret {
    declare function getQualifiedClassName(componentClass: any): string;
    declare function getDefinitionByName(componentClass: any): any;
}

declare type int = number;
declare type uint = number;
declare type float = number;
declare type StringMap<T> = { [key: string]: T};

declare interface Window {
    gltf: any;
    paper: any;
    egret3d: any;
    egret: any;
    pro: any;
    // WX
    canvas: HTMLCanvasElement;
}