Egret3D
===========


Egret3D 是白鹭引擎于2018年5月份推出的用于支持3D游戏开发的代码库


设计目标
=================


Egret3D 当前的设计目标是：为 Web平台（包括网页、微信小游戏、微端等形态）提供一款用于快速进行 3D游戏开发的游戏引擎。

与市面上一些其他的 3D 渲染库（ 比如 three.js ）和三维数据可视化框架相比，Egret3D 的核心设计目标更专注为游戏开发领域。


整体结构
=================

Egret3D 的全部源码分别内置于两个命名空间，分别为 egret3d 和 paper。

egret3d 命名空间用于处理三维游戏相关内容，包含模型、纹理、材质、灯光、碰撞等常用功能。

paper 命名空间用于实现与具体游戏引擎（无论是2D 或 3D）无关的组件实体系统框架，用于维护对象的生命周期以及开发模型。


与白鹭引擎的关系
=================

Egret3D 属于白鹭引擎的一部分，使用 Egret3D 必须使用白鹭引擎。

Egret3D 不会处理资源管理、网络通讯相关内容，这一部分交由白鹭引擎的 AssetsManager 进行处理

Egret3D 允许 2D / 3D 混合，所以开发者可以在 Egret3D 中添加原有的 EgretAPI 创建的 2D显示对象，这样您可以使用白鹭引擎的 EUI　组件库和　Egret Wing 编辑器进行 UI 开发。

少部分模块（比如声音）目前在 Egret2D 和 Egret3D 中拥有不同的实现，我们会在后续版本将其统一。



如何开发一款 HTML5 3D 游戏
=================

我们将白鹭引擎3D的潜在开发者用户分类为以下几种情况：


### 用户类型：我有三维游戏开发经验，但是不了解白鹭引擎

这部分开发者的主要来源是 Unity3D 开发者（可能也有部分 Unreal 或者其他游戏引擎的开发者），白鹭引擎提供了较为完整的 Unity导出插件，可以将您的 Unity 场景、材质、动画和预制体导出到白鹭引擎支持的格式，这可以大大加速您将现有的 3D 游戏迁移到白鹭引擎所耗费的时间。

除此之外，您会发现白鹭引擎中提供的组件实体系统 API 和 Unity 非常相似，这也是为了尽可能帮助您降低学习成本而设计的。

对于这部分开发者，我们建议您首先尝试在您现有 Unity 项目中取出相对简单的场景，通过 Unity导出插件，快速尝试运行一个 Egret3D 场景，并进一步学习白鹭引擎的各种功能特性，特别是使用 Egret EUI 进行 UI 搭建。

您可以通过 https://github.com/egret-labs/egret3d-unityplugin 下载和安装 Unity 导出工具


### 用户类型：我很了解白鹭引擎，但是不具备三维游戏开发经验

这部分开发者的主要来源是已经在使用白鹭引擎开发 HTML5 游戏的开发者。一款简单的 3D 游戏与 2D游戏区别不大，但是如果开发目标较为复杂的话，需要额外理解很多概念，比如模型、材质、灯光、摄像机等。在目前阶段，我们建议您最好了解一下三维游戏的常见概念，考虑到 Egret3D 的编辑器预计在 2018年6月底才会发布，我们建议开发者在目前这个阶段使用 Unity 进行编辑然后再导出至 Egret3D中，这也是官方团队在制作最先几个 3D 游戏的做法。



如何使用 Egret3D 开发
==================================

* 通过 EgretLauncher 安装白鹭引擎5.3.0 版本，5.3.0 版本目前没有内置在 EgretLauncher 中，需要开发者在 https://github.com/egret-labs/egret-core/tree/5.3.x 下载，并通过 EgretLauncher 的安装本地引擎功能进行安装

* 打开一个终端，执行 ```npm install @egret/paper-cli -g``` 安装命令行工具
* 执行 ```paper create helloworld``` 创建一个新项目
* 执行 ```cd helloworld``` 进入刚创建的文件夹
* 执行 ```paper install egret3d``` 安装最新的 egret3d 库
* 执行 ```egret build``` 构建项目
* 执行 ```egret run``` 运行项目

更多文档正在编写中，包含 API ，入门教程与示例 Demo


Paper-cli 是什么？
=============================

上文中提到开发者需要安装一个名为 paper-cli 的命令行工具，paper 是白鹭引擎即将发布的组件实体系统编辑器的开发代号，paper-cli 是该工具的命令行工具集。这个工具将负责：

* 创建 3D 项目，该命令将代替 egret create。
* 安装 3D 项目的第三方库，该命令并不是修改第三方库的调用方式，只是提供了一种安装第三方库的简便方法。

而原有的 egret 命令行仍然负责构建与运行工作，我们会在未来的版本将这两个命令行统一。


问题反馈
======================
您可以在 https://github.com/egret-labs/egret3d/issues 反馈您遇到的问题或建议

路线图
=================


0.8 ( 2018.5.25 )
--------------

- [x] Egret3D 第一次发布



0.9 ( 2018.6.1 )
--------------------

- [ ] [支持发布到微信小游戏](https://github.com/egret-labs/egret3d/issues/5)
- [ ] [支持粒子系统](https://github.com/egret-labs/egret3d/issues/4)
- [ ] [通过修改 index.html 中的 data-show-fps 显示和隐藏帧率面板](https://github.com/egret-labs/egret3d/issues/7)
- [x] 修复 paper-cli 在特定情况下的 BUG
  - [x] [修复特定情况下无法执行 paper install egret3d 的BUG](https://github.com/egret-labs/egret3d/issues/6)
  - [x] [修复MacOS / Linux 系统上无法执行paper create helloworld 的 BUG](https://github.com/egret-labs/egret3d/issues/8)
- [ ] 更详细的教程文档


1.0 ( 2018.7 )
----------------------

- [ ] 更完善的材质系统
- [ ] 更完善的碰撞和物理系统
- [ ] 向部分开发者提供 Egret3D 编辑器的内测版，代号“Paper”
- [ ] [重构声音系统](https://github.com/egret-labs/egret3d/issues/3)
- [ ] 性能优化
- [ ] 统一 paper 命令行与 egret 命令行


1.5 ( 2018.9 )
---------------------------
- [ ] 向所有开发者提供 Egret3D 编辑器