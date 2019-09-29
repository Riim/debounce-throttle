export interface IDebounced {
    (): any;
    clear(): void;
    flush(): void;
}
export declare const debounce: {
    (delay: number, immediate: boolean | undefined, callback: Function): IDebounced;
    (delay: number, callback: Function): IDebounced;
    decorator(delay: number, noTrailing?: boolean): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => PropertyDescriptor;
};
