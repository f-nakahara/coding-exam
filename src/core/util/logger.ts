import { Config } from "./config";

export class Logger {
	private constructor() {}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	static debug(message: any): void {
		if (Config.env !== "production") {
			console.debug("[DEBUG] %o", message);
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	static info(message: any): void {
		if (Config.env !== "production") {
			console.info("[INFO] %o", message);
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	static warning(message: any): void {
		if (Config.env !== "production") {
			console.warn("[WARNING] %o", message);
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	static error(error: any): void {
		if (Config.env !== "production") {
			console.error("[ERROR] %o", error);
		}
	}
}
