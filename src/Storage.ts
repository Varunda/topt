import { OutfitTrendsV1 } from "OutfitTrends";

export class StorageTrend {
    public name: string = "";
    public trend: OutfitTrendsV1 = new OutfitTrendsV1();
}

export class StorageSession {
    public timestamp: Date = new Date();
    public serviceID: string = "";
    public events: any[] = [];
}

export class StorageMetadata<T> {
    public tag: string = "";
    public data: T;

    public constructor(data: T) {
        this.data = data;
    }
}

export class StorageHelper {

    private static _enabled: boolean | undefined = undefined;
    private static _trends: StorageTrend[] | undefined = undefined;
    private static _sessions: StorageSession | undefined = undefined;

    public static KEY_TREND: string = "topt.trends";
    public static KEY_SESSION: string = "topt.session";

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

    private static setTrendsData(data: StorageTrend[]): void {
        if (this.isEnabled() == false) {
            return console.error(`Cannot set trends data: localStorage is not enabled`);
        }

        localStorage.setItem(this.KEY_TREND, JSON.stringify({
            tag: "trends",
            data: data
        }));

        this._trends = undefined;
    }

    public static getTrends(): StorageTrend[] {
        if (this._trends == undefined) {
            if (this.isEnabled() == false) {
                console.error(`Cannot get trends: localStorage is not enabled`);
                return [];
            }

            let item: StorageMetadata<StorageTrend[]> = {
                tag: "trends",
                data: [] as StorageTrend[]
            };

            const itemStr: string | null = localStorage.getItem(this.KEY_TREND);
            if (itemStr == null) {
                console.warn(`Creating new trends in localStorage`);
                localStorage.setItem(this.KEY_TREND, JSON.stringify(item));
            } else {
                item = JSON.parse(itemStr);
            }

            if (item.tag == undefined || item.tag != "trends") {
                console.warn(`Cannot get trends: localStorage item ${this.KEY_TREND} contained the wrong tag: ${item.tag}`);
                return [];
            }

            const trends: StorageTrend[] = item.data;

            for (const trend of trends) {
                for (const session of trend.trend.sessions) {
                    if (typeof session.timestamp == "string") {
                        session.timestamp = new Date(session.timestamp);
                    }
                }
            }

            console.log(`Loaded ${trends.length} trends`);

            this._trends = trends;
        }

        return this._trends;
    }

    public static setTrends(name: string, trend: OutfitTrendsV1): void {
        if (this.isEnabled() == false) {
            return console.error(`Cannot set trends for ${name}: localStorage is not enabled`);
        }

        const storageData: StorageTrend[] = this.getTrends();

        const index: number = storageData.findIndex(iter => iter.name == name);
        if (index == -1) {
            storageData.push({
                name: name,
                trend: trend
            });
        } else {
            storageData[index] = {
                name: name,
                trend: trend
            };
        }

        this.setTrendsData(storageData);
    }

    public static getTrend(name: string): OutfitTrendsV1 | null {
        if (this.isEnabled() == false) {
            throw `Cannot get trend data for storage ${name}: localStorage is not enabled`;
        }

        const trends: StorageTrend[] = this.getTrends();

        const trend = trends.find(iter => iter.name == name);

        return trend?.trend || null;
    }

}
(window as any).StorageHelper = StorageHelper;