---
order: 4
title: 多相机渲染
type: 相机
label: Camera
---

在多个相机的情况下，通过结合相机组件的 [viewport](${api}core/Camera#viewport), [cullingMask](${api}core/Camera#cullingMask), [clearFlags](${api}core/Camera#clearFlags) 等属性完成许多定制化的渲染效果。

比如通过设置 [viewport](${api}core/Camera#viewport) 让多个相机分别在画布的不同位置渲染场景内容。

<playground src="multi-viewport.ts"></playground>

又比如通过设置 [cullingMask](${api}core/Camera#cullingMask) 实现画中画的效果。

<playground src="multi-camera.ts"></playground>
