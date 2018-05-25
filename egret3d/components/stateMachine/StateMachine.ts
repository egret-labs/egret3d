// namespace paper {
//     /**
//      * @private
//      * 动画混合模式。
//      */
//     export const enum BlendType {
//         E1D,
//         E2DSD,
//         E2DFD,
//         E2DFC,
//         ED,
//     }
//     /**
//      * @private
//      * 动画节点数据基类。
//      */
//     export abstract class BaseAnimationNodeModel extends SerializableObject {
//         /**
//          * 播放速度。
//          */
//         @SerializedField
//         public timeScale: number = 1.0;
//         /**
//          * 处于混合空间的水平位置。
//          */
//         @SerializedField
//         public positionX: number = 0.0;
//         /**
//          * 处于混合空间的垂直位置。
//          */
//         @SerializedField
//         public positionY: number = 0.0;
//     }
//     /**
//      * @private
//      * 动画节点数据。
//      */
//     export class AnimationNodeModel extends BaseAnimationNodeModel {
//         // /**
//         //  * 动画剪辑数据。
//         //  */
//         // @SerializedField
//         // public animation: AnimationClipNew | null = null;
//     }
//     /**
//      * @private
//      * 混合节点数据。
//      */
//     export class AnimationBlendNodeModel extends BaseAnimationNodeModel {
//         /**
//          * 混合模式。
//          */
//         @SerializedField
//         public blendType: BlendType = BlendType.E1D;
//         /**
//          * 动画节点列表。
//          */
//         @SerializedField
//         public readonly children: BaseAnimationNodeModel[] = [];
//         /**
//          * 混合空间的水平混合参数。
//          */
//         @SerializedField
//         public parameterX: Readonly<StateVariable> | null = null;
//         /**
//          * 混合空间的垂直混合参数。
//          */
//         @SerializedField
//         public parameterY: Readonly<StateVariable> | null = null;
//     }
//     /**
//      * @private
//      * 状态变量类型。
//      */
//     export const enum StateVariableType {
//         Bool,
//         Int,
//         Float,
//         Trigger,
//     }
//     /**
//      * @private
//      * 状态判断类型。
//      */
//     export const enum StateConditionType {
//         Greater,
//         Less,
//         Equals,
//         NotEqual,
//     }
//     /**
//      * @private
//      * 状态变量。
//      */
//     export class StateVariable extends SerializableObject {
//         /**
//          * 变量类型。
//          */
//         @SerializedField
//         public readonly type: StateVariableType;
//         /**
//          * 变量名。
//          */
//         @SerializedField
//         public readonly key: string;
//         /**
//          * 变量值。
//          */
//         @SerializedField
//         public value: boolean | number;

//         public constructor(
//             type: StateVariableType = StateVariableType.Bool,
//             key: string = "",
//             value: boolean | number = false,
//         ) {
//             super();

//             this.type = type;
//             this.key = key;
//             this.value = value;
//         }
//     }
//     /**
//      * @private
//      * 状态改变条件。
//      */
//     export class StateCondition extends SerializableObject {
//         /**
//          * 判断类型。
//          */
//         @SerializedField
//         public type: StateConditionType = StateConditionType.Equals;
//         /**
//          * 判断值。
//          */
//         @SerializedField
//         public value: boolean | number = false;
//         /**
//          * 变量。
//          */
//         @SerializedField
//         public variable: Readonly<StateVariable> = null as any; //

//         public check(): boolean {
//             switch (this.type) {
//                 case StateConditionType.Equals:
//                     return this.variable.value === this.value;

//                 case StateConditionType.NotEqual:
//                     return this.variable.value !== this.value;

//                 case StateConditionType.Less:
//                     return this.variable.value < this.value;

//                 case StateConditionType.Greater:
//                     return this.variable.value > this.value;
//             }
//         }
//     }
//     /**
//      * @private
//      * 状态改变。
//      */
//     export class StateTransition extends SerializableObject {
//         /**
//          * 该条件起效，其他 solo 为 false 的条件都不起作用。
//          */
//         @SerializedField
//         public solo: boolean = false;
//         /**
//          * 该条件禁用。
//          */
//         @SerializedField
//         public mute: boolean = false;
//         /**
//          * 帮助描述。
//          */
//         @SerializedField
//         public info: string = "";
//         /**
//          * 状态改变条件列表。
//          */
//         @SerializedField
//         public readonly conditions: StateCondition[] = [];
//         /**
//          * 要改变的状态。
//          */
//         @SerializedField
//         public target: StateModel = null as any;

//         public check(): boolean {
//             for (const condition of this.conditions) {
//                 if (!condition.check()) {
//                     return false;
//                 }
//             }

//             return true;
//         }
//     }
//     /**
//      * @private
//      * 动画状态改变。
//      */
//     export class AnimationStateTransition extends StateTransition {
//         /**
//          * 当状态改变条件成立或为空时，是否等当前动画状态播放完毕后改变状态。
//          */
//         @SerializedField
//         public changeAfterComplete: boolean = false;
//         /**
//          * 淡出动画所需要的时间。（以秒为单位）
//          */
//         @SerializedField
//         public fadeOutTime: number = 0.3;
//         /**
//          * 淡入动画所需要的时间。（以秒为单位）
//          */
//         @SerializedField
//         public fadeInTime: number = 0.3;
//         /**
//          * 淡入动画开始播放的进度。[0.0 ~ 1.0]（%）
//          */
//         @SerializedField
//         public progress: number = 0.0;
//     }
//     /**
//      * @private
//      * 状态机状态数据。
//      */
//     export class StateModel extends SerializableObject {
//         /**
//          * 状态名称。
//          */
//         @SerializedField
//         public name: string = "";
//         /**
//          * 状态改变列表。
//          */
//         @SerializedField
//         public readonly transitions: StateTransition[] = [];
//         /**
//          * 父状态机。
//          */
//         @SerializedField
//         public parent: StateMachineModel | null = null;

//         public constructor(name: string = "", parent: StateMachineModel | null = null) {
//             super();

//             this.name = name;
//             this.parent = parent;
//         }
//     }
//     /**
//      * @private
//      * 状态机动画状态数据。
//      */
//     export class AnimationStateModel extends StateModel {
//         /**
//          * 动画数据。
//          */
//         @SerializedField
//         public animation: AnimationNodeModel | AnimationBlendNodeModel | null = null;
//     }
//     /**
//      * @private
//      * 状态机数据。
//      */
//     export class StateMachineModel extends StateModel {
//         /**
//          * 进入状态。
//          */
//         @SerializedField
//         public readonly entry: StateModel = new StateModel("entry", this);
//         /**
//          * 未知状态。
//          */
//         @SerializedField
//         public readonly any: StateModel = new StateModel("any", this);
//         /**
//          * 退出状态。
//          */
//         @SerializedField
//         public readonly exit: Readonly<StateModel> = new StateModel("exit", this);
//         /**
//          * 状态列表。
//          */
//         @SerializedField
//         public readonly states: StateModel[] = [];
//         /**
//          * 默认状态。
//          */
//         @SerializedField
//         public readonly default: StateModel | null = null;
//         /**
//          * 默认改变。
//          */
//         @SerializedField
//         public readonly defaultTransition: StateTransition | null = null;
//     }
//     /**
//      * @private
//      * 状态机数据资源。
//      */
//     export class StateMachineAsset extends Asset {
//         /**
//          * 状态机列表。
//          */
//         @SerializedField
//         public readonly machines: StateMachineModel[] = [];
//         /**
//          * 变量列表。
//          */
//         @SerializedField
//         public readonly variables: StateVariable[] = [];
//         /**
//          * @override
//          */
//         public caclByteLength(): number {
//             return 0;
//         }
//         /**
//          * @override
//          */
//         public dispose(): void {
//         }
//     }
//     // /**
//     //  * @private
//     //  */
//     // export class StateMachineOverrideAsset extends StateMachineAsset {
//     //     public readonly animations: { [key: string]: string } = {};
//     //     public source: StateMachineOverrideAsset | null;
//     //     /**
//     //      * 
//     //      */
//     //     public caclByteLength(): number {
//     //         return 0;
//     //     }
//     //     /**
//     //      * 
//     //      */
//     //     public dispose(): void {
//     //         super.dispose();
//     //     }
//     // }










//     /**
//      * @private
//      * 状态实例。
//      */
//     export class NormalState {
//         public model: StateModel;
//         public parent: StateMachine | null = null;
//     }
//     /**
//      * 状态机实例。
//      */
//     export class StateMachine extends NormalState {
//         /**
//          * 状态列表。
//          */
//         public readonly states: NormalState[] = [];
//         /**
//          * 当前状态。
//          */
//         private _state: StateModel | null = null;
//         /**
//          * 进入指定状态。
//          */
//         private _enter(state: StateModel): void {

//         }
//         /**
//          * 执行指定状态。
//          */
//         private _execute(state: StateModel): void {
//             for (const transition of state.transitions) {
//                 if (transition.check()) {
//                     this._exit(state);
//                     this._state = null;
//                     this._enter(this._state);
//                     break;
//                 }
//             }
//         }
//         /**
//          * 退出指定状态。
//          */
//         private _exit(state: StateModel): void {

//         }

//         public update(): void {
//             const model = this.model as StateMachineModel;

//             if (this._state === null) {
//                 this._state = model.entry;
//                 this._enter(this._state);
//             }
//             else {

//             }

//             this._execute(this._state);
//         }
//     }
//     /**
//      * 状态机组件。
//      */
//     export class StateMachineComponent extends paper.BaseComponent {
//         /**
//          *  
//          */
//         public readonly componentType = "";
//         /**
//          * 状态机列表。
//          */
//         public readonly stateMachines: StateMachine[] = [];
//         /**
//          * 变量列表。
//          */
//         public readonly stateVariables: StateVariable[] = [];
//         /**
//          * 状态机数据。
//          */
//         private _model: StateMachineAsset | null = null;
//         /**
//          * @override
//          */
//         public update() {
//             for (const stateMachine of this.stateMachines) {
//                 stateMachine.update();
//             }
//         }

//         public setValue(key: string, value: boolean | number) {
//             for (const variable of this.stateVariables) {
//                 if (variable.key === key) {
//                     variable.value = value;
//                     break;
//                 }
//             }
//         }

//         @SerializedField
//         public get model() {
//             return this._model;
//         }
//         public set model(value: StateMachineAsset | null) {
//             if (this._model === value) {
//                 return;
//             }

//             this._model = value;
//         }
//     }
//     /**
//      * @private
//      */
//     export class StateMachineSystem extends paper.BaseSystem {
//         public interest: { [componentType: string]: paper.MemberListener[] } = {
//             "StateMachineComponent": []
//         };

//         public update() {
//             this._componentStore.forEach((component: StateMachineComponent) => {
//                 component.update();
//             });
//         }
//     }
// }