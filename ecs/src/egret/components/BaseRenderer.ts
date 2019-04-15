import { component } from "../../ecs";
import { ComponentType } from "../types";
import { BaseComponent } from "./BaseComponent";
/**
 * 基础渲染组件。
 */
@component({ isAbstract: true, type: ComponentType.Renderer })
export abstract class BaseRenderer extends BaseComponent {

}
