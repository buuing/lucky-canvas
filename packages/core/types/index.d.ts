declare type FontItemType = {
    text: string;
    top?: string | number;
    left?: string | number;
    fontColor?: string;
    fontSize?: string;
    fontStyle?: string;
    fontWeight?: string;
    lineHeight?: string;
};
declare type FontExtendType = {
    wordWrap?: boolean;
    lengthLimit?: string | number;
    lineClamp?: number;
};
declare type ImgType = HTMLImageElement | HTMLCanvasElement;
declare type ImgItemType = {
    src: string;
    top?: string | number;
    left?: string | number;
    width?: string;
    height?: string;
    formatter?: (img: ImgType) => ImgType;
    $resolve?: Function;
    $reject?: Function;
};
declare type BorderRadiusType = string | number;
declare type BackgroundType = string;
declare type ShadowType = string;
declare type ConfigType = {
    nodeType?: number;
    flag: 'WEB' | 'MP-WX' | 'UNI-H5' | 'UNI-MP' | 'TARO-H5' | 'TARO-MP';
    el?: string;
    divElement?: HTMLDivElement;
    canvasElement?: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    dpr: number;
    handleCssUnit?: (num: number, unit: string) => number;
    rAF?: Function;
    setTimeout: Function;
    setInterval: Function;
    clearTimeout: Function;
    clearInterval: Function;
    beforeCreate?: Function;
    beforeResize?: Function;
    afterResize?: Function;
    beforeInit?: Function;
    afterInit?: Function;
    beforeDraw?: Function;
    afterDraw?: Function;
    afterStart?: Function;
};
declare type RequireKey = 'width' | 'height';
declare type UserConfigType = Partial<Omit<ConfigType, RequireKey>> & Required<Pick<ConfigType, RequireKey>>;
declare type Tuple<T, Len extends number, Res extends T[] = []> = Res['length'] extends Len ? Res : Tuple<T, Len, [...Res, T]>;

interface WatchOptType {
    handler?: () => Function;
    immediate?: boolean;
    deep?: boolean;
}

declare class Lucky {
    static version: string;
    protected readonly version: string;
    protected readonly config: ConfigType;
    protected readonly ctx: CanvasRenderingContext2D;
    protected htmlFontSize: number;
    protected rAF: Function;
    protected boxWidth: number;
    protected boxHeight: number;
    protected data: {
        width: string | number;
        height: string | number;
    };
    /**
     * 公共构造器
     * @param config
     */
    constructor(config: string | HTMLDivElement | UserConfigType, data: {
        width: string | number;
        height: string | number;
    });
    /**
     * 初始化组件大小/单位
     */
    protected resize(): void;
    /**
     * 初始化方法
     */
    protected initLucky(): void;
    /**
     * 鼠标点击事件
     * @param e 事件参数
     */
    protected handleClick(e: MouseEvent): void;
    /**
     * 根标签的字体大小
     */
    protected setHTMLFontSize(): void;
    clearCanvas(): void;
    /**
     * 设备像素比
     * window 环境下自动获取, 其余环境手动传入
     */
    protected setDpr(): void;
    /**
     * 重置盒子和canvas的宽高
     */
    private resetWidthAndHeight;
    /**
     * 根据 dpr 缩放 canvas 并处理位移
     */
    protected zoomCanvas(): void;
    /**
     * 从 window 对象上获取一些方法
     */
    private initWindowFunction;
    isWeb(): boolean;
    /**
     * 异步加载图片并返回图片的几何信息
     * @param src 图片路径
     * @param info 图片信息
     */
    protected loadImg(src: string, info: ImgItemType, resolveName?: string): Promise<ImgType>;
    /**
     * 公共绘制图片的方法
     * @param imgObj 图片对象
     * @param rectInfo: [x轴位置, y轴位置, 渲染宽度, 渲染高度]
     */
    protected drawImage(ctx: CanvasRenderingContext2D, imgObj: ImgType, ...rectInfo: [...Tuple<number, 4>, ...Partial<Tuple<number, 4>>]): void;
    /**
     * 计算图片的渲染宽高
     * @param imgObj 图片标签元素
     * @param imgInfo 图片信息
     * @param maxWidth 最大宽度
     * @param maxHeight 最大高度
     * @return [渲染宽度, 渲染高度]
     */
    protected computedWidthAndHeight(imgObj: ImgType, imgInfo: ImgItemType, maxWidth: number, maxHeight: number): [number, number];
    /**
     * 转换单位
     * @param { string } value 将要转换的值
     * @param { number } denominator 分子
     * @return { number } 返回新的字符串
     */
    protected changeUnits(value: string, denominator?: number): number;
    /**
     * 获取长度
     * @param length 将要转换的长度
     * @param maxLength 最大长度
     * @return 返回长度
     */
    protected getLength(length: string | number | undefined, maxLength?: number): number;
    /**
     * 获取相对(居中)X坐标
     * @param width
     * @param col
     */
    protected getOffsetX(width: number, maxWidth?: number): number;
    protected getOffscreenCanvas(width: number, height: number): {
        _offscreenCanvas: HTMLCanvasElement;
        _ctx: CanvasRenderingContext2D;
    } | void;
    /**
     * 添加一个新的响应式数据 (临时)
     * @param data 数据
     * @param key 属性
     * @param value 新值
     */
    $set(data: object, key: string | number, value: any): void;
    /**
     * 添加一个属性计算 (临时)
     * @param data 源数据
     * @param key 属性名
     * @param callback 回调函数
     */
    protected $computed(data: object, key: string, callback: Function): void;
    /**
     * 添加一个观察者 create user watcher
     * @param expr 表达式
     * @param handler 回调函数
     * @param watchOpt 配置参数
     * @return 卸载当前观察者的函数 (暂未返回)
     */
    protected $watch(expr: string | Function, handler: Function | WatchOptType, watchOpt?: WatchOptType): Function;
}

declare type PrizeFontType$2 = FontItemType & FontExtendType;
declare type ButtonFontType$1 = FontItemType & {};
declare type BlockImgType$2 = ImgItemType & {
    rotate?: boolean;
};
declare type PrizeImgType$2 = ImgItemType & {};
declare type ButtonImgType$1 = ImgItemType & {};
declare type BlockType$2 = {
    padding?: string;
    background?: BackgroundType;
    imgs?: Array<BlockImgType$2>;
};
declare type PrizeType$2 = {
    range?: number;
    background?: BackgroundType;
    fonts?: Array<PrizeFontType$2>;
    imgs?: Array<PrizeImgType$2>;
};
declare type ButtonType$1 = {
    radius?: string;
    pointer?: boolean;
    background?: BackgroundType;
    fonts?: Array<ButtonFontType$1>;
    imgs?: Array<ButtonImgType$1>;
};
declare type DefaultConfigType$2 = {
    gutter?: string | number;
    offsetDegree?: number;
    speed?: number;
    speedFunction?: string;
    accelerationTime?: number;
    decelerationTime?: number;
    stopRange?: number;
};
declare type DefaultStyleType$2 = {
    background?: BackgroundType;
    fontColor?: PrizeFontType$2['fontColor'];
    fontSize?: PrizeFontType$2['fontSize'];
    fontStyle?: PrizeFontType$2['fontStyle'];
    fontWeight?: PrizeFontType$2['fontWeight'];
    lineHeight?: PrizeFontType$2['lineHeight'];
    wordWrap?: PrizeFontType$2['wordWrap'];
    lengthLimit?: PrizeFontType$2['lengthLimit'];
    lineClamp?: PrizeFontType$2['lineClamp'];
};
declare type StartCallbackType$1 = (e: MouseEvent) => void;
declare type EndCallbackType$2 = (prize: object) => void;
interface LuckyWheelConfig {
    width: string | number;
    height: string | number;
    blocks?: Array<BlockType$2>;
    prizes?: Array<PrizeType$2>;
    buttons?: Array<ButtonType$1>;
    defaultConfig?: DefaultConfigType$2;
    defaultStyle?: DefaultStyleType$2;
    start?: StartCallbackType$1;
    end?: EndCallbackType$2;
}

declare class LuckyWheel extends Lucky {
    private blocks;
    private prizes;
    private buttons;
    private defaultConfig;
    private defaultStyle;
    private _defaultConfig;
    private _defaultStyle;
    private startCallback?;
    private endCallback?;
    private Radius;
    private prizeRadius;
    private prizeDeg;
    private prizeAng;
    private rotateDeg;
    private maxBtnRadius;
    private startTime;
    private endTime;
    private stopDeg;
    private endDeg;
    private FPS;
    /**
     * 游戏当前的阶段
     * step = 0 时, 游戏尚未开始
     * step = 1 时, 此时处于加速阶段
     * step = 2 时, 此时处于匀速阶段
     * step = 3 时, 此时处于减速阶段
     */
    private step;
    /**
     * 中奖索引
     * prizeFlag = undefined 时, 处于开始抽奖阶段, 正常旋转
     * prizeFlag >= 0 时, 说明stop方法被调用, 并且传入了中奖索引
     * prizeFlag === -1 时, 说明stop方法被调用, 并且传入了负值, 本次抽奖无效
     */
    private prizeFlag;
    private ImageCache;
    /**
     * 大转盘构造器
     * @param config 配置项
     * @param data 抽奖数据
     */
    constructor(config: UserConfigType, data: LuckyWheelConfig);
    protected resize(): void;
    protected initLucky(): void;
    /**
     * 初始化数据
     * @param data
     */
    private initData;
    /**
     * 初始化属性计算
     */
    private initComputed;
    /**
     * 初始化观察者
     */
    private initWatch;
    /**
     * 初始化 canvas 抽奖
     */
    init(): Promise<void>;
    private initImageCache;
    /**
     * canvas点击事件
     * @param e 事件参数
     */
    protected handleClick(e: MouseEvent): void;
    /**
     * 根据索引单独加载指定图片并缓存
     * @param cellName 模块名称
     * @param cellIndex 模块索引
     * @param imgName 模块对应的图片缓存
     * @param imgIndex 图片索引
     */
    private loadAndCacheImg;
    private drawBlock;
    /**
     * 开始绘制
     */
    protected draw(): void;
    /**
     * 刻舟求剑
     */
    private carveOnGunwaleOfAMovingBoat;
    /**
     * 对外暴露: 开始抽奖方法
     */
    play(): void;
    /**
     * 对外暴露: 缓慢停止方法
     * @param index 中奖索引
     */
    stop(index?: number): void;
    /**
     * 实际开始执行方法
     * @param num 记录帧动画执行多少次
     */
    private run;
    /**
     * 换算渲染坐标
     * @param x
     * @param y
     */
    protected conversionAxis(x: number, y: number): [number, number];
}

declare type PrizeFontType$1 = FontItemType & FontExtendType;
declare type ButtonFontType = FontItemType & FontExtendType;
declare type BlockImgType$1 = ImgItemType & {};
declare type PrizeImgType$1 = ImgItemType & {
    activeSrc?: string;
};
declare type ButtonImgType = ImgItemType & {};
declare type BlockType$1 = {
    borderRadius?: BorderRadiusType;
    background?: BackgroundType;
    padding?: string;
    paddingTop?: string | number;
    paddingRight?: string | number;
    paddingBottom?: string | number;
    paddingLeft?: string | number;
    imgs?: Array<BlockImgType$1>;
};
declare type CellType<T, U> = {
    x: number;
    y: number;
    col?: number;
    row?: number;
    borderRadius?: BorderRadiusType;
    background?: BackgroundType;
    shadow?: ShadowType;
    fonts?: Array<T>;
    imgs?: Array<U>;
};
declare type PrizeType$1 = CellType<PrizeFontType$1, PrizeImgType$1> & {
    range?: number;
    disabled?: boolean;
};
declare type ButtonType = CellType<ButtonFontType, ButtonImgType> & {
    callback?: Function;
};
declare type DefaultConfigType$1 = {
    gutter?: number;
    speed?: number;
    accelerationTime?: number;
    decelerationTime?: number;
};
declare type DefaultStyleType$1 = {
    borderRadius?: BorderRadiusType;
    background?: BackgroundType;
    shadow?: ShadowType;
    fontColor?: PrizeFontType$1['fontColor'];
    fontSize?: PrizeFontType$1['fontSize'];
    fontStyle?: PrizeFontType$1['fontStyle'];
    fontWeight?: PrizeFontType$1['fontWeight'];
    lineHeight?: PrizeFontType$1['lineHeight'];
    wordWrap?: PrizeFontType$1['wordWrap'];
    lengthLimit?: PrizeFontType$1['lengthLimit'];
    lineClamp?: PrizeFontType$1['lineClamp'];
};
declare type ActiveStyleType = {
    background?: BackgroundType;
    shadow?: ShadowType;
    fontColor?: PrizeFontType$1['fontColor'];
    fontSize?: PrizeFontType$1['fontSize'];
    fontStyle?: PrizeFontType$1['fontStyle'];
    fontWeight?: PrizeFontType$1['fontWeight'];
    lineHeight?: PrizeFontType$1['lineHeight'];
};
declare type RowsType = number;
declare type ColsType = number;
declare type StartCallbackType = (e: MouseEvent, button?: ButtonType) => void;
declare type EndCallbackType$1 = (prize: object) => void;
interface LuckyGridConfig {
    width: string | number;
    height: string | number;
    rows?: RowsType;
    cols?: ColsType;
    blocks?: Array<BlockType$1>;
    prizes?: Array<PrizeType$1>;
    buttons?: Array<ButtonType>;
    button?: ButtonType;
    defaultConfig?: DefaultConfigType$1;
    defaultStyle?: DefaultStyleType$1;
    activeStyle?: ActiveStyleType;
    start?: StartCallbackType;
    end?: EndCallbackType$1;
}

declare class LuckyGrid extends Lucky {
    private rows;
    private cols;
    private blocks;
    private prizes;
    private buttons;
    private button?;
    private defaultConfig;
    private defaultStyle;
    private activeStyle;
    private _defaultConfig;
    private _defaultStyle;
    private _activeStyle;
    private startCallback?;
    private endCallback?;
    private cellWidth;
    private cellHeight;
    private startTime;
    private endTime;
    private currIndex;
    private stopIndex;
    private endIndex;
    private demo;
    private timer;
    private FPS;
    /**
     * 游戏当前的阶段
     * step = 0 时, 游戏尚未开始
     * step = 1 时, 此时处于加速阶段
     * step = 2 时, 此时处于匀速阶段
     * step = 3 时, 此时处于减速阶段
     */
    private step;
    /**
     * 中奖索引
     * prizeFlag = undefined 时, 处于开始抽奖阶段, 正常旋转
     * prizeFlag >= 0 时, 说明stop方法被调用, 并且传入了中奖索引
     * prizeFlag === -1 时, 说明stop方法被调用, 并且传入了负值, 本次抽奖无效
     */
    private prizeFlag;
    private cells;
    private prizeArea;
    private ImageCache;
    /**
     * 九宫格构造器
     * @param config 配置项
     * @param data 抽奖数据
     */
    constructor(config: UserConfigType, data: LuckyGridConfig);
    protected resize(): void;
    protected initLucky(): void;
    /**
     * 初始化数据
     * @param data
     */
    private initData;
    /**
     * 初始化属性计算
     */
    private initComputed;
    /**
     * 初始化观察者
     */
    private initWatch;
    /**
     * 初始化 canvas 抽奖
     */
    init(): Promise<void>;
    private initImageCache;
    /**
     * canvas点击事件
     * @param e 事件参数
     */
    protected handleClick(e: MouseEvent): void;
    /**
     * 根据索引单独加载指定图片并缓存
     * @param cellName 模块名称
     * @param cellIndex 模块索引
     * @param imgName 模块对应的图片缓存
     * @param imgIndex 图片索引
     */
    private loadAndCacheImg;
    /**
     * 绘制九宫格抽奖
     */
    protected draw(): void;
    /**
     * 处理背景色
     * @param x
     * @param y
     * @param width
     * @param height
     * @param background
     * @param isActive
     */
    private handleBackground;
    /**
     * 刻舟求剑
     */
    private carveOnGunwaleOfAMovingBoat;
    /**
     * 对外暴露: 开始抽奖方法
     */
    play(): void;
    /**
     * 对外暴露: 缓慢停止方法
     * @param index 中奖索引
     */
    stop(index?: number): void;
    /**
     * 实际开始执行方法
     * @param num 记录帧动画执行多少次
     */
    private run;
    /**
     * 计算奖品格子的几何属性
     * @param { array } [...矩阵坐标, col, row]
     * @return { array } [...真实坐标, width, height]
     */
    private getGeometricProperty;
    /**
     * 换算渲染坐标
     * @param x
     * @param y
     */
    protected conversionAxis(x: number, y: number): [number, number];
}

declare type PrizeFontType = FontItemType & FontExtendType;
declare type BlockImgType = ImgItemType & {};
declare type PrizeImgType = ImgItemType;
declare type BlockType = {
    borderRadius?: BorderRadiusType;
    background?: BackgroundType;
    padding?: string;
    paddingTop?: string | number;
    paddingRight?: string | number;
    paddingBottom?: string | number;
    paddingLeft?: string | number;
    imgs?: Array<BlockImgType>;
};
declare type PrizeType = {
    borderRadius?: BorderRadiusType;
    background?: BackgroundType;
    fonts?: Array<PrizeFontType>;
    imgs?: Array<PrizeImgType>;
};
declare type SlotType = {
    order?: number[];
    speed?: number;
    direction?: 1 | -1;
};
declare type DefaultConfigType = {
    /**
     * vertical 为纵向旋转
     * horizontal 为横向旋转
     */
    mode?: 'vertical' | 'horizontal';
    /**
     * 当排列方向 = `vertical`时
     *    1 bottom to top
     *   -1 top to bottom
     * 当排列方向 = `horizontal`时
     *    1 right to left
     *   -1 left to right
     */
    direction?: 1 | -1;
    rowSpacing?: number;
    colSpacing?: number;
    speed?: number;
    accelerationTime?: number;
    decelerationTime?: number;
};
declare type DefaultStyleType = {
    borderRadius?: BorderRadiusType;
    background?: BackgroundType;
    fontColor?: PrizeFontType['fontColor'];
    fontSize?: PrizeFontType['fontSize'];
    fontStyle?: PrizeFontType['fontStyle'];
    fontWeight?: PrizeFontType['fontWeight'];
    lineHeight?: PrizeFontType['lineHeight'];
    wordWrap?: PrizeFontType['wordWrap'];
    lengthLimit?: PrizeFontType['lengthLimit'];
    lineClamp?: PrizeFontType['lineClamp'];
};
declare type EndCallbackType = (prize: PrizeType | undefined) => void;
interface SlotMachineConfig {
    width: string | number;
    height: string | number;
    blocks?: Array<BlockType>;
    prizes?: Array<PrizeType>;
    slots?: Array<SlotType>;
    defaultConfig?: DefaultConfigType;
    defaultStyle?: DefaultStyleType;
    end?: EndCallbackType;
}

declare class SlotMachine extends Lucky {
    private blocks;
    private prizes;
    private slots;
    private defaultConfig;
    private _defaultConfig;
    private defaultStyle;
    private _defaultStyle;
    private endCallback;
    private _offscreenCanvas?;
    private cellWidth;
    private cellHeight;
    private cellAndSpacing;
    private widthAndSpacing;
    private heightAndSpacing;
    private FPS;
    private scroll;
    private stopScroll;
    private endScroll;
    private startTime;
    private endTime;
    /**
     * 游戏当前的阶段
     * step = 0 时, 游戏尚未开始
     * step = 1 时, 此时处于加速阶段
     * step = 2 时, 此时处于匀速阶段
     * step = 3 时, 此时处于减速阶段
     */
    private step;
    /**
     * 中奖索引
     * prizeFlag = undefined 时, 处于开始抽奖阶段, 正常旋转
     * prizeFlag >= 0 时, 说明stop方法被调用, 并且传入了中奖索引
     * prizeFlag === -1 时, 说明stop方法被调用, 并且传入了负值, 本次抽奖无效
     */
    private prizeFlag;
    private prizeArea?;
    private ImageCache;
    /**
     * 老虎机构造器
     * @param config 配置项
     * @param data 抽奖数据
     */
    constructor(config: UserConfigType, data: SlotMachineConfig);
    protected resize(): void;
    protected initLucky(): void;
    /**
     * 初始化数据
     * @param data
     */
    private initData;
    /**
     * 初始化属性计算
     */
    private initComputed;
    /**
     * 初始化观察者
     */
    private initWatch;
    /**
     * 初始化 canvas 抽奖
     */
    init(): Promise<void>;
    private initImageCache;
    /**
     * 根据索引单独加载指定图片并缓存
     * @param cellName 模块名称
     * @param cellIndex 模块索引
     * @param imgName 模块对应的图片缓存
     * @param imgIndex 图片索引
     */
    private loadAndCacheImg;
    /**
     * 绘制离屏canvas
     */
    protected drawOffscreenCanvas(): void;
    /**
     * 绘制背景区域
     */
    protected drawBlocks(): SlotMachine['prizeArea'];
    /**
     * 绘制老虎机抽奖
     */
    protected draw(): void;
    /**
     * 刻舟求剑
     */
    private carveOnGunwaleOfAMovingBoat;
    /**
     * 对外暴露: 开始抽奖方法
     */
    play(): void;
    stop(index: number | number[]): void;
    /**
     * 让游戏动起来
     * @param num 记录帧动画执行多少次
     */
    private run;
    private displacement;
    private displacementWidthOrHeight;
}

/**
 * 切割圆角
 * @param img 将要裁剪的图片对象
 * @param radius 裁剪的圆角半径
 * @returns 返回一个离屏 canvas 用于渲染
 */
declare const cutRound: (img: ImgType, radius: number) => ImgType;
/**
 * 透明度
 * @param img 将要处理的图片对象
 * @param opacity 透明度
 * @returns 返回一个离屏 canvas 用于渲染
 */
declare const opacity: (img: ImgType, opacity: number) => ImgType;

export { LuckyGrid, LuckyWheel, SlotMachine, cutRound, opacity };
