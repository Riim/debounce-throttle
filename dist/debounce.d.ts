export interface IDebounced {
    (): any;
    flush(): void;
    clear(): void;
}
export declare const debounce: {
    (delay: number, immediate: boolean, cb: Function): IDebounced;
    (delay: number, cb: Function): IDebounced;
    decorator(delay: number, immediate?: boolean): (target: Object, propName: string, propDesc?: PropertyDescriptor) => PropertyDescriptor;
};
