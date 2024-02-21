---
order: 2
title: 相机组件
type: 相机
label: Camera
---

相机组件可以将 3D 场景投影到 2D 屏幕上，基于相机组件，我们可以定制各种不同的渲染效果。

首先需要将相机组件挂载到在场景中已激活的 [Entity](${docs}core-entity) 上，编辑器项目通常已经自带了相机组件，当然我们也可以自己手动添加。

<img src="https://gw.alipayobjects.com/zos/OasisHub/c6a1a344-630c-40c6-88ef-abb447cfd183/image-20231009114711623.png" alt="image-20231009114711623" style="zoom:50%;" />

添加完毕后，就可以在检查器里可以查看相机属性，并且左下角的相机预览可以方便地查看项目实际运行时的相机效果：

<img src="https://gw.alipayobjects.com/zos/OasisHub/24fa20d2-8f50-49bd-907a-3806f31e462e/image-20231009114816056.png" alt="image-20231009114816056" style="zoom:50%;" />

您也可以在脚本中通过如下代码为 [Entity](${docs}core-entity) 挂载相机组件：

```typescript
// 创建实体
const entity = root.createChild("cameraEntity");
// 创建相机组件
const camera = entity.addComponent(Camera);
```

## 属性

通过修改相机组件的属性可以定制渲染效果。下方是相机组件在 **[检查器面板](${docs}interface-inspector)** 暴露的属性设置。

![image.png](https://mdn.alipayobjects.com/huamei_yo47yq/afts/img/A*Za1RSJcYrSMAAAAAAAAAAAAADhuCAQ/original)

也可以通过脚本去获取相机组件并设置相应的属性。

```typescript
// 从挂载相机的节点上获取相机组件
const camera = entity.getComponent(Camera);
// 设置相机类型
camera.isOrthographic = true;
// 设置相机的近平面
camera.nearClipPlane = 0.1;
// 设置相机的远平面
camera.farClipPlane = 100;
// 设置相机的 FOV（角度制）
camera.fieldOfView = 45;
// 设置相机在画布上的渲染区域（归一化）
camera.viewport = new Vector4(0, 0, 1, 1);
// 设置相机的渲染优先级（值越小，渲染优先级越高）
camera.priority = 0;
// 设置相机是否开启视锥体裁剪
camera.enableFrustumCulling = true;
// 设置相机渲染前的清除标记
camera.clearFlags = CameraClearFlags.All;
```

其中每个属性对应的功能如下：

| 类型     | 属性                                                           | 解释                                                                                                   |
| :------- | :------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| 通用     | [isOrthographic](${api}core/Camera#isOrthographic)             | 通过设置 [isOrthographic](${api}core/Camera#isOrthographic) 来决定透视投影或正交投影。，默认是 `false` |
|          | [nearClipPlane](${api}core/Camera#nearClipPlane)               | 近裁剪平面                                                                                             |
|          | [farClipPlane](${api}core/Camera#farClipPlane)                 | 远裁剪平面                                                                                             |
|          | [viewport](${api}core/Camera#viewport)                         | 视口，确定内容最后被渲染到目标设备里的范围。                                                           |
|          | [priority](${api}core/Camera#priority)                         | 渲染优先级，用来确定在多相机的情况下按照什么顺序去渲染相机包含的内容。                                 |
|          | [enableFrustumCulling](${api}core/Camera#enableFrustumCulling) | 是否开启视锥剔除，默认为 `true`                                                                        |
|          | [clearFlags](${api}core/Camera#clearFlags)                     | 在渲染这个相机前清理画布缓冲的标记                                                                     |
|          | [cullingMask](${api}core/Camera#cullingMask)                   | 裁剪遮罩，用来选择性地渲染场景中的渲染组件。                                                           |
|          | [aspectRatio](${api}core/Camera#aspectRatio)                   | 渲染目标的宽高比，一般是根据 canvas 大小自动计算，也可以手动改变（不推荐）                             |
|          | [renderTarget](${api}core/Camera#renderTarget)                 | 渲染目标，确定内容被渲染到哪个目标上。                                                                 |
|          | [pixelViewport](${api}core/Camera#pixelViewport)               | 屏幕上相机的视口（以像素坐标表示）。 在像素屏幕坐标中，左上角为(0, 0)，右下角为(1.0, 1.0)。            |
| 透视投影 | [fieldOfView](${api}core/Camera#fieldOfView)                   | 视角                                                                                                   |
| 正交投影 | [orthographicSize](${api}core/Camera#orthographicSize)         | 正交模式下相机的一半尺寸                                                                               |
|          | [depthTextureMode](<(${api}core/Camera#depthTextureMode)>)     | 深度模式，默认为`DepthTextureMode.None`                                                                |

### 裁剪遮罩

相机组件可以通过设置 `cullingMask` 选择性地渲染场景内的渲染组件

<playground src="culling-mask.ts"></playground>

### 渲染目标

相机组件可以通过设置 `renderTarget` 将渲染结果渲染到不同的目标上。

<playground src="multi-camera.ts"></playground>

### 视锥剔除

`enableFrustumCulling` 属性默认是开启的，因为对于三维世界来说，“看不见的东西就不需要渲染”是个很自然的逻辑，属于最基本的性能优化。关闭视锥剔除意味着关闭此项优化。如果你想保留此项优化，而只想让某个节点始终渲染，可以把节点的渲染器的包围盒设置成无限大。

<playground src="renderer-cull.ts"></playground>

## 方法

相机组件提供各种方法（主要涉及`渲染`与`空间转换`）方便开发者实现期望的定制能力。

| 类型     | 属性                                                               | 解释                                     |
| :------- | :----------------------------------------------------------------- | :--------------------------------------- |
| 渲染     | [resetProjectionMatrix](${api}core/Camera#resetProjectionMatrix)   | 重置自定义投影矩阵，恢复到自动模式。     |
|          | [resetAspectRatio](${api}core/Camera#resetAspectRatio)             | 重置自定义渲染横纵比，恢复到自动模式。   |
|          | [render](${api}core/Camera#render)                                 | 手动渲染。                               |
|          | [setReplacementShader](${api}core/Camera#setReplacementShader)     | 设置全局渲染替换着色器。                 |
|          | [resetReplacementShader](${api}core/Camera#resetReplacementShader) | 清空全局渲染替换着色器。                 |
| 空间转换 | [worldToViewportPoint](${api}core/Camera#worldToViewportPoint)     | 将一个点从世界空间转换到视口空间。       |
|          | [viewportToWorldPoint](${api}core/Camera#viewportToWorldPoint)     | 将一个点从视口空间转换到世界空间。       |
|          | [viewportPointToRay](${api}core/Camera#viewportPointToRay)         | 通过视口空间中的一个点生成世界空间射线。 |
|          | [screenToViewportPoint](${api}core/Camera#screenToViewportPoint)   | 将一个点从屏幕空间转换到视口空间。       |
|          | [viewportToScreenPoint](${api}core/Camera#viewportToScreenPoint)   | 将一个点从视口空间转换到屏幕空间。       |
|          | [worldToScreenPoint](${api}core/Camera#worldToScreenPoint)         | 将一个点从世界空间转换到屏幕空间。       |
|          | [screenToWorldPoint](${api}core/Camera#screenToWorldPoint)         | 将一个点从屏幕空间转换到世界空间。       |
|          | [screenPointToRay](${api}core/Camera#screenPointToRay)             | 通过屏幕空间中的一个点生成世界空间射线。 |

## 获取相机组件

在清楚相机组件挂载在哪个节点的前提下，可直接通过 `getComponent` 或 `getComponentsIncludeChildren` 获取：

```typescript
// 从挂载相机的节点上获取相机组件
const camera = entity.getComponent(Camera);
// 从挂载相机节点的父节点上获取相机组件（不推荐）
const cameras = entity.getComponentsIncludeChildren(Camera, []);
```

若不清楚相机组件挂载的节点，也可以通过较为 Hack 的方式获取场景中的所有相机组件：

```typescript
// 获取这个场景中的所有相机组件（不推荐）
const cameras = scene._activeCameras;
```

## onBeginRender 与 onEndRender

相机组件额外包含了 [onBeginRender](${api}core/Script#onBeginRender) 与 [onEndRender](${api}core/Script#onEndRender) 两个生命周期回调，它们的时序可参考[脚本生命周期时序图](${docs}script)
