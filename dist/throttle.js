"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function throttle(delay, noTrailingOrCallback, callback) {
    var noTrailing;
    if (callback === undefined) {
        noTrailing = false;
        callback = noTrailingOrCallback;
    }
    else {
        noTrailing = noTrailingOrCallback;
    }
    var context;
    var args;
    var timestamp;
    var timeoutID;
    var lastExec = 0;
    var result;
    function later() {
        timeoutID = null;
        lastExec = Date.now();
        result = callback.apply(context, args);
        if (!timeoutID) {
            context = args = null;
        }
    }
    var throttled = function throttled() {
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
    throttled.flush = function flush() {
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
    throttled.clear = function clear() {
        if (timeoutID) {
            clearTimeout(timeoutID);
            timeoutID = null;
            context = args = null;
        }
    };
    return throttled;
}
exports.throttle = throttle;
