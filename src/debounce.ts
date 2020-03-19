export interface IDebounced {
	(): any;
	clear(): void;
	flush(): void;
}

export const debounce: {
	(delay: number, immediate: boolean | undefined, cb: Function): IDebounced;
	(delay: number, cb: Function): IDebounced;

	decorator(
		delay: number,
		noTrailing?: boolean
	): (target: Object, propName: string, propDesc?: PropertyDescriptor) => PropertyDescriptor;
} = function debounce(
	delay: number,
	immediate: boolean | Function | undefined,
	cb?: Function
): IDebounced {
	if (typeof immediate == 'function') {
		cb = immediate;
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
			result = cb!.apply(context, args);

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
				result = cb!.apply(this, arguments);
				return result;
			}

			result = cb!.apply(context, args);
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
			result = cb!.apply(context, args);

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
} as any;

debounce.decorator = (delay, immediate) => {
	return (target, propName, propDesc) => {
		if (!propDesc) {
			propDesc = Object.getOwnPropertyDescriptor(target, propName)!;
		}

		return {
			configurable: true,
			enumerable: propDesc.enumerable,
			get: function() {
				let debounced = debounce(delay, immediate, propDesc!.value);

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
