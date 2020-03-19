"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = function throttle(delay, noTrailing, cb) {
    if (typeof noTrailing == 'function') {
        cb = noTrailing;
        noTrailing = false;
    }
    let context;
    let args;
    let timestamp;
    let timeoutID;
    let lastExec = 0;
    let result;
    function later() {
        timeoutID = null;
        lastExec = Date.now();
        result = cb.apply(context, args);
        if (!timeoutID) {
            context = args = null;
        }
    }
    let throttled = function throttled() {
        timestamp = Date.now();
        if (timestamp - lastExec >= delay) {
            lastExec = timestamp;
            if (!timeoutID) {
                result = cb.apply(this, arguments);
                return result;
            }
            result = cb.apply(context, args);
        }
        if (noTrailing) {
            return result;
        }
        context = this;
        args = arguments;
        if (!timeoutID) {
            timeoutID = setTimeout(later, delay - (timestamp - lastExec));
        }
        return result;
    };
    throttled.flush = () => {
        if (timeoutID) {
            clearTimeout(timeoutID);
            timeoutID = null;
            lastExec = Date.now();
            result = cb.apply(context, args);
            if (!timeoutID) {
                context = args = null;
            }
        }
    };
    throttled.clear = () => {
        if (timeoutID) {
            clearTimeout(timeoutID);
            timeoutID = null;
            context = args = null;
        }
    };
    return throttled;
};
exports.throttle.decorator = (delay, noTrailing) => {
    return (target, propName, propDesc) => {
        if (!propDesc) {
            propDesc = Object.getOwnPropertyDescriptor(target, propName);
        }
        return {
            configurable: true,
            enumerable: propDesc.enumerable,
            get: function () {
                let throttled = exports.throttle(delay, noTrailing, propDesc.value);
                Object.defineProperty(this, propName, {
                    configurable: true,
                    enumerable: propDesc.enumerable,
                    writable: propDesc.writable,
                    value: throttled
                });
                return throttled;
            }
        };
    };
};
