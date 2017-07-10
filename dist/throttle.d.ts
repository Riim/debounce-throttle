export interface IThrottled {
    (): any;
    clear(): void;
    flush(): void;
}
export declare function throttle(delay: number, callback: Function): IThrottled;
export declare function throttle(delay: number, noTrailing: boolean, callback: Function): IThrottled;
