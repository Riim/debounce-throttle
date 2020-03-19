export interface IThrottled {
    (): any;
    clear(): void;
    flush(): void;
}
export declare const throttle: {
    (delay: number, noTrailing: boolean | undefined, cb: Function): IThrottled;
    (delay: number, cb: Function): IThrottled;
    decorator(delay: number, noTrailing?: boolean): (target: Object, propName: string, propDesc?: PropertyDescriptor) => PropertyDescriptor;
};
