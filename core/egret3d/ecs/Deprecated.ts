namespace paper {
    /**
     * @deprecated
     */
    export type CullingMask = Layer;
    /**
     * @deprecated
     */
    export const CullingMask = (paper as any).Layer as any;
    /**
     * @deprecated
     * @internal
     */
    export const serializeClassMap: { [key: string]: string } = {
        0: "paper.Scene",
        1: "paper.GameObject",
        2: "egret3d.AniPlayer",
        3: "egret3d.BoxCollider",
        4: "egret3d.Camera",
        5: "egret3d.MeshFilter",
        6: "egret3d.MeshRenderer",
        7: "egret3d.particle.ParticleComponent",
        8: "egret3d.particle.ParticleRenderer",
        9: "egret3d.SkinnedMeshRenderer",
        10: "egret3d.SphereCollider",
        11: "egret3d.Transform",
        12: "egret3d.Shader",
        15: "egret3d.AnimationClip",
        16: "egret3d.TPoseInfo",
        17: "egret3d.PoseBoneMatrix",
        18: "egret3d.Texture",
        19: "egret3d.Texture",
        20: "egret3d.Vector2",
        21: "egret3d.Vector3",
        22: "egret3d.Vector4",
        23: "egret3d.Quaternion",
        24: "egret3d.Color",
        25: "egret3d.Gradient",
        26: "egret3d.Curve",
        27: "egret3d.Keyframe",
        28: "egret3d.Rect",
        29: "egret3d.MainModule",
        30: "egret3d.EmissionModule",
        31: "egret3d.ShapeModule",
        32: "egret3d.VelocityOverLifetimeModule",
        33: "egret3d.RotationOverLifetimeModule",
        34: "egret3d.ColorOverLifetimeModule",
        35: "egret3d.SizeOverLifetimeModule",
        36: "egret3d.MinMaxCurve",
        37: "egret3d.MinMaxGradient",
        38: "egret3d.alphaKey",
        39: "egret3d.colorKey",
        40: "egret3d.Animation",
        41: "egret3d.GLTFAsset",
        //
        13: "paper.Compatible",
        14: "paper.Compatible",
    };
    /**
     * @deprecated
     * @internal
     */
    export class Compatible implements ISerializable {
        public serialize() {
            throw new Error("Never");
        }

        public deserialize(element: ISerializedStruct, data?: Deserializer) {
            if (!data) {
                throw new Error("Never");
            }

            return data.getAssetOrComponent(element._glTFAsset as IAssetReference);
        }
    }
    /**
     * @deprecated
     * @see paper.singleton
     */
    @singleton
    export class SingletonComponent extends paper.BaseComponent {
    }
    /**
     * @deprecated
     */
    export type GameObjectGroup = Group<GameObject>;
    export const GameObjectGroup = Group;
    /**
     * @deprecated
     */
    /**
     * @deprecated 
     * @see paper.clock
     */
    export const Time: Clock = null!;
    /**
     * @deprecated
     */
    export const enum InterestType {
        Extends = 0b000001,
        Exculde = 0b000010,
        Unessential = 0b000100,
    }
    /**
     * @deprecated 
     */
    export type InterestConfig = {
        componentClass: IComponentClass<Component>[] | IComponentClass<BaseComponent>;
        type?: InterestType;
        listeners?: {
            type: signals.Signal;
            listener: (component: BaseComponent) => void;
        }[];
    };
}