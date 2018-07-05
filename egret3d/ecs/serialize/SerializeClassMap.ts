namespace paper {

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
        13: "egret3d.Mesh",
        14: "egret3d.Material",
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
        "egret3d.Light": "egret3d.DirectLight",
    };


    export function findClassCode(name: string) {
        for (let key in serializeClassMap) {
            if (serializeClassMap[key] === name) {
                return key;
            }
        }

        return "";
    }


    export function findClassCodeFrom(target: any) {
        const proto = target.__proto__;
        const classTypeOrigin = proto.__class__;
        const classType = paper.findClassCode(classTypeOrigin);

        return classType;
    }
}