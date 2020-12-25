import { LoggerMetadata } from "LoggerMetadata";
import { CoreSettings } from "tcore";

export class StorageMetadata<T> {
    public tag: string = "";
    public data: T;

    public constructor(data: T) {
        this.data = data;
    }
}

export class StorageHelper {

    private static _enabled: boolean | undefined = undefined;

    public static KEY_TREND: string = "topt.trends";
    public static KEY_SESSION: string = "topt.session";
    public static KEY_SETTINGS: string = "topt.settings";

    public static KEY_LOGGER_SETTINGS: string = "topt.loggers";

    public static isEnabled(): boolean {
        if (this._enabled == undefined) {
            try {
                const key: string = "$__topt_test_key__";

                localStorage.setItem(key, key);
                localStorage.getItem(key);
                localStorage.removeItem(key);

                this._enabled = true;
            } catch {
                this._enabled = false;
            }
        }

        return this._enabled;
    }

    public static get<T>(key: string): T | null {
        if (this.isEnabled() == false) {
            return null;
        }

        let item: T;

        const itemStr: string | null = localStorage.getItem(key);
        if (itemStr == null) {
            return null;
        }

        item = JSON.parse(itemStr);

        if ((item as any).tag != undefined) {
            console.log(`Found old stored data under ${key}`);
            item = (item as any).data;
        }

        return item;
    }

    public static set<T>(key: string, item: T | null): void {
        if (this.isEnabled() == false) {
            return;
        }

        if (item == null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(item));
        }
    }

    public static getSettings(): CoreSettings | null { return this.get(this.KEY_SETTINGS); }
    public static setSettings(settings: CoreSettings | null): void { this.set(this.KEY_SETTINGS, settings); }

    public static getLoggers(): LoggerMetadata[] | null { return this.get(this.KEY_LOGGER_SETTINGS); }
    public static setLoggers(loggers: LoggerMetadata[]): void { this.set(this.KEY_LOGGER_SETTINGS, loggers); }

}
(window as any).StorageHelper = StorageHelper;