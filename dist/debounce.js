"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = function debounce(delay, immediate, cb) {
    if (typeof immediate == 'function') {
        cb = immediate;
        immediate = false;
    }
    let context;
    let args;
    let timestamp;
    let timeoutID;
    let lastExec = 0;
    let result;
    function later() {
        let now = Date.now();
        if (now - timestamp < delay) {
            timeoutID = setTimeout(later, delay - (now - timestamp));
        }
        else {
            timeoutID = null;
            lastExec = now;
            result = cb.apply(context, args);
            if (!timeoutID) {
                context = args = null;
            }
        }
    }
    let debounced = function debounced() {
        timestamp = Date.now();
        if (immediate && timestamp - lastExec >= delay) {
            lastExec = timestamp;
            if (!timeoutID) {
                result = cb.apply(this, arguments);
                return result;
            }
            result = cb.apply(context, args);
        }
        context = this;
        args = arguments;
        if (!timeoutID) {
            timeoutID = setTimeout(later, delay);
        }
        return result;
    };
    debounced.flush = () => {
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
    debounced.clear = () => {
        if (timeoutID) {
            clearTimeout(timeoutID);
            timeoutID = null;
            context = args = null;
        }
    };
    return debounced;
};
exports.debounce.decorator = (delay, immediate) => {
    return (target, propName, propDesc) => {
        if (!propDesc) {
            propDesc = Object.getOwnPropertyDescriptor(target, propName);
        }
        return {
            configurable: true,
            enumerable: propDesc.enumerable,
            get: function () {
                let debounced = exports.debounce(delay, immediate, propDesc.value);
                Object.defineProperty(this, propName, {
                    configurable: true,
                    enumerable: propDesc.enumerable,
                    writable: propDesc.writable,
                    value: debounced
                });
                return debounced;
            }
        };
    };
};
