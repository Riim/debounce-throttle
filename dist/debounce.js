"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function debounce(delay, immediateOrCallback, callback) {
    var immediate;
    if (callback === undefined) {
        immediate = false;
        callback = immediateOrCallback;
    }
    else {
        immediate = immediateOrCallback;
    }
    var context;
    var args;
    var timestamp;
    var timeoutID;
    var lastExec = 0;
    var result;
    function later() {
        var now = Date.now();
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
    var debounced = function debounced() {
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
    debounced.flush = function flush() {
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
    debounced.clear = function clear() {
        if (timeoutID) {
            clearTimeout(timeoutID);
            timeoutID = null;
            context = args = null;
        }
    };
    return debounced;
}
exports.debounce = debounce;
