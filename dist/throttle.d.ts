export interface IThrottled {
    (): any;
    flush(): void;
    clear(): void;
}
export declare const throttle: {
    (delay: number, noTrailing: boolean, cb: Function): IThrottled;
    (delay: number, cb: Function): IThrottled;
    decorator(delay: number, noTrailing?: boolean): (target: Object, propName: string, propDesc?: PropertyDescriptor) => PropertyDescriptor;
};
