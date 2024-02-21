---
order: 5
title: 相机深度纹理
type: 相机
label: Camera
---

相机可以通过 [depthTextureMode](<(${api}core/Camera#depthTextureMode)>) 属性开启深度纹理，开启深度纹理后可以通过 `camera_DepthTexture` 属性在 Shader 中访问深度纹理。深度纹理可以用于实现软粒子和水面边缘过渡，以及一些简单的后处理效果。

<playground src="camera-depth-texture.ts"></playground>

注意：深度纹理仅渲染非透明物体。
