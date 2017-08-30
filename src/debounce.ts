export interface IDebounced {
	(): any;
	clear(): void;
	flush(): void;
}

export function debounce(delay: number, immediate: boolean, callback: Function): IDebounced;
export function debounce(delay: number, callback: Function): IDebounced;
export function debounce(delay: number, immediate: boolean | Function, callback?: Function): IDebounced {
	if (typeof immediate == 'function') {
		callback = immediate;
		immediate = false;
	}

	let context: any;
	let args: IArguments | null;
	let timestamp: number;
	let timeoutID: number | null | undefined;
	let lastExec = 0;
	let result: any;

	function later() {
		let now = Date.now();

		if (now - timestamp < delay) {
			timeoutID = setTimeout(later, delay - (now - timestamp));
		} else {
			timeoutID = null;

			lastExec = now;

			result = (callback as Function).apply(context, args);
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
				result = (callback as Function).apply(this, arguments);
				return result;
			}

			result = (callback as Function).apply(context, args);
		}

		context = this;
		args = arguments;

		if (!timeoutID) {
			timeoutID = setTimeout(later, delay);
		}

		return result;
	} as IDebounced;

	debounced.flush = () => {
		if (timeoutID) {
			clearTimeout(timeoutID);
			timeoutID = null;

			lastExec = Date.now();

			result = (callback as Function).apply(context, args);
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
}
