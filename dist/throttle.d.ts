export declare type TThrottled<T extends Function = Function> = T & {
    flush(): void;
    clear(): void;
};
export declare const throttle: {
    <T extends Function>(delay: number, noTrailing: boolean, cb: Function): TThrottled<T>;
    <T extends Function>(delay: number, cb: Function): TThrottled<T>;
    decorator(delay: number, noTrailing?: boolean): (target: Object, propName: string, propDesc?: PropertyDescriptor) => PropertyDescriptor;
};
