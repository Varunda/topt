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
    private static _settings: CoreSettings | undefined = undefined;

    public static KEY_TREND: string = "topt.trends";
    public static KEY_SESSION: string = "topt.session";
    public static KEY_SETTINGS: string = "topt.settings";

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

    public static getSettings(): CoreSettings | null {
        if (this._settings == undefined) {
            if (this.isEnabled() == false) {
                return null;
            }

            let item: StorageMetadata<CoreSettings> = {
                tag: "settings",
                data: new CoreSettings() as CoreSettings
            };

            const itemStr: string | null = localStorage.getItem(this.KEY_SETTINGS);
            if (itemStr == null) {
                return null;
            } else {
                item = JSON.parse(itemStr);
            }

            if (item.tag == undefined || item.tag != "settings") {
                console.warn(`Cannot get settings: localStorage item ${this.KEY_SETTINGS} contained the wrong tag: ${item.tag}`);
                return null;
            }

            this._settings = item.data;
        }

        return this._settings;
    }

    public static setSettings(settings: CoreSettings | null): void {
        if (this.isEnabled() == false) {
            return console.warn(`Cannot save settings: localStorage is not enabled`);
        }

        if (settings == null) {
            localStorage.removeItem(this.KEY_SETTINGS);
        } else {
            let item: StorageMetadata<CoreSettings> = {
                tag: "settings",
                data: settings
            };

            localStorage.setItem(this.KEY_SETTINGS, JSON.stringify(item));
        }
    }

}
(window as any).StorageHelper = StorageHelper;