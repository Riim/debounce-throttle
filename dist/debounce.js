"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = void 0;
exports.debounce = function debounce(delay, immediate, cb) {
    if (typeof immediate == 'function') {
        cb = immediate;
        immediate = false;
    }
    let timestamp;
    let lastExec = 0;
    let timeoutID;
    let context;
    let args;
    let result;
    function later() {
        let now = Date.now();
        if (now - timestamp < delay) {
            timeoutID = setTimeout(later, delay - (now - timestamp));
        }
        else {
            lastExec = now;
            timeoutID = null;
            result = cb.apply(context, args);
            context = args = null;
        }
    }
    let debounced = function debounced() {
        timestamp = Date.now();
        if (immediate && timestamp - lastExec >= delay) {
            lastExec = timestamp;
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
            context = this;
            args = arguments;
            if (!timeoutID) {
                timeoutID = setTimeout(later, delay);
            }
        }
        return result;
    };
    debounced.flush = () => {
        if (timeoutID) {
            clearTimeout(timeoutID);
            lastExec = Date.now();
            timeoutID = null;
            result = cb.apply(context, args);
            context = args = null;
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
                let debounced = exports.debounce(delay, immediate || false, propDesc.value);
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
