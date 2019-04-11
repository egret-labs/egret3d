import { IComponentClass, IComponent } from "../core/types";
/**
 * 
 */
export const enum DefaultNames {
    Noname = "Noname",
    Default = "Default",
    Global = "Global",
    MainCamera = "Main Camera",
    EditorCamera = "Editor Camera",
    Editor = "Editor",
    MissingPrefab = "Missing Prefab",
}
/**
 * 
 */
export interface ISceneClass<TScene extends IScene> extends IComponentClass<TScene> {

}

export interface IScene extends IComponent {

}