"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = void 0;
exports.throttle = function throttle(delay, noTrailing, cb) {
    if (typeof noTrailing == 'function') {
        cb = noTrailing;
        noTrailing = false;
    }
    let lastExec = 0;
    let timeoutID;
    let context;
    let args;
    let result;
    function later() {
        lastExec = Date.now();
        timeoutID = null;
        result = cb.apply(context, args);
        context = args = null;
    }
    let throttled = function throttled() {
        let now = Date.now();
        if (now - lastExec >= delay) {
            lastExec = now;
            if (timeoutID) {
                clearTimeout(timeoutID);
                timeoutID = null;
                result = cb.apply(context, args);
                context = args = null;
            }
            else {
                result = cb.apply(this, arguments);
            }
        }
        else {
            if (!noTrailing) {
                context = this;
                args = arguments;
                if (!timeoutID) {
                    timeoutID = setTimeout(later, delay - (now - lastExec));
                }
            }
        }
        return result;
    };
    throttled.flush = () => {
        if (timeoutID) {
            clearTimeout(timeoutID);
            lastExec = Date.now();
            timeoutID = null;
            result = cb.apply(context, args);
            context = args = null;
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
                let throttled = exports.throttle(delay, noTrailing || false, propDesc.value);
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
