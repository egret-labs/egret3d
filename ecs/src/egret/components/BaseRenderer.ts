import { component } from "../../ecs/index";
import { BaseComponent } from "./BaseComponent";
/**
 * 基础渲染组件。
 */
@component({ isAbstract: true })
export abstract class BaseRenderer extends BaseComponent {

}
