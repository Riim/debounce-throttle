export interface IThrottled {
	(): any;
	flush(): void;
	clear(): void;
}

export const throttle: {
	(delay: number, noTrailing: boolean, cb: Function): IThrottled;
	(delay: number, cb: Function): IThrottled;

	decorator(
		delay: number,
		noTrailing?: boolean
	): (target: Object, propName: string, propDesc?: PropertyDescriptor) => PropertyDescriptor;
} = function throttle(delay: number, noTrailing: boolean | Function, cb?: Function): IThrottled {
	if (typeof noTrailing == 'function') {
		cb = noTrailing;
		noTrailing = false;
	}

	let lastExec = 0;
	let timeoutID: number | null | undefined;
	let context: any;
	let args: IArguments | null;
	let result: any;

	function later() {
		lastExec = Date.now();
		timeoutID = null;
		result = cb!.apply(context, args);
		context = args = null;
	}

	let throttled = function throttled() {
		let now = Date.now();

		if (now - lastExec >= delay) {
			lastExec = now;

			if (timeoutID) {
				clearTimeout(timeoutID);

				timeoutID = null;
				result = cb!.apply(context, args);
				context = args = null;
			} else {
				result = cb!.apply(this, arguments);
			}
		} else {
			if (!noTrailing) {
				context = this;
				args = arguments;

				if (!timeoutID) {
					timeoutID = setTimeout(later, delay - (now - lastExec));
				}
			}
		}

		return result;
	} as IThrottled;

	throttled.flush = () => {
		if (timeoutID) {
			clearTimeout(timeoutID);

			lastExec = Date.now();
			timeoutID = null;
			result = cb!.apply(context, args);
			context = args = null;
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

			get: function () {
				let throttled = throttle(delay, noTrailing || false, propDesc!.value);

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
