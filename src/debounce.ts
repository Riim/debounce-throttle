export type TDebounced<T extends Function> = T & {
	flush(): void;
	clear(): void;
};

export const debounce: {
	<T extends Function>(delay: number, immediate: boolean, cb: T): TDebounced<T>;
	<T extends Function>(delay: number, cb: T): TDebounced<T>;

	decorator(
		delay: number,
		immediate?: boolean
	): (target: Object, propName: string, propDesc?: PropertyDescriptor) => PropertyDescriptor;
} = function debounce(delay: number, immediate: boolean | Function, cb?: Function): TDebounced<Function> {
	if (typeof immediate == 'function') {
		cb = immediate;
		immediate = false;
	}

	let timestamp: number;
	let lastExec = 0;
	let timeoutID: number | null | undefined;
	let context: any;
	let args: IArguments | null;
	let result: any;

	function later() {
		let now = Date.now();

		if (now - timestamp < delay) {
			timeoutID = setTimeout(later, delay - (now - timestamp));
		} else {
			lastExec = now;
			timeoutID = null;
			result = cb!.apply(context, args);
			context = args = null;
		}
	}

	let debounced: TDebounced<Function> = function debounced() {
		timestamp = Date.now();

		if (immediate && timestamp - lastExec >= delay) {
			lastExec = timestamp;

			if (timeoutID) {
				clearTimeout(timeoutID);

				timeoutID = null;
				result = cb!.apply(context, args);
				context = args = null;
			} else {
				result = cb!.apply(this, arguments);
			}
		} else {
			context = this;
			args = arguments;

			if (!timeoutID) {
				timeoutID = setTimeout(later, delay);
			}
		}

		return result;
	} as any;

	debounced.flush = () => {
		if (timeoutID) {
			clearTimeout(timeoutID);

			lastExec = Date.now();
			timeoutID = null;
			result = cb!.apply(context, args);
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
} as any;

debounce.decorator = (delay, immediate) => {
	return (target, propName, propDesc) => {
		if (!propDesc) {
			propDesc = Object.getOwnPropertyDescriptor(target, propName)!;
		}

		return {
			configurable: true,
			enumerable: propDesc.enumerable,

			get: function () {
				let debounced = debounce(delay, immediate || false, propDesc!.value);

				Object.defineProperty(this, propName, {
					configurable: true,
					enumerable: propDesc!.enumerable,
					writable: propDesc!.writable,
					value: debounced
				});

				return debounced;
			}
		};
	};
};
