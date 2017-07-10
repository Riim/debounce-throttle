export interface IDebounced {
    (): any;
    clear(): void;
    flush(): void;
}
export declare function debounce(delay: number, callback: Function): IDebounced;
export declare function debounce(delay: number, immediate: boolean, callback: Function): IDebounced;
