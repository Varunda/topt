
export type PsLoadoutType = "infil" | "lightAssault" | "medic" | "engineer" | "heavy" | "max" | "unknown";

export class PsLoadout {
    public ID: number = 0;
    public faction: string = "";
    public longName: string = "";
    public shortName: string = "";
    public singleName: string = "";
    public type: PsLoadoutType = "unknown";

    public static default: PsLoadout = {
        ID: -1,
        faction: "DD",
        longName: "Default",
        shortName: "Def",
        singleName: "D",
        type: "unknown"
    };
}

export const PsLoadouts: Map<string, PsLoadout> = new Map<string, PsLoadout>([
    ["1", {
        ID: 1,
        faction: "NC",
        longName: "Infiltrator",
        shortName: "Infil",
        singleName: "I",
        type: "infil"
    }],
    ["3", {
        ID: 3,
        faction: "NC",
        longName: "Light Assault",
        shortName: "LA",
        singleName: "L",
        type: "lightAssault"
    }],
    ["4", {
        ID: 4,
        faction: "NC",
        longName: "Medic",
        shortName: "Medic",
        singleName: "M",
        type: "medic"
    }],
    ["5", {
        ID: 5,
        faction: "NC",
        longName: "Engineer",
        shortName: "Eng",
        singleName: "E",
        type: "engineer"
    }],
    ["6", {
        ID: 5,
        faction: "NC",
        longName: "Heavy Assault",
        shortName: "HA",
        singleName: "H",
        type: "heavy"
    }],
    ["7", {
        ID: 7,
        faction: "NC",
        longName: "Max",
        shortName: "Max",
        singleName: "W",
        type: "max"
    }],

    ["8", {
        ID: 8,
        faction: "TR",
        longName: "Infiltrator",
        shortName: "Infil",
        singleName: "I",
        type: "infil"
    }],
    ["10", {
        ID: 10,
        faction: "TR",
        longName: "Light Assault",
        shortName: "LA",
        singleName: "L",
        type: "lightAssault"
    }],
    ["11", {
        ID: 11,
        faction: "TR",
        longName: "Medic",
        shortName: "Medic",
        singleName: "M",
        type: "medic"
    }],
    ["12", {
        ID: 12,
        faction: "TR",
        longName: "Engineer",
        shortName: "Eng",
        singleName: "E",
        type: "engineer"
    }],
    ["13", {
        ID: 13,
        faction: "TR",
        longName: "Heavy Assault",
        shortName: "HA",
        singleName: "H",
        type: "heavy"
    }],
    ["14", {
        ID: 14,
        faction: "TR",
        longName: "Max",
        shortName: "Max",
        singleName: "W",
        type: "max"
    }],

    ["15", {
        ID: 15,
        faction: "VS",
        longName: "Infiltrator",
        shortName: "Infil",
        singleName: "I",
        type: "infil"
    }],
    ["17", {
        ID: 17,
        faction: "VS",
        longName: "Light Assault",
        shortName: "LA",
        singleName: "L",
        type: "lightAssault"
    }],
    ["18", {
        ID: 18,
        faction: "VS",
        longName: "Medic",
        shortName: "Medic",
        singleName: "M",
        type: "medic"
    }],
    ["19", {
        ID: 19,
        faction: "VS",
        longName: "Engineer",
        shortName: "Eng",
        singleName: "E",
        type: "engineer"
    }],
    ["20", {
        ID: 20,
        faction: "VS",
        longName: "Heavy Assault",
        shortName: "HA",
        singleName: "H",
        type: "heavy"
    }],
    ["21", {
        ID: 21,
        faction: "VS",
        longName: "Max",
        shortName: "Max",
        singleName: "W",
        type: "max"
    }],

    ["28", {
        ID: 28,
        faction: "NS",
        longName: "Infiltrator",
        shortName: "Infil",
        singleName: "I",
        type: "infil"
    }],
    ["29", {
        ID: 29,
        faction: "NS",
        longName: "Light Assault",
        shortName: "LA",
        singleName: "L",
        type: "lightAssault"
    }],
    ["30", {
        ID: 30,
        faction: "NS",
        longName: "Medic",
        shortName: "medic",
        singleName: "M",
        type: "medic"
    }],
    ["31", {
        ID: 31,
        faction: "NS",
        longName: "Engineer",
        shortName: "eng",
        singleName: "E",
        type: "engineer"
    }],
    ["32", {
        ID: 32,
        faction: "NS",
        longName: "Heavy Assault",
        shortName: "heavy",
        singleName: "H",
        type: "heavy"
    }],
    ["45", {
        ID: 45,
        faction: "NS",
        longName: "MAX",
        shortName: "max",
        singleName: "W",
        type: "max"
    }],
]);