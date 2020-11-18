import { ClassCollection } from "tcore";

export type OutfitTrends = OutfitTrendsV1;

export class OutfitTrendsV1 {

    public version: "1" = "1";

    public outfit = {
        tag: "" as string,
        name: "" as string
    };

    public sessions: SessionV1[] = [];

}

export type ClassCollectionTrend = ClassCollection<number[]>;

export function classCollectionTrend(): ClassCollectionTrend {
    return {
        infil: [],
        lightAssault: [],
        medic: [],
        engineer: [],
        heavy: [],
        max: [],
        total: [],
    };
};

export class SessionV1 {
    public timestamp: Date = new Date();
    public kpms: ClassCollectionTrend = classCollectionTrend();
    public kds: ClassCollectionTrend = classCollectionTrend();
}

