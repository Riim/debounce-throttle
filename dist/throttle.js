"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = function throttle(delay, noTrailing, callback) {
    if (typeof noTrailing == 'function') {
        callback = noTrailing;
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
        result = callback.apply(context, args);
        if (!timeoutID) {
            context = args = null;
        }
    }
    let throttled = function throttled() {
        timestamp = Date.now();
        if (timestamp - lastExec >= delay) {
            lastExec = timestamp;
            if (!timeoutID) {
                result = callback.apply(this, arguments);
                return result;
            }
            result = callback.apply(context, args);
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
            result = callback.apply(context, args);
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
    return (target, propertyName, propertyDesc) => {
        if (!propertyDesc) {
            propertyDesc = Object.getOwnPropertyDescriptor(target, propertyName);
        }
        let method = propertyDesc.value;
        propertyDesc.value = exports.throttle(delay, noTrailing, method);
        return propertyDesc;
    };
};
