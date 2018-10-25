# Egret3D 示例

## 如何运行

* $`egret clean` (每次引擎或插件有升级都要执行此命令)
* $`egret bake` (每次添加新的资源后都要执行此命令)
* $`egret run`

## 如何编译

* $`egret build`

## 如何添加一个例子

* 在 [src/examples/](src/examples/) 文件夹下添加一个新的 `TypeScript` 例子文件即可，可以参考 [src/examples/Test.ts](src/examples/Test.ts)
* 新增加的 `TypeScript` 例子文件中，命名空间一定要是 `examples`。（这是示例文件可以在 GUI 选择器中被自动筛选的规则）