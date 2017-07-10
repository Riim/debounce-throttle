export interface IThrottled {
	(): any
	clear(): void
	flush(): void
}

export function throttle(delay: number, callback: Function): IThrottled
export function throttle(delay: number, noTrailing: boolean, callback: Function): IThrottled
export function throttle(delay: number, noTrailingOrCallback: Function | boolean, callback?: Function): IThrottled {
	let noTrailing: boolean

	if (callback === undefined) {
		noTrailing = false
		callback = noTrailingOrCallback as Function
	} else {
		noTrailing = noTrailingOrCallback as boolean
	}

	let context: any
	let args: IArguments | null
	let timestamp: number
	let timeoutID: number | null | undefined
	let lastExec = 0
	let result: any

	function later() {
		timeoutID = null

		lastExec = Date.now()

		result = (callback as Function).apply(context, args)
		if (!timeoutID) {
			context = args = null
		}
	}

	let throttled = function throttled() {
		timestamp = Date.now()

		if (timestamp - lastExec >= delay) {
			lastExec = timestamp

			if (!timeoutID) {
				result = (callback as Function).apply(this, arguments)
				return result
			}

			result = (callback as Function).apply(context, args)
		}

		if (noTrailing) {
			return result
		}

		context = this
		args = arguments

		if (!timeoutID) {
			timeoutID = setTimeout(later, delay - (timestamp - lastExec))
		}

		return result
	} as IThrottled

	throttled.flush = function flush() {
		if (timeoutID) {
			clearTimeout(timeoutID)
			timeoutID = null

			lastExec = Date.now()

			result = (callback as Function).apply(context, args)
			if (!timeoutID) {
				context = args = null
			}
		}
	}

	throttled.clear = function clear() {
		if (timeoutID) {
			clearTimeout(timeoutID)
			timeoutID = null

			context = args = null
		}
	}

	return throttled
}
