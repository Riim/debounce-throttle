export interface IThrottled {
	(): any;
	clear(): void;
	flush(): void;
}

export const throttle: {
	(delay: number, noTrailing: boolean | undefined, callback: Function): IThrottled;
	(delay: number, callback: Function): IThrottled;

	decorator(
		delay: number,
		noTrailing?: boolean
	): (
		target: Object,
		propertyName: string,
		propertyDesc?: PropertyDescriptor
	) => PropertyDescriptor;
} = function throttle(
	delay: number,
	noTrailing: boolean | Function | undefined,
	callback?: Function
): IThrottled {
	if (typeof noTrailing == 'function') {
		callback = noTrailing;
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

		result = (callback as Function).apply(context, args);
		if (!timeoutID) {
			context = args = null;
		}
	}

	let throttled = function throttled() {
		timestamp = Date.now();

		if (timestamp - lastExec >= delay) {
			lastExec = timestamp;

			if (!timeoutID) {
				result = (callback as Function).apply(this, arguments);
				return result;
			}

			result = (callback as Function).apply(context, args);
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

			result = (callback as Function).apply(context, args);
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
	return (target, propertyName, propertyDesc) => {
		if (!propertyDesc) {
			propertyDesc = Object.getOwnPropertyDescriptor(target, propertyName);
		}
		let method = propertyDesc!.value;

		propertyDesc!.value = throttle(delay, noTrailing, method);

		return propertyDesc!;
	};
};
