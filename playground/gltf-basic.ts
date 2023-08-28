/**
 * @title GLTF Basic
 * @category Basic
 */
import {
  AssetType,
  Camera,
  Entity,
  Layer,
  Script,
  Sprite,
  SpriteAtlas,
  SpriteMask,
  SpriteMaskInteraction,
  SpriteRenderer,
  Texture2D,
  TextureFormat,
  Vector2,
  WebGLEngine,
  Color,
  MeshRenderer,
  PrimitiveMesh,
  UnlitMaterial,
  Shader,
  Material,
  GLTFResource,
  BlendFactor,
  CullMode,
  RenderQueueType,
} from "@galacean/engine";

WebGLEngine.create({ canvas: "canvas" }).then((engine) => {
  engine.canvas.resizeByClientSize();

  const rootEntity = engine.sceneManager.activeScene.createRootEntity();

  const cameraEntity = rootEntity.createChild("camera");
  const camera = cameraEntity.addComponent(Camera);
  camera.isOrthographic = true;
  camera.orthographicSize = 5;
  cameraEntity.transform.setPosition(0, 0, 1);
  engine.sceneManager.activeScene.background.solidColor = new Color(0, 0, 0, 1);
  try {
    // 加载所需图片
    engine.resourceManager
      .load([
        {
          // 底图
          url: "https://mdn.alipayobjects.com/huamei_w6ifet/afts/img/A*fRVvSbMK34kAAAAAAAAAAAAADjCHAQ/original",
          type: AssetType.Texture2D,
        },
        // {
        //   // 进度条
        //   url: "https://mdn.alipayobjects.com/huamei_w6ifet/afts/img/A*CWBSSrRCAysAAAAAAAAAAAAADjCHAQ/original",
        //   type: AssetType.Texture2D,
        // },
        // {
        //   // 进度控制
        //   url: "https://mdn.alipayobjects.com/huamei_w6ifet/afts/img/A*O_krQ7FFlfUAAAAAAAAAAAAADjCHAQ/original",
        //   type: AssetType.Texture2D,
        // },
        {
          // 顶部横条
          url: "https://mdn.alipayobjects.com/huamei_w6ifet/afts/img/A*Hb2sRKLgFaUAAAAAAAAAAAAADjCHAQ/original",
          type: AssetType.Texture2D,
        },
        {
          // 数字滚动
          url: "https://mdn.alipayobjects.com/oasis_be/afts/file/A*9zNzRaIxAsIAAAAAAAAAAAAADkp5AQ/SpriteAtlas.json",
          type: AssetType.SpriteAtlas,
        },
        // {
        //   // 进度条模型
        //   url: "https://mdn.alipayobjects.com/oasis_be/afts/file/A*nsySSZx8vSgAAAAAAAAAAAAADkp5AQ/JDT2.glb",
        //   type: AssetType.GLTF,
        // },
        // {
        //   // 进度条贴图
        //   url: "https://mdn.alipayobjects.com/huamei_w6ifet/afts/img/A*AlrEQra9pswAAAAAAAAAAAAADjCHAQ/original",
        //   type: AssetType.Texture2D,
        // },
        {
          // 进度条模型
          url: "https://mdn.alipayobjects.com/oasis_be/afts/file/A*a9q0SavO-ekAAAAAAAAAAAAADkp5AQ/JDT(3).glb",
          type: AssetType.GLTF,
        },
        {
          // 进度条贴图
          url: "https://mdn.alipayobjects.com/huamei_w6ifet/afts/img/A*DoxRSp4zLlkAAAAAAAAAAAAADjCHAQ/original",
          type: AssetType.Texture2D,
        },
      ])
      .then((resources) => {
        // 百分比
        const progress = 100 / 10000;

        // 数字滚动
        const rollNumEntity = rootEntity.createChild("number");
        rollNumEntity.transform.setPosition(2.51, 0.61, 0);
        const num = rollNumEntity.addComponent(RollNumber);
        num.atlas = resources[2] as SpriteAtlas;
        num.additionalDisplay = 0.1;
        // num.digits = 0;
        num.showNum(100);

        num.play(0, 3666, 5);

        setTimeout(() => {
          num.play(0, 7851, 5);
        }, 2000);

        setTimeout(() => {
          num.play(0, 444, 5);
        }, 8000);

        // // 进度条
        // const progressBarEntity = rootEntity.createChild("progress-bar");
        // progressBarEntity.transform.setPosition(1.58, -0.03, 0);
        // const progressBar = progressBarEntity.addComponent(ProgressBar);
        // progressBar.init(
        //   <Texture2D>resources[0],
        //   <Texture2D>resources[1],
        //   <GLTFResource>resources[3],
        //   <Texture2D>resources[4]
        // );
        // progressBar.play(progress, () => {
        //   num.play(0, 0.21, 2);
        // });
      });
  } catch (error) {
    debugger;
    console.log(error);
  }

  engine.run();

  engine.run();
});

enum RollType {
  Increase,
  Reduce,
}

export class RollNumber extends Script {
  // 数字上下部分 mask 高度（以数字高度为基准归一化）
  private _additionalDisplay: number = 0.5;
  // 小数点后保留几位
  private _digits = 2;
  // 使用的精灵图集
  private _atlas: SpriteAtlas;
  private _numMap: Sprite[] = [];
  // 滚动数字组件数组
  private _numArr: NumberList[] = [];
  // 当前显示的金额
  private _cur: number = 0;
  // 起始金额
  private _from: number = 0;
  // 结束金额
  private _to: number = 0;
  // 当前滚动类型
  private _rollType: RollType = RollType.Increase;
  // 是否正在播放
  private _playing: boolean = false;
  // 起始时间
  private _sTime: number;
  // 结束时间
  private _eTime: number;
  // 花费时间
  private _uTime: number;
  // 当前最高位下标
  private _curRollIdx: number = 0;
  // 单数字宽度
  private _numWidth: number;
  // 单数字高度
  private _numHeight: number;
  // 小数点宽度
  private _dotWidth: number;
  // 前缀
  private _prefix: Entity;
  private _prefixRenderer: SpriteRenderer;
  // 小数点
  private _dot: Entity;
  private _dotRenderer: SpriteRenderer;
  // 遮罩
  private _mask: SpriteMask;

  /**
   * 小数点后保留几位
   */
  get digits(): number {
    return this.digits;
  }

  set digits(val: number) {
    if (this._digits !== val) {
      if (this._playing) {
        console.log("不能在滚动时改变 digits");
      } else {
        this._digits = val;
        this.showNum(this._cur);
      }
    }
  }

  /**
   * 数字使用的图集
   */
  get atlas(): SpriteAtlas {
    return this._atlas;
  }

  set atlas(val: SpriteAtlas) {
    if (this._atlas !== val) {
      this._atlas = val;
      // 预处理精灵，将锚点设置在右侧中间位置
      const { sprites } = val;
      for (let i = 0, n = sprites.length; i < n; i++) {
        sprites[i].pivot = new Vector2(1, 0.5);
      }
      this._prefixRenderer.sprite = val.getSprite("Assets/money");
      this._dotRenderer.sprite = val.getSprite("Assets/dot");
      this._dotWidth = val.getSprite("Assets/dot").width;

      const { _numMap: numMap } = this;
      for (let i = 0; i < 10; i++) {
        numMap[i] = val.getSprite("Assets/" + i);
      }
      const numSprite = numMap[0];
      this._numWidth = numSprite.width;
      this._numHeight = numSprite.height;
      // 更新已有的数字配置
      const { _numArr: numArr } = this;
      for (let i = numArr.length - 1; i >= 0; i--) {
        numArr[i].numMap = numMap;
      }
      // 更新遮罩的尺寸
      this._updateMaskSize();
    }
  }

  /**
   * 上下遮罩的高度
   */
  get additionalDisplay(): number {
    return this._additionalDisplay;
  }

  set additionalDisplay(val: number) {
    if (this._additionalDisplay !== val) {
      this._additionalDisplay = val;
      // 设置已有的数字配置
      const { _numArr: numArr } = this;
      for (let i = numArr.length - 1; i >= 0; i--) {
        numArr[i].additionalDisplay = val;
      }
      // 更新遮罩的尺寸
      this._updateMaskSize();
    }
  }

  /**
   * 播放数值变化的动画
   * @param from - 起始金额
   * @param to - 结束金额
   * @param time - 花费时间
   * @returns
   */
  play(from: number, to: number, time: number): void {
    // 金额配置（起始，结束）
    this._from = from;
    this._to = to;
    // 显示起始金额
    this.showNum(from);
    if (to === from) {
      console.log("RollNumber.play: form 与 to 相等");
      return;
    } else if (to > from) {
      this._rollType = RollType.Increase;
    } else {
      this._rollType = RollType.Reduce;
    }

    // 时间配置（起始，结束，花费）
    const nowTime = this.engine.time.actualElapsedTime;
    this._sTime = nowTime;
    this._eTime = nowTime + time;
    this._uTime = time;

    // 为右边第一个数增加滚动
    const { _digits: digits } = this;
    const base = Math.pow(10, digits);
    const newFrom = from * base;
    const newTo = to * base;
    this._numArr[0].roll(
      newTo - newFrom,
      newFrom % 10,
      newTo % 10,
      nowTime + time
    );
    this._curRollIdx = 0;
    this._playing = true;
  }

  /**
   * 显示数
   * @param num
   * @returns 这个数包含的字符（包括小数点）
   */
  showNum(num: number): void {
    this._cur = num;
    // 1. 至少需要显示 digits + 1 个数字，如 0.00
    // 2. 此处将 num 乘以 Math.pow(10, digits) 来将小数部分转变为整数
    const { _digits: digits, _numArr: numArr, entity } = this;
    num = num * Math.pow(10, digits);
    const need = Math.max((num + "").length, digits + 1);
    const exit = numArr.length;
    const max = Math.max(need, exit);
    for (let i = 0; i < max; i++) {
      if (i >= need) {
        const numList = numArr[i];
        if (numList) {
          numList.hide();
          numList.entity.isActive = false;
        }
      } else {
        const remainder = num % 10;
        const numList = this._getOrCreateNumberList(i);
        numList.show(remainder);
        num = Math.floor(num / 10);
      }
    }
    // show 会打断 play 状态
    this._playing = false;
    // 维护前缀与小数点的位置
    this._maintainPos();
  }

  /**
   * 重写父类方法
   * @param deltaTime
   * @returns
   */
  override onUpdate(deltaTime: number): void {
    if (!this._playing) {
      return;
    }
    const nowTime = this.engine.time.actualElapsedTime;
    if (nowTime < this._eTime) {
      switch (this._rollType) {
        case RollType.Increase:
          // 检查进位
          this._updateFill();
          break;
        case RollType.Reduce:
        // Todo: 检查弃位
        default:
          break;
      }
    } else {
      // 保证最终显示正确
      this.showNum(this._to);
      this._playing = false;
    }
  }

  /**
   * 重写父类方法
   * @returns
   */
  override onAwake(): void {
    const { entity, engine } = this;
    // 前缀
    const prefixEntity = (this._prefix = entity.createChild("prefix"));
    this._prefixRenderer = prefixEntity.addComponent(SpriteRenderer);
    // 小数点
    const dotEntity = (this._dot = entity.createChild("dot"));
    this._dotRenderer = dotEntity.addComponent(SpriteRenderer);
    // 遮罩
    this._mask = entity.createChild("mask").addComponent(SpriteMask);
    const maskTexture2D = new Texture2D(
      engine,
      1,
      1,
      TextureFormat.R8G8B8A8,
      false
    );
    maskTexture2D.setPixelBuffer(new Uint8Array([255, 255, 255, 255]));
    maskTexture2D.isGCIgnored = true;
    const sprite = new Sprite(engine, maskTexture2D);
    sprite.pivot = new Vector2(1, 0.5);
    this._mask.sprite = sprite;
    this._mask.influenceLayers = Layer.Layer20;
  }

  /**
   * 维护数字，小数点和前缀的位置
   * @param count
   */
  private _maintainPos() {
    const { _digits: digits, _numArr: numArr } = this;
    const { _numWidth, _dotWidth } = this;
    let i = 0;
    for (let n = numArr.length; i < n; i++) {
      const entity = numArr[i].entity;
      if (entity.isActive) {
        if (digits === 0 || i < digits) {
          entity.transform.setPosition(-i * _numWidth, 0, 0);
        } else {
          entity.transform.setPosition(-i * _numWidth - _dotWidth, 0, 0);
        }
      } else {
        break;
      }
    }

    const { _dot, _prefix } = this;
    if (digits === 0) {
      _dot.isActive = false;
      _prefix.transform.setPosition(-i * _numWidth, 0, 0);
    } else {
      _dot.isActive = true;
      _dot.transform.setPosition(-digits * _numWidth, 0, 0);
      _prefix.transform.setPosition(-i * _numWidth - _dotWidth, 0, 0);
    }
  }

  /**
   * 更新补位
   */
  private _updateFill(): void {
    let { _digits: digits, _curRollIdx: curRollIdx, _numArr: numArr } = this;
    const target = this._to * Math.pow(10, digits);
    const targetStr = target.toFixed(0);
    // 1. 当前数字位数没有达到最终位数
    // 2. NumberList 确认可以补位
    if (numArr[curRollIdx].needFill() && curRollIdx < targetStr.length - 1) {
      curRollIdx = ++this._curRollIdx;
      const numberList = this._getOrCreateNumberList(curRollIdx);
      numberList.show(0);
      const rollCount = Math.floor(target / Math.pow(10, curRollIdx));
      numberList.roll(rollCount, 0, rollCount % 10, this._eTime);
      this._maintainPos();
    }
  }

  /**
   * 获取或创建 NumberList
   * @param idx
   */
  private _getOrCreateNumberList(idx: number): NumberList {
    const { _numArr: numArr } = this;
    let numberList = numArr[idx];
    if (numberList) {
      numberList.entity.isActive = true;
    } else {
      const entity = this.entity.createChild();
      numberList = numArr[idx] = entity.addComponent(NumberList);
      numberList.numMap = this._numMap;
      numberList.additionalDisplay = this._additionalDisplay;
    }
    return numberList;
  }

  /**
   * 更新遮罩，以下两种行为都会触发遮罩尺寸重置
   * 1. 遮罩区域改变
   * 2. 数字尺寸改变
   */
  private _updateMaskSize(): void {
    const { _mask: mask } = this;
    mask.width = 7.5;
    mask.height = (1 + 2 * this._additionalDisplay) * this._numHeight;
  }
}

export class NumberList extends Script {
  // 数字上下遮罩区（以数字高度为基准归一化）
  private _additionalDisplay: number = 0.5;
  // 使用的数字精灵映射（存放 0 ～ 9 的精灵映射）
  private _numMap: Sprite[];
  // 数字精灵真实高度
  private _numberHeight: number = 0.5;
  // 数字精灵渲染器
  private _renderers: SpriteRenderer[] = [];
  private _rollCount: number;
  private _from: number;
  private _to: number;
  private _sTime: number;
  private _eTime: number;
  private _uTime: number;
  private _playing: boolean = false;

  get additionalDisplay(): number {
    return this._additionalDisplay;
  }

  set additionalDisplay(val: number) {
    this._additionalDisplay = val;
  }

  get numMap(): Sprite[] {
    return this._numMap;
  }

  set numMap(val: Sprite[]) {
    this._numMap = val;
    this._numberHeight = val[0].height;
  }

  /**
   * 单个数字滚动
   * @param rollCount
   * @param from
   * @param to
   * @param endTime
   * @param limit 若为 true, 会滚动最短路径，否则将滚动 rollCount 次
   */
  roll(
    rollCount: number,
    from: number,
    to: number,
    endTime: number,
    limit: boolean = true
  ): void {
    const nowTime = this.engine.time.actualElapsedTime;
    this._from = from;
    this._to = to;
    this._sTime = nowTime;
    this._eTime = endTime;
    this._uTime = endTime - nowTime;
    if (rollCount !== 0) {
      if (limit) {
        rollCount = rollCount % 10 === 0 ? 10 : (rollCount %= 10);
      }
      this._playing = true;
    } else {
      this._playing = false;
    }
    this._rollCount = rollCount;
  }

  /**
   * 显示某个数字
   * @param char
   * @returns
   */
  show(num: number): void {
    this._playing = false;
    const { _renderers: renderers } = this;
    for (let i = renderers.length - 1; i >= 1; i--) {
      renderers[i].entity.isActive = false;
    }
    const spriteRenderer = this._getOrCreateRenderer(0);
    spriteRenderer.entity.transform.setPosition(0, 0, 0);
    spriteRenderer.sprite = this._getSprite(num);
  }

  /**
   * 隐藏，主要是清除状态
   */
  hide(): void {
    this._playing = false;
    const { _renderers: renderers } = this;
    for (let i = renderers.length - 1; i >= 0; i--) {
      renderers[i].entity.isActive = false;
    }
  }

  /**
   * 检查是否需要进位
   * @returns
   */
  needFill(): boolean {
    const nowTime = this.engine.time.actualElapsedTime;
    const t = Ease.quadInOut((nowTime - this._sTime) / this._uTime);
    return t >= 0.1;
  }

  /**
   * 检查是否需要弃位
   * @returns
   */
  needDrop(): boolean {
    const nowTime = this.engine.time.actualElapsedTime;
    const t = Ease.quadInOut((nowTime - this._sTime) / this._uTime);
    return this._to === 0 && t >= 0.9;
  }

  /**
   * 重写 onUpdate 函数
   * @param deltaTime
   * @returns
   */
  override onUpdate(deltaTime: number): void {
    if (!this._playing) {
      return;
    }
    const nowTime = this.engine.time.actualElapsedTime;
    if (nowTime >= this._eTime) {
      this._playing = false;
      return;
    }
    const t = Ease.quadInOut((nowTime - this._sTime) / this._uTime);
    const curCount = t * this._rollCount;
    // 当前指针在的位置
    const cur = 0.5 + curCount;
    // 上侧
    const up = cur - 0.5 - this._additionalDisplay;
    // 下侧
    const down = cur + 0.5 + this._additionalDisplay;
    const { _renderers: renderers, _numberHeight: numberHeight } = this;
    const start = Math.floor(up);
    const end = Math.min(Math.floor(down), this._rollCount);
    const needCount = end - start + 1;
    const exitCount = renderers.length;
    const maxCount = Math.max(needCount, exitCount);
    const startNumber = (start + this._from) % 10;
    for (let i = 0; i < maxCount; i++) {
      if (i < needCount) {
        const spriteRenderer = this._getOrCreateRenderer(i);
        // 确定位置
        const y = cur - (start + i) - 0.5;
        spriteRenderer.entity.transform.setPosition(0, y * numberHeight, 0);
        // 确定数字
        const num = (startNumber + i) % 10;
        spriteRenderer.sprite = this._getSprite(num);
      } else {
        renderers[i] && (renderers[i].entity.isActive = false);
      }
    }
  }

  /**
   * 获取这个 renderer
   * @param idx
   * @returns
   */
  private _getOrCreateRenderer(idx: number): SpriteRenderer {
    const { _renderers: renderers } = this;
    let renderer = renderers[idx];
    if (renderer) {
      renderer.entity.isActive = true;
    } else {
      const entity = this.entity.createChild("renderer" + idx);
      renderer = renderers[idx] = entity.addComponent(SpriteRenderer);
      renderer.maskLayer = Layer.Layer20;
      renderer.maskInteraction = SpriteMaskInteraction.VisibleInsideMask;
    }
    return renderer;
  }

  /**
   * 获取特定的精灵
   * @param char
   * @returns
   */
  private _getSprite(num: number): Sprite | null {
    if (num >= 0 && num < 10) {
      return this._numMap[num];
    } else {
      return null;
    }
  }
}

export class Ease {
  static linear(t: number): number {
    return t;
  }

  static quadIn(t: number): number {
    return Math.pow(t, 2);
  }

  static quadOut(t: number): number {
    return 1 - Math.pow(1 - t, 2);
  }

  static quadInOut(t: number): number {
    if ((t *= 2) < 1) return 0.5 * Math.pow(t, 2);
    return 1 - 0.5 * Math.abs(Math.pow(2 - t, 2));
  }

  static cubicIn(t: number): number {
    return Math.pow(t, 3);
  }

  static cubicOut(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  static cubicInOut(t: number): number {
    if ((t *= 2) < 1) return 0.5 * Math.pow(t, 3);
    return 1 - 0.5 * Math.abs(Math.pow(2 - t, 3));
  }

  static quartIn(t: number): number {
    return Math.pow(t, 4);
  }

  static quartOut(t: number): number {
    return 1 - Math.pow(1 - t, 4);
  }

  static quartInOut(t: number): number {
    if ((t *= 2) < 1) return 0.5 * Math.pow(t, 4);
    return 1 - 0.5 * Math.abs(Math.pow(2 - t, 4));
  }

  static quintIn(t: number): number {
    return Math.pow(t, 5);
  }

  static quintOut(t: number): number {
    return 1 - Math.pow(1 - t, 5);
  }

  static quintInOut(t: number): number {
    if ((t *= 2) < 1) return 0.5 * Math.pow(t, 5);
    return 1 - 0.5 * Math.abs(Math.pow(2 - t, 5));
  }

  static sineIn(t: number): number {
    return 1 - Math.cos((t * Math.PI) / 2);
  }

  static sineOut(t: number): number {
    return Math.sin((t * Math.PI) / 2);
  }

  static sineInOut(t: number): number {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
  }

  static circIn(t: number): number {
    return -(Math.sqrt(1 - t * t) - 1);
  }

  static circOut(t: number): number {
    return Math.sqrt(1 - --t * t);
  }

  static circInOut(t: number): number {
    if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
    return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
  }
}

const spriteVertShader = `
  precision highp float;

  uniform mat4 renderer_MVPMat;

  attribute vec3 POSITION;
  attribute vec2 TEXCOORD_0;

  varying vec4 v_color;
  varying vec2 v_uv;

  void main()
  {
    gl_Position = renderer_MVPMat * vec4(POSITION, 1.0);
    v_uv = TEXCOORD_0;
  }
`;

const spriteFragmentShader = `
  precision mediump float;
  precision mediump int;

  uniform sampler2D material_BaseTexture;
  uniform float u_threshold;

  varying vec2 v_uv;

  vec4 lerp(vec4 a, vec4 b, float w) {
    return a + w * (b - a);
  }

  void main() {
    float diff = v_uv.x - u_threshold;
    if (diff >= 0.0) {
      discard;
    }

    gl_FragColor = texture2D(material_BaseTexture, v_uv);
  }
`;

Shader.create("ProgressBar", spriteVertShader, spriteFragmentShader);

const linePoses = [
  { x: 1.25, y: -0.5 }, // %0
  { x: 1.3, y: -0.4 }, // %10
  { x: 1.35, y: -0.3 }, // %20
  { x: 1.4, y: -0.15 }, // %30
  { x: 1.48, y: -0.03 }, // %40
  { x: 1.54, y: 0.09 }, // %50
  { x: 1.6, y: 0.23 }, // %60
  { x: 1.68, y: 0.4 }, // %70
  { x: 1.75, y: 0.57 }, // %80
  { x: 1.82, y: 0.74 }, // %90
  { x: 1.85, y: 0.808 }, // %100
];

enum State {
  None,
  GoFull, // 第一步，先走到 100%
  GoProgress, // 第二步，从 100% 回退到真正的进度
  ShowLine, // 第三步，进度这里出现横条
}

export class ProgressBar extends Script {
  static _tempVec2: Vector2 = new Vector2();
  private _hasInit: boolean = false;
  private _material: Material;
  private _curThreshold: number = 0;
  private _progress: number = 0; // 进度
  private _progressThreshold: number = 0; // 进度对应的阀值
  private _cb: Function | null = null;
  private _curState: State = State.None;
  private _goFullSpeed = 0.5;
  private _goProgressSpeed = 1;
  private _lineEnitty: Entity;
  private _lineMaskEntity: Entity;
  private _lineSpeed = 0; // 根据横条宽度计算
  private _lineDistance = 0; // 根据横条计算 Mask 最大距离
  private _startU: number = 0.708; // 进度条 0 开始的 U

  onUpdate(dt: number) {
    if (this._hasInit && this._curState !== State.None) {
      switch (this._curState) {
        case State.GoFull:
          const curThreshold = this._curThreshold + dt * this._goFullSpeed;
          // 开始走进度
          if (
            this._curThreshold < this._startU &&
            curThreshold >= this._startU
          ) {
            this._cb && this._cb();
          }
          if (curThreshold >= 1) {
            this._curThreshold = 1;
            this._progressThreshold = this._calculateProgressThreshold();
            this._curState = State.GoProgress;
          }
          this._curThreshold = curThreshold;
          this._material.shaderData.setFloat("u_threshold", curThreshold);
          break;
        case State.GoProgress:
          this._curThreshold -= dt * this._goProgressSpeed;
          if (
            this._curThreshold <= this._progressThreshold ||
            this._progress >= 1
          ) {
            this._curThreshold = this._progressThreshold;
            this._lineEnitty.isActive = true;
            const pos = ProgressBar._tempVec2;
            this._calculatePos(pos);
            this._lineEnitty.transform.setPosition(pos.x, pos.y, 0);
            this._lineMaskEntity.transform.setPosition(0, 0, 0);
            this._curState = State.ShowLine;
          }
          this._material.shaderData.setFloat("u_threshold", this._curThreshold);
          break;
        case State.ShowLine:
          const distance =
            this._lineMaskEntity.transform.position.x + this._lineSpeed;
          if (distance > this._lineDistance) {
            this._curState = State.None;
          }
          this._lineMaskEntity.transform.position.x = distance;
          break;
      }
    }
  }

  /**
   *
   * @param bgTex - 底图
   * @param lineTex - 横条
   * @param gltf - 进度条模型
   * @param baseTex - 进度条贴图
   */
  init(
    bgTex: Texture2D,
    lineTex: Texture2D,
    gltf: GLTFResource,
    baseTex: Texture2D
  ) {
    const { entity, engine } = this;
    // 底图
    const bgEntity = entity.createChild("bg");
    const bgSprite = bgEntity.addComponent(SpriteRenderer);
    bgSprite.sprite = new Sprite(engine, bgTex);
    bgSprite.priority = -1;

    // 进度条
    const progressEntity = entity.createChild("progress");
    const progress = <Entity>gltf.defaultSceneRoot;
    progressEntity.addChild(progress);
    this._material = this._addMaterial(baseTex);
    const meshRenderer = progress.getComponent(MeshRenderer);
    meshRenderer.setMaterial(this._material);
    const { transform } = progressEntity;
    transform.setScale(100, 100, 100);
    transform.setPosition(-0.01, -0.78, 0);

    // 横条
    const lineEntity = (this._lineEnitty = entity.createChild("line"));
    const lineSprite = lineEntity.addComponent(SpriteRenderer);
    lineSprite.sprite = new Sprite(engine, lineTex);
    lineSprite.priority = 1;
    lineSprite.maskInteraction = SpriteMaskInteraction.VisibleOutsideMask;
    lineEntity.isActive = false;

    // 横条 mask
    const lineMaskEntity = (this._lineMaskEntity =
      lineEntity.createChild("line-mask"));
    const lineMaskSprite = lineMaskEntity.addComponent(SpriteMask);
    lineMaskSprite.sprite = lineSprite.sprite;
    lineMaskSprite.alphaCutoff = 0;
    const width = lineMaskSprite.sprite.width;
    this._lineSpeed = width / 12;
    this._lineDistance = width;

    this._hasInit = true;
  }

  play(progress: number, cb: Function) {
    if (this._progress === progress) {
      return;
    }
    this._progress = progress;
    this._cb = cb;

    // 主要为了处理反复调用
    switch (this._curState) {
      case State.None:
        this._curThreshold = 0;
        this._lineMaskEntity.transform.position.x = 0;
        this._lineEnitty.isActive = false;
        this._curState = State.GoFull;
        break;
      case State.GoProgress:
        this._progressThreshold = this._calculateProgressThreshold();
        break;
      case State.ShowLine:
        this._progressThreshold = this._calculateProgressThreshold();
        this._material.shaderData.setFloat(
          "u_threshold",
          this._progressThreshold
        );
        const pos = ProgressBar._tempVec2;
        this._calculatePos(pos);
        this._lineEnitty.transform.setPosition(pos.x, pos.y, 0);
        break;
    }
  }

  private _addMaterial(baseTexture: Texture2D): Material {
    const material = new Material(this.engine, Shader.find("ProgressBar"));

    // Init state.
    const renderState = material.renderState;
    const target = renderState.blendState.targetBlendState;
    target.enabled = true;
    target.sourceColorBlendFactor = BlendFactor.SourceAlpha;
    target.destinationColorBlendFactor = BlendFactor.OneMinusSourceAlpha;
    target.sourceAlphaBlendFactor = BlendFactor.One;
    target.destinationAlphaBlendFactor = BlendFactor.OneMinusSourceAlpha;
    renderState.depthState.writeEnabled = false;
    renderState.rasterState.cullMode = CullMode.Off;
    material.renderState.renderQueueType = RenderQueueType.Transparent;

    // Set material shader data.
    const { shaderData } = material;
    shaderData.setFloat("u_threshold", this._curThreshold);
    shaderData.setTexture("material_BaseTexture", baseTexture);

    return material;
  }

  private _lerp(t: number, s: number, e: number): number {
    return s + (e - s) * t;
  }

  private _calculateProgressThreshold(): number {
    return this._startU + this._progress * (1 - this._startU);
  }

  private _calculatePos(pos: Vector2) {
    const { _progress } = this;
    const index = _progress >= 1 ? 9 : Math.floor((this._progress * 10) % 10);
    const t = (_progress - index * 0.1) * 10;
    pos.x = this._lerp(t, linePoses[index].x, linePoses[index + 1].x);
    pos.y = this._lerp(t, linePoses[index].y, linePoses[index + 1].y);
  }
}
