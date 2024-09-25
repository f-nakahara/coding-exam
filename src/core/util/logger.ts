import { Config } from "./config";

export class Logger {
	private constructor() {}

	static debug(message: any): void {
		if (Config.env !== "production") {
			console.debug(`[DEBUG] %o`, message);
		}
	}

	static info(message: any): void {
		if (Config.env !== "production") {
			console.info(`[INFO] %o`, message);
		}
	}

	static warning(message: any): void {
		if (Config.env !== "production") {
			console.warn(`[WARNING] %o`, message);
		}
	}

	static error(error: any): void {
		if (Config.env !== "production") {
			console.error(`[ERROR] %o`, error);
		}
	}
}
