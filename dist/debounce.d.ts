export interface IDebounced {
    (): any;
    clear(): void;
    flush(): void;
}
export declare const debounce: {
    (delay: number, immediate: boolean | undefined, cb: Function): IDebounced;
    (delay: number, cb: Function): IDebounced;
    decorator(delay: number, noTrailing?: boolean): (target: Object, propName: string, propDesc?: PropertyDescriptor) => PropertyDescriptor;
};
