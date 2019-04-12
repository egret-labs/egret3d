import { component } from "../../ecs/Decorators";
import BaseComponent from "./BaseComponent";
/**
 * 基础渲染组件。
 */
@component({ isAbstract: true })
export default abstract class BaseRenderer extends BaseComponent {

}
