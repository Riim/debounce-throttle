export declare type TThrottled<T extends Function> = T & {
    flush(): void;
    clear(): void;
};
export declare const throttle: {
    <T extends Function>(delay: number, noTrailing: boolean, cb: T): TThrottled<T>;
    <T extends Function>(delay: number, cb: T): TThrottled<T>;
    decorator(delay: number, noTrailing?: boolean): (target: Object, propName: string, propDesc?: PropertyDescriptor) => PropertyDescriptor;
};
