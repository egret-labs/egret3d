# 序列化

## 设计意图

其作用就是把 `Entity` 与 `Component` 序列化为一个中间格式, 然后这个中间格式通过各种扩展的形式可以转换为 json, binary 等各种格式

序列化模块应该只依赖 ecs 核心概念的 `Entity` 与 `Component`

### 扩展点

* 序列化格式
* 对象创建工厂
* Entity / Component / Property 层面的序列化/反序列化

## 注意事项

## TODO

* 规范类型判断
* 规范错误处理