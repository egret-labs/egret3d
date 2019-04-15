const { describe, it } = require('mocha');
const assert = require('assert');

////////////////
global.DEBUG = true;
global.window = global;
////////////////

const { Entity } = require('../out/ecs/Entity');
const { Reflect } = require('../out/basic/Reflect');
const { ObjectFactory } = require('../out/egret/ObjectFactory');
const { Application } = require('../out/egret/Application');
const Serialize = require('../out/serialize/Serialize');
const { HideFlagsComponent } = require('../out/serialize/component/HideFlagsComponent');

const app = new Application();
app.initialize({ playerMode: 'normal' });

const entity = new Entity();
entity.initialize(true, app.systemManager.getContext(Entity));

describe('Reflect', () => {
    it('类对象 -> 类名', () => {
        assert(Reflect.getQualifiedClassName(entity) === 'Entity');
    });
    it('类 -> 类名', () => {
        assert(Reflect.getQualifiedClassName(Entity) === 'Entity');
    });
    it('类名 -> 类', () => {
        assert(Reflect.getDefinitionByName('Entity') === Entity);
    });
});
describe('Serialize', () => {
    const hideFlags = entity.addComponent(HideFlagsComponent);
    const serialData = Serialize.serialize(entity);
    const copy = Serialize.deserialize(serialData);

    describe('普通属性', () => {
        it('enable 属性应该相等', () => {
            assert(entity.enabled === copy.enabled);
        });
    });
    describe('特殊属性', () => {
        it('默认反序列化不保持 uuid', () => {
            assert(entity.uuid !== copy.uuid);
        });
        it('设置反序列化保持 uuid', () => {
            const another = Serialize.deserialize(serialData, { prefab: { keepUUID: true }});
            assert(entity.uuid === another.uuid);
        });
    });
    describe('子组件', () => {
        it('拥有相同类型的子组件', () => {
            const hideFlagsOfCopy = copy.getComponent(HideFlagsComponent);
            assert(hideFlagsOfCopy);
        });
        it('对应子组件的属性相同', () => {
            const hideFlagsOfCopy = copy.getComponent(HideFlagsComponent);
            assert(hideFlagsOfCopy && hideFlagsOfCopy.dontSave === hideFlags.dontSave);
        });
    });
});