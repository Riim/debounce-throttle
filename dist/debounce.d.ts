export declare type TDebounced<T extends Function> = T & {
    flush(): void;
    clear(): void;
};
export declare const debounce: {
    <T extends Function>(delay: number, immediate: boolean, cb: T): TDebounced<T>;
    <T extends Function>(delay: number, cb: T): TDebounced<T>;
    decorator(delay: number, immediate?: boolean): (target: Object, propName: string, propDesc?: PropertyDescriptor) => PropertyDescriptor;
};
