"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function debounce(delay, immediate, callback) {
    if (typeof immediate == 'function') {
        callback = immediate;
        immediate = false;
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
    debounced.flush = function () {
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
    debounced.clear = function () {
        if (timeoutID) {
            clearTimeout(timeoutID);
            timeoutID = null;
            context = args = null;
        }
    };
    return debounced;
}
exports.debounce = debounce;
