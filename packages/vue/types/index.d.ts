import * as vue_demi from 'vue-demi';
import { LuckyWheel, LuckyGrid, SlotMachine } from 'lucky-canvas';

declare const _default$3: vue_demi.DefineComponent<{
    width: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
        require: boolean;
    };
    height: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
        require: boolean;
    };
    blocks: {
        type: ArrayConstructor;
        default: () => never[];
    };
    prizes: {
        type: ArrayConstructor;
        default: () => never[];
    };
    buttons: {
        type: ArrayConstructor;
        default: () => never[];
    };
    defaultStyle: {
        type: ObjectConstructor;
        default: () => {};
    };
    defaultConfig: {
        type: ObjectConstructor;
        default: () => {};
    };
}, unknown, {
    $lucky: LuckyWheel | null;
}, {}, {
    initLucky(): void;
    init(): void;
    play(): void;
    stop(index?: number | undefined): void;
}, vue_demi.ComponentOptionsMixin, vue_demi.ComponentOptionsMixin, ("start" | "end" | "success" | "error" | "finally")[], "start" | "end" | "success" | "error" | "finally", vue_demi.VNodeProps & vue_demi.AllowedComponentProps & vue_demi.ComponentCustomProps, Readonly<{
    width?: unknown;
    height?: unknown;
    blocks?: unknown;
    prizes?: unknown;
    buttons?: unknown;
    defaultStyle?: unknown;
    defaultConfig?: unknown;
} & {
    blocks: unknown[];
    prizes: unknown[];
    buttons: unknown[];
    width: string | number;
    height: string | number;
    defaultStyle: Record<string, any>;
    defaultConfig: Record<string, any>;
} & {}> & {
    onStart?: ((...args: any[]) => any) | undefined;
    onEnd?: ((...args: any[]) => any) | undefined;
    onSuccess?: ((...args: any[]) => any) | undefined;
    onError?: ((...args: any[]) => any) | undefined;
    onFinally?: ((...args: any[]) => any) | undefined;
}, {
    blocks: unknown[];
    prizes: unknown[];
    buttons: unknown[];
    width: string | number;
    height: string | number;
    defaultStyle: Record<string, any>;
    defaultConfig: Record<string, any>;
}>;

declare const _default$2: vue_demi.DefineComponent<{
    width: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
        require: boolean;
    };
    height: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
        require: boolean;
    };
    cols: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
    rows: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
    blocks: {
        type: ArrayConstructor;
        default: () => never[];
    };
    prizes: {
        type: ArrayConstructor;
        default: () => never[];
    };
    buttons: {
        type: ArrayConstructor;
        default: () => never[];
    };
    button: {
        type: ObjectConstructor;
    };
    defaultStyle: {
        type: ObjectConstructor;
        default: () => {};
    };
    activeStyle: {
        type: ObjectConstructor;
        default: () => {};
    };
    defaultConfig: {
        type: ObjectConstructor;
        default: () => {};
    };
}, unknown, {
    $lucky: LuckyGrid | null;
}, {}, {
    initLucky(): void;
    init(): void;
    play(): void;
    stop(index?: number | undefined): void;
}, vue_demi.ComponentOptionsMixin, vue_demi.ComponentOptionsMixin, ("start" | "end" | "success" | "error" | "finally")[], "start" | "end" | "success" | "error" | "finally", vue_demi.VNodeProps & vue_demi.AllowedComponentProps & vue_demi.ComponentCustomProps, Readonly<{
    width?: unknown;
    height?: unknown;
    cols?: unknown;
    rows?: unknown;
    blocks?: unknown;
    prizes?: unknown;
    buttons?: unknown;
    button?: unknown;
    defaultStyle?: unknown;
    activeStyle?: unknown;
    defaultConfig?: unknown;
} & {
    cols: string | number;
    rows: string | number;
    blocks: unknown[];
    prizes: unknown[];
    buttons: unknown[];
    width: string | number;
    height: string | number;
    defaultStyle: Record<string, any>;
    activeStyle: Record<string, any>;
    defaultConfig: Record<string, any>;
} & {
    button?: Record<string, any> | undefined;
}> & {
    onStart?: ((...args: any[]) => any) | undefined;
    onEnd?: ((...args: any[]) => any) | undefined;
    onSuccess?: ((...args: any[]) => any) | undefined;
    onError?: ((...args: any[]) => any) | undefined;
    onFinally?: ((...args: any[]) => any) | undefined;
}, {
    cols: string | number;
    rows: string | number;
    blocks: unknown[];
    prizes: unknown[];
    buttons: unknown[];
    width: string | number;
    height: string | number;
    defaultStyle: Record<string, any>;
    activeStyle: Record<string, any>;
    defaultConfig: Record<string, any>;
}>;

declare const _default$1: vue_demi.DefineComponent<{
    width: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
        require: boolean;
    };
    height: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
        require: boolean;
    };
    blocks: {
        type: ArrayConstructor;
        default: () => never[];
    };
    prizes: {
        type: ArrayConstructor;
        default: () => never[];
    };
    slots: {
        type: ArrayConstructor;
        default: () => never[];
    };
    defaultStyle: {
        type: ObjectConstructor;
        default: () => {};
    };
    defaultConfig: {
        type: ObjectConstructor;
        default: () => {};
    };
}, unknown, {
    $lucky: SlotMachine | null;
}, {}, {
    initLucky(): void;
    init(): void;
    play(): void;
    stop(index: number): void;
}, vue_demi.ComponentOptionsMixin, vue_demi.ComponentOptionsMixin, Record<string, any>, string, vue_demi.VNodeProps & vue_demi.AllowedComponentProps & vue_demi.ComponentCustomProps, Readonly<{
    width?: unknown;
    height?: unknown;
    blocks?: unknown;
    prizes?: unknown;
    slots?: unknown;
    defaultStyle?: unknown;
    defaultConfig?: unknown;
} & {
    blocks: unknown[];
    slots: unknown[];
    prizes: unknown[];
    width: string | number;
    height: string | number;
    defaultStyle: Record<string, any>;
    defaultConfig: Record<string, any>;
} & {}>, {
    blocks: unknown[];
    slots: unknown[];
    prizes: unknown[];
    width: string | number;
    height: string | number;
    defaultStyle: Record<string, any>;
    defaultConfig: Record<string, any>;
}>;

declare const install: (app: {
    component: Function;
}) => void;

declare const _default: {
    install: (app: {
        component: Function;
    }) => void;
};

export { _default$2 as LuckyGrid, _default$3 as LuckyWheel, _default$1 as SlotMachine, _default as default, install };
