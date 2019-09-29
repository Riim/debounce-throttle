"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = function debounce(delay, immediate, callback) {
    if (typeof immediate == 'function') {
        callback = immediate;
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
            result = callback.apply(context, args);
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
                result = callback.apply(this, arguments);
                return result;
            }
            result = callback.apply(context, args);
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
            result = callback.apply(context, args);
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
    return (target, propertyName, propertyDesc) => {
        if (!propertyDesc) {
            propertyDesc = Object.getOwnPropertyDescriptor(target, propertyName);
        }
        let method = propertyDesc.value;
        propertyDesc.value = exports.debounce(delay, immediate, method);
        return propertyDesc;
    };
};
