import { ISerializableClass } from "../serialize/types";
/**
 * 
 */
export const enum DefaultNames {
    NoName = "NoName",
    Default = "Default",
    Global = "Global",
    MainCamera = "Main Camera",
    EditorCamera = "Editor Camera",
    Editor = "Editor",
    MissingPrefab = "Missing Prefab",
}
/**
 * 场景类接口。
 */
export interface ISceneClass<TScene extends IScene> extends ISerializableClass {
    /**
     * 禁止实例化场景。
     * @protected
     */
    new(): TScene;
}

export interface INode<TScene extends IScene> {
    name: string;
    readonly childCount: uint;
    readonly children: ReadonlyArray<this>;
    scene: TScene;
    parent: this | null;
}
/**
 * 场景接口。
 */
export interface IScene {
    /**
     * 该场景的节点数量。
     */
    readonly nodeCount: uint;
    /**
     * 该场景的全部根节点。
     */
    readonly nodes: ReadonlyArray<INode<this>>;
    /**
     * 该场景所属的应用程序。
     */
    readonly application: IApplication<this>;

    contains(node: INode<this>): boolean;
}
/**
 * 应用程序接口。
 */
export interface IApplication<TScene extends IScene> {
}
