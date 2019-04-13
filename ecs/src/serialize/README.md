# 序列化

## 设计意图

其作用就是把 `Entity` 与 `Component` 序列化为一个中间格式, 然后这个中间格式通过各种扩展的形式可以转换为 json, binary 等各种格式

序列化模块应该只依赖 ecs 核心概念的 `Entity` 与 `Component`

### 扩展点

* 序列化格式
* 对象创建工厂
* Entity / Component / Property 层面的序列化/反序列化

## 注意事项

一些字段需要成为保留字, 如果用户的数据结构中使用了如下键值, 会对序列化系统造成影响

```ts
export const KEY_SERIALIZE: keyof ISerializable = "serialize";
export const KEY_UUID: keyof IUUID = "uuid";
export const KEY_CLASS = "class";
export const KEY_DESERIALIZE = "deserialize";
export const KEY_COMPONENTS = "components";
export const KEY_ENTITIES = "entities";
export const KEY_CHILDREN = "children";
```

## TODO

* [ ] 规范类型判断
* [ ] 规范插件接口
* [ ] 规范错误处理
* [ ] prefab 支持
* [ ] MissingComponent 可以对用户更友善
* [ ] 去掉 any
* [ ] uuid 生成策略