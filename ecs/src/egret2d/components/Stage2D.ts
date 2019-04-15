import { Entity, Component } from "../../ecs";
import { GameEntity, Node } from '../../egret';



/**
 * 2D渲染的根节点
 */
export class Stage2D extends Component {
    /**
     * 创建一个2D渲染的舞台
     */
    public static createStage2D(): Stage2D {
        const stageObj = GameEntity.create("stage2D");
        const stage2D = stageObj.addComponent(Stage2D);
        stageObj.addComponent(Node);

        return stage2D;
    }
    /**
     * @internal
     */
    public readonly stage: egret.Stage = null!;

    /**
     * TODO
     * frameRate
     * stageWidth
     * stageHeight
     * scaleMode
     * orientation
     * textureScaleFactor
     * maxTouches
     * contentSize
     */


    /**
     * 
     * @param defaultEnabled 
     * @param entity 
     * @override
     * @internal
     */
    public initialize(defaultEnabled: boolean, entity: Entity) {
        super.initialize(defaultEnabled, entity);

        (this.stage as egret.Stage) = new egret.Stage();
    }

    /**
     * 
     */
    public uninitialize() {
        super.uninitialize();
        //
        this.stage.removeChildren();
        (this.stage as egret.Stage) = null!;
    }
}