export interface IThrottled {
    (): any;
    clear(): void;
    flush(): void;
}
export declare const throttle: {
    (delay: number, noTrailing: boolean | undefined, callback: Function): IThrottled;
    (delay: number, callback: Function): IThrottled;
    decorator(delay: number, noTrailing?: boolean): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => PropertyDescriptor;
};
