export interface IThrottled {
	(): any;
	clear(): void;
	flush(): void;
}

export const throttle: {
	(delay: number, noTrailing: boolean | undefined, cb: Function): IThrottled;
	(delay: number, cb: Function): IThrottled;

	decorator(
		delay: number,
		noTrailing?: boolean
	): (target: Object, propName: string, propDesc?: PropertyDescriptor) => PropertyDescriptor;
} = function throttle(
	delay: number,
	noTrailing: boolean | Function | undefined,
	cb?: Function
): IThrottled {
	if (typeof noTrailing == 'function') {
		cb = noTrailing;
		noTrailing = false;
	}

	let context: any;
	let args: IArguments | null;
	let timestamp: number;
	let timeoutID: number | null | undefined;
	let lastExec = 0;
	let result: any;

	function later() {
		timeoutID = null;
		lastExec = Date.now();
		result = cb!.apply(context, args);

		if (!timeoutID) {
			context = args = null;
		}
	}

	let throttled = function throttled() {
		timestamp = Date.now();

		if (timestamp - lastExec >= delay) {
			lastExec = timestamp;

			if (!timeoutID) {
				result = cb!.apply(this, arguments);
				return result;
			}

			result = cb!.apply(context, args);
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
	} as IThrottled;

	throttled.flush = () => {
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

	throttled.clear = () => {
		if (timeoutID) {
			clearTimeout(timeoutID);
			timeoutID = null;
			context = args = null;
		}
	};

	return throttled;
} as any;

throttle.decorator = (delay, noTrailing) => {
	return (target, propName, propDesc) => {
		if (!propDesc) {
			propDesc = Object.getOwnPropertyDescriptor(target, propName)!;
		}

		return {
			configurable: true,
			enumerable: propDesc.enumerable,
			get: function() {
				let throttled = throttle(delay, noTrailing, propDesc!.value);

				Object.defineProperty(this, propName, {
					configurable: true,
					enumerable: propDesc!.enumerable,
					writable: propDesc!.writable,
					value: throttled
				});

				return throttled;
			}
		};
	};
};
