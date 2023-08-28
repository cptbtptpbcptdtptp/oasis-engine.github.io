/**
 * @title Script Basic
 * @category Basic
 */
import { OrbitControl } from "@galacean/engine-toolkit-controls";
import {
  AmbientLight,
  Camera,
  DirectLight,
  Texture2D,
  WebGLEngine,
} from "@galacean/engine";
import {
  IAvatarInfoProps,
  ZAvatar,
  AvatarCtrlScript,
} from "@alipay/zavatar-galacean";

WebGLEngine.create({ canvas: "canvas" }).then((engine) => {
  engine.canvas.resizeByClientSize();
  const root = engine.sceneManager.activeScene.createRootEntity();

  const cameraEntity = root.createChild("camera");
  cameraEntity.addComponent(Camera);
  cameraEntity.transform.setPosition(0, 0, 5);
  cameraEntity.addComponent(OrbitControl);

  const lightEntity = root.createChild("light");
  lightEntity.addComponent(DirectLight);

  const avatarData = {
    baseSrc:
      "https://gw.alipayobjects.com/mdn/afts/file/A*6kbCQpLTiYEAAAAAAAAAAAAADrd2AQ/src-female-0531.gltf",
    allAnimations: [
      {
        animationDesc: "打招呼动作",
        animationGltfUrl:
          "https://gw.alipayobjects.com/mdn/oasis_be/afts/file/A*OP2fQqSvbGUAAAAAAAAAAAAADkp5AQ/ANI_Female_hi.glb",
        // animationGltfUrl:
        //   'https://gw.alipayobjects.com/mdn/oasis_be/afts/file/A*OP2fQqSvbGUAAAAAAAAAAAAADkp5AQ/ANI_Female_hi.glb',
        animationName: "ANI_hi",
        animationType: "body",
        avatarTypes: ["alipay_common_female"],
        icon: "",
        id: "ANM2023052500000004",
      },
    ],
  };

  ZAvatar.initAvatar(engine, avatarData as IAvatarInfoProps).then((entity) => {
    // 这几张纹理是复用的，在材质销毁的时候需要保留，所以设置 isGCIgnored
    const texture1 = engine.resourceManager.getFromCache<Texture2D>(
      "https://gw.alipayobjects.com/mdn/afts/img/A*lZ-jS4ZPGhMAAAAAAAAAAAAADrd2AQ/TransparentPixel.png"
    );
    const texture2 = engine.resourceManager.getFromCache<Texture2D>(
      "https://gw.alipayobjects.com/mdn/afts/img/A*XoUjRYi1XcoAAAAAAAAAAAAADrd2AQ/T_SkinRamp1.png"
    );
    const texture3 = engine.resourceManager.getFromCache<Texture2D>(
      "https://gw.alipayobjects.com/mdn/afts/img/A*6IOJQZXp5tIAAAAAAAAAAAAADrd2AQ/shadow.png"
    );
    const hdr = engine.resourceManager.getFromCache<AmbientLight>(
      "https://gw.alipayobjects.com/mdn/afts/file/A*wnpeS5OI7ZoAAAAAAAAAAAAADrd2AQ/EYE_HDR_4.hdr.env"
    );
    texture1.isGCIgnored = true;
    texture2.isGCIgnored = true;
    texture3.isGCIgnored = true;
    hdr.isGCIgnored = true;
    hdr.specularTexture.isGCIgnored = true;

    root.addChild(entity);
    entity.addComponent(AvatarCtrlScript).updateAction("ANI_hi");
    // ------------   销毁逻辑  ----------------
    // 销毁母体与克隆体
    // @ts-ignore
    const motherEntity = entity.children[0]._hookResource.defaultSceneRoot;
    entity.destroy();
    motherEntity.destroy();
    engine.resourceManager.gc();
    // ------------  销毁结束  ----------------

    // ------------  重新加载  ----------------
    setTimeout(() => {
      // ZAvatar.initAvatar(engine, avatarData as IAvatarInfoProps).then(
      //   (entity) => {
      //     root.addChild(entity);
      //   }
      // );
      console.log('okok');
    }, 1000);
    // ------------  重新加载  ----------------
  });

  engine.run();
});
