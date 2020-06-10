import { ApiResponse } from "census/ApiWrapper";
import { Loading, Loadable } from "Loadable";

import * as moment from "moment";

import CensusAPI from "census/CensusAPI";
import OutfitAPI, { Outfit } from "census/OutfitAPI";
import { CharacterAPI, Character } from "census/CharacterAPI";
import { Weapon, WeaponAPI } from "census/WeaponAPI";
import { EventAPI } from "census/EventAPI";
import { Achievement, AchievementAPI } from "census/AchievementAPI";
import { FacilityAPI, Facility } from "census/FacilityAPI";

import { PsLoadout, PsLoadouts, PsLoadoutType } from "census/PsLoadout";
import { PsEventType, PsEvent, PsEvents } from "PsEvent";
import { Event, EventExp, EventKill, EventDeath, EventVehicleKill, EventCapture } from "Event";
import StatMap from "StatMap";
import EventReporter, { 
    statMapToBreakdown, BreakdownWeaponType,
    Breakdown, BreakdownArray, defaultCharacterMapper, defaultCharacterSortField,
    OutfitVersusBreakdown, ClassCollection, classCollectionNumber, BreakdownTimeslot, BreakdownTrend
} from "EventReporter";
import { classCollectionTrend } from "OutfitTrends";

export class ClassBreakdown {
    secondsAs: number = 0;
    score: number = 0;
    kills: number = 0;
    deaths: number = 0;
}

export class FacilityCapture {
    facilityID: string = "";
    name: string = "";
    type: string = "";
    typeID: string = "";
    zoneID: string = "";
    timestamp: Date = new Date();
    timeHeld: number = 0;
    factionID: string = "";
    outfitID: string = "";
    previousFaction: string = "";
}

export class CaptureBreakdown {
    facilityID: string = "";
    zoneID: string = "";
    name: string = "";
    type: string = "";
    typeID: string = "";
    timestamp: Date = new Date();
    timeHeld: number = 0;

    participants: CaptureParticipant[] = [];
    outfits: OutfitParticipants[] = [];

    factionID: string = "";
    outfitID: string = "";
    outfitName: string = "";
    outfitTag: string = "";

    previousFaction: string = "";
    previousOutfitID: string = "";
    previousOutfitName: string = "";
    previousOutfitTag: string = "";

    captureScore: number = 0;
    tickScore: number = 0;

    takenBy: FacilityCapture | null = null;
}

export class OutfitParticipants {
    public outfitID: string = "";
    public outfitTag: string = "";
    public outfitName: string = "";
    public players: number = 0;
    public total: number = 0;
}

export class CaptureParticipant {
    public characterID: string = "";
    public outfitID: string = "";
    public outfitName: string = "";
    public outfitTag: string = "";
    public facilityID: string = "";
    public timestamp: number = 0;
}

export class ExpBreakdown {
    name: string = "";
    score: number = 0;
    amount: number = 0;
}

export type TimeTracking = {
    running: boolean;
    startTime: number;
    endTime: number;
}

export type ClassKdCollection = ClassCollection<ClassBreakdown>;

export function classKdCollection(): ClassKdCollection {
    return {
        infil: new ClassBreakdown(),
        lightAssault: new ClassBreakdown(),
        medic: new ClassBreakdown(),
        engineer: new ClassBreakdown(),
        heavy: new ClassBreakdown(),
        max: new ClassBreakdown(),
        total: new ClassBreakdown()
    };
};

export type ClassCollectionBreakdownTrend = ClassCollection<BreakdownTrend[]>;

export function classCollectionBreakdownTrend(): ClassCollectionBreakdownTrend {
    return {
        total: [],
        infil: [],
        lightAssault: [],
        medic: [],
        engineer: [],
        heavy: [],
        max: []
    }
}

export class OutfitReport {
    stats: Map<string, number> = new Map();
    score: number = 0;
    players: ({ name: string } & Playtime)[] = [];
    events: Event[] = [];

    facilityCaptures: FacilityCapture[] = [];

    continent: string = "Unknown";

    classStats: Map<string, ClassCollection<number>> = new Map();

    scoreBreakdown: ExpBreakdown[] = [];

    overtime = {
        kpm: [] as BreakdownTimeslot[],
        kd: [] as BreakdownTimeslot[],
        rpm: [] as BreakdownTimeslot[],
    };

    perUpdate = {
        kpm: [] as BreakdownTimeslot[],
        kd: [] as BreakdownTimeslot[],
        rpm: [] as BreakdownTimeslot[]
    };

    trends = {
        kpm: classCollectionBreakdownTrend(),
        kd: classCollectionBreakdownTrend()
    };

    weaponKillBreakdown: BreakdownArray = new BreakdownArray();
    weaponTypeKillBreakdown: BreakdownArray = new BreakdownArray();

    deathAllBreakdown: BreakdownArray = new BreakdownArray();
    deathAllTypeBreakdown: BreakdownArray = new BreakdownArray();
    deathRevivedBreakdown: BreakdownArray = new BreakdownArray();
    deathRevivedTypeBreakdown: BreakdownArray = new BreakdownArray();
    deathKilledBreakdown: BreakdownArray = new BreakdownArray();
    deathKilledTypeBreakdown: BreakdownArray = new BreakdownArray();

    outfitVersusBreakdown: OutfitVersusBreakdown[] = [];
    weaponTypeDeathBreakdown: BreakdownWeaponType[] = [];

    vehicleKillBreakdown: BreakdownArray = new BreakdownArray();
    vehicleKillWeaponBreakdown: BreakdownArray = new BreakdownArray();

    timeUnrevived: number[] = [];
    revivedLifeExpectance: number[] = [];

    factionKillBreakdown: BreakdownArray = new BreakdownArray();
    factionDeathBreakdown: BreakdownArray = new BreakdownArray();

    continentKillBreakdown: BreakdownArray = new BreakdownArray();
    continentDeathBreakdown: BreakdownArray = new BreakdownArray();

    classKds = {
        infil: classKdCollection() as ClassKdCollection,
        lightAssault: classKdCollection() as ClassKdCollection,
        medic: classKdCollection() as ClassKdCollection,
        engineer: classKdCollection() as ClassKdCollection,
        heavy: classKdCollection() as ClassKdCollection,
        max: classKdCollection() as ClassKdCollection,
        total: classKdCollection() as ClassKdCollection
    };

    classTypeKills = {
        infil: new BreakdownArray() as BreakdownArray,
        lightAssault: new BreakdownArray() as BreakdownArray,
        medic: new BreakdownArray() as BreakdownArray,
        engineer: new BreakdownArray() as BreakdownArray,
        heavy: new BreakdownArray() as BreakdownArray,
        max: new BreakdownArray() as BreakdownArray,
    };

    classTypeDeaths = {
        infil: new BreakdownArray() as BreakdownArray,
        lightAssault: new BreakdownArray() as BreakdownArray,
        medic: new BreakdownArray() as BreakdownArray,
        engineer: new BreakdownArray() as BreakdownArray,
        heavy: new BreakdownArray() as BreakdownArray,
        max: new BreakdownArray() as BreakdownArray,
    };
}

export type TrackedNpcType = "router" | "unknown";

export class TrackedRouter {
    public ID: string = "";
    public type: TrackedNpcType = "router";
    public owner: string = "";
    public pulledAt: number = 0;
    public firstSpawn: number | undefined = undefined;
    public destroyed: number | undefined = undefined;
    public count: number = 0;
}

export class Playtime {
    public characterID: string = "";
    public secondsOnline: number = 0;
    public infil: ClassBreakdown = new ClassBreakdown();
    public lightAssault: ClassBreakdown = new ClassBreakdown();
    public medic: ClassBreakdown = new ClassBreakdown();
    public engineer:  ClassBreakdown = new ClassBreakdown();
    public heavy:  ClassBreakdown = new ClassBreakdown();
    public max: ClassBreakdown = new ClassBreakdown();
    public mostPlayed = {
        name: "" as string,
        secondsAs: 0 as number,
    };
}

export class ClassUsage {
    public mostPlayed = {
        name: "" as string,
        secondsAs: 0 as number
    };

    public infil: ClassBreakdown = new ClassBreakdown();
    public lightAssault: ClassBreakdown = new ClassBreakdown();
    public medic: ClassBreakdown = new ClassBreakdown();
    public engineer: ClassBreakdown = new ClassBreakdown();
    public heavy: ClassBreakdown = new ClassBreakdown();
    public max: ClassBreakdown = new ClassBreakdown();
}

export class Report {
    opened: boolean = false;
    player: TrackedPlayer | null = null;

    stats: Map<string, string> = new Map();

    classBreakdown: ClassUsage = new ClassUsage();

    classKd: ClassKdCollection = classKdCollection();

    logistics = {
        show: false as boolean,
        routers: [] as TrackedRouter[],
        metas: [] as BreakdownMeta[]
    };

    overtime = {
        kpm: [] as BreakdownTimeslot[],
        kd: [] as BreakdownTimeslot[],
        rpm: [] as BreakdownTimeslot[]
    };

    perUpdate = {
        kpm: [] as BreakdownTimeslot[],
        kd: [] as BreakdownTimeslot[],
        rpm: [] as BreakdownTimeslot[]
    };

    collections: BreakdownSingleCollection[] = [];

    vehicleBreakdown: BreakdownArray = new BreakdownArray();
    scoreBreakdown: ExpBreakdown[] = [];
    ribbons: CountedRibbon[] = [];
    ribbonCount: number = 0;

    breakdowns: BreakdownCollection[] = [];

    weaponKillBreakdown: BreakdownArray = new BreakdownArray();
    weaponKillTypeBreakdown: BreakdownArray = new BreakdownArray();

    weaponDeathBreakdown: BreakdownArray = new BreakdownArray();
    weaponDeathTypeBreakdown: BreakdownArray = new BreakdownArray();
}

export type BreakdownSingleCollection = {
    header: string;
    metas: BreakdownSingle[];
}

export type CountedRibbon = Achievement & { amount: number };

export class BreakdownSpawn {
    public npcID: string = "";
    public count: number = 0;
    public firstSeen: Date = new Date();
}

export class TrackedPlayer {
    public characterID: string = "";
    public outfitTag: string = "";
    public name: string = "";
    public faction: string = "";
    public score: number = 0;

    public online: boolean = true;
    public joinTime: number = 0;
    public secondsOnline: number = 0;

    public stats: StatMap = new StatMap();
    public ribbons: StatMap = new StatMap();

    public recentDeath: EventDeath | null = null;

    public events: Event[] = [];
}

export class BreakdownCollection {
    public title: string = "";
    public sections: BreakdownSection[] = [];
}

export class BreakdownSection {
    public title: string = "";

    public left: BreakdownMeta | null = null;
    public right: BreakdownMeta | null = null;

    public showPercent: boolean = true;
    public showTotal: boolean = true;
}

export class BreakdownMeta {
    public title: string = "";
    public altTitle: string = "Count";
    public data: BreakdownArray = new BreakdownArray();
}

export class BreakdownSingle {
    public title: string = "";
    public altTitle: string = "";
    public data: BreakdownArray = new BreakdownArray();
    public showPercent: boolean = true;
    public showTotal: boolean = true;
}

export class EventFeedEntry {
    public type: "kill" | "death" | "revived" | "revive" | "capture" | "unknown" = "unknown";
    public text: string = "";
    public timestamp: Date = new Date();
    public effects: EventFeedEntry[] = [];
}

export class ReportParameters {
    public player: TrackedPlayer = new TrackedPlayer();
    public events: Event[] = [];
    public tracking: TimeTracking = { running: false, startTime: 0, endTime: 0 };
    public routers: TrackedRouter[] = [];
}

export class IndividualReporter {

    public static generatePersonalReport(parameters: ReportParameters): ApiResponse<Report> {
        const response: ApiResponse<Report> = new ApiResponse();

        if (parameters.player.events.length == 0) {
            response.resolve({ code: 400, data: "No events for player, cannot generate" });
            return response;
        }

        const report: Report = new Report();

        let opsLeft: number = 
            //1       // Transport assists
            + 1     // Supported by
            + 1     // Misc collection
            + 1     // Weapon kills
            + 1     // Weapon type kills
            + 1     // Weapon deaths
            + 1     // Weapon death types
            + 1     // KD over time
            + 1     // KPM over time
            + 1     // KD per update
            + 1     // RPM over time
            + 1     // Ribbons
            + 1     // Medic breakdown
            + 1     // Engineer breakdown
        ;

        const totalOps: number = opsLeft;

        const firstPlayerEvent: Event = parameters.player.events[0];
        const lastPlayerEvent: Event = parameters.player.events[parameters.player.events.length - 1];

        report.player = {...parameters.player};
        report.player.events = [];
        report.player.secondsOnline = (lastPlayerEvent.timestamp - firstPlayerEvent.timestamp) / 1000;

        report.classBreakdown = IndividualReporter.classUsage(parameters);
        report.classKd = IndividualReporter.classVersusKd(parameters.player.events);
        report.scoreBreakdown = IndividualReporter.scoreBreakdown(parameters);

        report.player.stats.getMap().forEach((value: number, eventID: string) => {
            const event: PsEvent | undefined = PsEvents.get(eventID);
            if (event == undefined) {
                return;
            }

            report.stats.set(event.name, `${value}`);
            report.player?.stats.set(event.name, value);
        });

        const calculatedStats: Map<string, string> = IndividualReporter.calculatedStats(parameters, report.classBreakdown);
        calculatedStats.forEach((value: string, key: string) => {
            report.stats.set(key, value);
        });

        report.logistics.routers = IndividualReporter.routerBreakdown(parameters);

        const callback = (step: string) => {
            return () => {
                console.log(`Finished ${step}: Have ${opsLeft - 1} ops left outta ${totalOps}`);
                if (--opsLeft == 0) {
                    response.resolveOk(report);
                }
            }
        }

        IndividualReporter.supportedBy(parameters)
            .ok(data => report.collections.push(data)).always(callback("Supported by"));
        IndividualReporter.miscCollection(parameters)   
            .ok(data => report.collections.push(data)).always(callback("Misc coll"));

        EventReporter.weaponKills(parameters.player.events)
            .ok(data => report.weaponKillBreakdown = data).always(callback("Weapon kills"));
        EventReporter.weaponTypeKills(parameters.player.events)
            .ok(data => report.weaponKillTypeBreakdown = data).always(callback("Weapon type kills"));
        EventReporter.weaponDeaths(parameters.player.events)
            .ok(data => report.weaponDeathBreakdown = data).always(callback("Weapon deaths"));
        EventReporter.weaponTypeDeaths(parameters.player.events)
            .ok(data => report.weaponDeathTypeBreakdown = data).always(callback("Weapon type deaths"));

        EventReporter.kdOverTime(parameters.player.events)
            .ok(data => report.overtime.kd = data).always(callback("KD over time"));
        EventReporter.kpmOverTime(parameters.player.events) 
            .ok(data => report.overtime.kpm = data).always(callback("KPM over time"));

        if (parameters.player.events.find(iter => iter.type == "exp" && (iter.expID == PsEvent.revive || iter.expID == PsEvent.squadRevive)) != undefined) {
            EventReporter.revivesOverTime(parameters.player.events)
                .ok(data => report.overtime.rpm = data).always(callback("RPM over time"));
        } else {
            callback("RPM over time")();
        }

        EventReporter.kdPerUpdate(parameters.player.events)
            .ok(data => report.perUpdate.kd = data).always(callback("KD per update"));

        const ribbonIDs: string[] = Array.from(parameters.player.ribbons.getMap().keys());
        if (ribbonIDs.length > 0) {
            AchievementAPI.getByIDs(ribbonIDs).ok((data: Achievement[]) => {
                report.player?.ribbons.getMap().forEach((amount: number, achivID: string) => {
                    const achiv = data.find((iter: Achievement) => iter.ID == achivID) || AchievementAPI.unknown;
                    const entry: CountedRibbon = {
                        ...achiv,
                        amount: amount
                    };

                    report.ribbonCount += amount;
                    report.ribbons.push(entry);
                });

                report.ribbons.sort((a, b) => {
                    return (b.amount - a.amount) || b.name.localeCompare(a.name);
                });
            }).always(() => {
                callback("Ribbons")();
            });
        } else {
            callback("Ribbons")();
        }

        if (report.classBreakdown.medic.secondsAs > 10) {
            IndividualReporter.medicBreakdown(parameters)
                .ok(data => report.breakdowns.push(data)).always(callback("Medic breakdown"));
        } else {
            callback("Medic breakdown")();
        }

        if (report.classBreakdown.engineer.secondsAs > 10) {
            IndividualReporter.engineerBreakdown(parameters)   
                .ok(data => report.breakdowns.push(data)).always(callback("Eng breakdown"));
        } else {
            callback("Eng breakdown")();
        }

        return response;
    }

    private static medicBreakdown(parameters: ReportParameters): ApiResponse<BreakdownCollection> {
        const response: ApiResponse<BreakdownCollection> = new ApiResponse();

        const medicCollection: BreakdownCollection = new BreakdownCollection();
        medicCollection.title = "Medic";

        let opsLeft: number = 
            1       // Heals
            + 1     // Revives
            + 1;    // Shield repair

        const add = (data: BreakdownSection) => {
            medicCollection.sections.push(data);
        }

        const callback = () => {
            if (--opsLeft == 0) {
                response.resolveOk(medicCollection);
            }
        }

        IndividualReporter.breakdownSection(parameters, "Heal ticks", PsEvent.heal, PsEvent.squadHeal).ok(add).always(callback);
        IndividualReporter.breakdownSection(parameters, "Revives", PsEvent.revive, PsEvent.squadRevive).ok(add).always(callback);
        IndividualReporter.breakdownSection(parameters, "Shield repair ticks", PsEvent.shieldRepair, PsEvent.squadShieldRepair).ok(add).always(callback);

        return response;
    }

    private static engineerBreakdown(parameters: ReportParameters): ApiResponse<BreakdownCollection> {
        const response: ApiResponse<BreakdownCollection> = new ApiResponse();

        const engCollection: BreakdownCollection = new BreakdownCollection();
        engCollection.title = "Engineer";

        let opsLeft: number = 
            1       // Resupply
            + 1;    // Repair MAX

        const add = (data: BreakdownSection) => {
            engCollection.sections.push(data);
        }

        const callback = () => {
            if (--opsLeft == 0) {
                response.resolveOk(engCollection);
            }
        }

        IndividualReporter.breakdownSection(parameters, "Resupply ticks", PsEvent.resupply, PsEvent.squadResupply).ok(add).always(callback);
        IndividualReporter.breakdownSection(parameters, "MAX repair ticks", PsEvent.maxRepair, PsEvent.squadMaxRepair).ok(add).always(callback);

        return response;
    }

    private static breakdownSection(parameters: ReportParameters, name: string, expID: string, squadExpID: string): ApiResponse<BreakdownSection> {
        const response: ApiResponse<BreakdownSection> = new ApiResponse();

        const ticks: EventExp[] = parameters.player.events.filter(iter => iter.type == "exp" && iter.expID == expID) as EventExp[];
        if (ticks.length > 0) {
            const section: BreakdownSection = new BreakdownSection();
            section.title = name;

            let opsLeft: number = 2;

            const callback = () => {
                if (--opsLeft == 0) {
                    response.resolveOk(section);
                }
            }

            section.left = new BreakdownMeta();
            section.left.title = "All";
            EventReporter.experience(expID, ticks).ok((data: BreakdownArray) => {
                section.left!.data = data;
            }).always(callback);

            section.right = new BreakdownMeta();
            section.right.title = "Squad only";
            EventReporter.experience(squadExpID, ticks).ok((data: BreakdownArray) => {
                section.right!.data = data;
            }).always(callback);
        } else {
            response.resolve({ code: 204, data: null });
        }

        return response;
    }

    private static miscCollection(parameters: ReportParameters): ApiResponse<BreakdownSingleCollection> {
        const response: ApiResponse<BreakdownSingleCollection> = new ApiResponse();

        const coll: BreakdownSingleCollection = {
            header: "Misc",
            metas: []
        }

        let opsLeft: number = 
            1;      // Deployabled destroyed

        const dep = IndividualReporter.deployableDestroyedBreakdown(parameters);
        if (dep != null) {
            coll.metas.push(dep);
        }

        if (coll.metas.length > 0) {
            response.resolveOk(coll);
        } else {
            response.resolve({ code: 204, data: null });
        }

        return response;
    }

    private static supportedBy(parameters: ReportParameters): ApiResponse<BreakdownSingleCollection> {
        const response: ApiResponse<BreakdownSingleCollection> = new ApiResponse();

        const coll: BreakdownSingleCollection = {
            header: "Supported by",
            metas: []
        };

        let opsLeft: number = 
            1       // Healed by
            + 1     // Revived by
            + 1     // Shield repaired by
            + 1     // Resupplied by
            + 1;    // Repaired by

        const add = (data: BreakdownSingle) => {
            coll.metas.push(data);
        }

        const callback = () => {
            if (--opsLeft == 0) {
                response.resolveOk(coll);
            }
        }

        IndividualReporter.singleSupportedBy(parameters, "Healed by", [PsEvent.heal, PsEvent.squadHeal]).ok(add).always(callback);
        IndividualReporter.singleSupportedBy(parameters, "Revived by", [PsEvent.revive, PsEvent.squadRevive]).ok(add).always(callback);
        IndividualReporter.singleSupportedBy(parameters, "Shield repaired by", [PsEvent.shieldRepair, PsEvent.squadShieldRepair]).ok(add).always(callback);
        IndividualReporter.singleSupportedBy(parameters, "Resupplied by", [PsEvent.resupply, PsEvent.squadResupply]).ok(add).always(callback);
        IndividualReporter.singleSupportedBy(parameters, "Repaired by", [PsEvent.maxRepair, PsEvent.squadMaxRepair]).ok(add).always(callback);

        return response;
    }

    private static singleSupportedBy(parameters: ReportParameters, name: string, ids: string[]): ApiResponse<BreakdownSingle> {
        const response: ApiResponse<BreakdownSingle> = new ApiResponse();

        let found: boolean = false;
        for (const ev of parameters.events) {
            if (ev.type == "exp" && ids.indexOf(ev.expID) > -1 && ev.targetID == parameters.player.characterID) {
                found = true;
                break;
            }
        }

        if (found == false) {
            response.resolve({ code: 204, data: null });
        } else {
            const meta: BreakdownSingle = new BreakdownSingle();
            meta.title = name;
            meta.altTitle = "Player";
            meta.data = new BreakdownArray();

            EventReporter.experienceSource(ids, parameters.player.characterID, parameters.events).ok((data: BreakdownArray) => {
                meta.data = data;
                response.resolveOk(meta);
            });
        }

        return response;
    }

    private static deployableDestroyedBreakdown(parameters: ReportParameters): BreakdownSingle | null {
        const expIDs: string[] = [
            "57", // Eng t
            "270", // Squad spawn beacon
            "327", // Tank mines
            "370", // Motion sensor kill
            "437", // Shield bubble
            "579", // Spitfire
            "1373", // Hardlight
            "1409", // Router
        ];

        const ticks: EventExp[] = parameters.player.events.filter((iter: Event) => {
            if (iter.type != "exp") {
                return false;
            }

            return expIDs.indexOf(iter.expID) > -1;
        }) as EventExp[];

        if (ticks.length > 0) {
            const meta: BreakdownSingle = new BreakdownSingle();
            meta.title = "Deployable kills";
            meta.altTitle = "Deployable";
            meta.data = new BreakdownArray();

            const map: StatMap = new StatMap();

            for (const tick of ticks) {
                let name = "unknown";
                if (tick.expID == "57") { name = "Engineer turret"; }
                else if (tick.expID == "270") { name = "Spawn beacon"; }
                else if (tick.expID == "327") { name = "Tank mine"; }
                else if (tick.expID == "370") { name = "Motion sensor"; }
                else if (tick.expID == "437") { name = "Shield bubble"; }
                else if (tick.expID == "579") { name = "Spitfire"; }
                else if (tick.expID == "1373") { name = "Hardlight"; }
                else if (tick.expID == "1409") { name = "Router"; }
                else { name = `Unknown ${tick.expID}`; }

                map.increment(name);
            }

            map.getMap().forEach((amount: number, expName: string) => {
                meta.data.total += amount;
                meta.data.data.push({
                    display: expName,
                    sortField: expName,
                    amount: amount,
                    color: undefined
                });
            });

            meta.data.data.sort((a, b) => {
                return b.amount - a.amount || a.sortField.localeCompare(b.sortField);
            });

            return meta;
        }

        return null;
    }

    private static routerBreakdown(parameters: ReportParameters): TrackedRouter[] {
        const rts: TrackedRouter[] = parameters.routers.filter(iter => iter.owner == parameters.player!.characterID);

        return rts;
    }

    private static transportAssists(parameters: ReportParameters): ApiResponse<BreakdownMeta | null> {
        const response: ApiResponse<BreakdownMeta | null> = new ApiResponse();
        
        const transAssists: EventExp[] = parameters.player.events.filter(iter => iter.type == "exp" && iter.expID == "30") as EventExp[];
        if (transAssists.length > 0) {
            const killedIDs: string[] = transAssists.map(iter => iter.targetID).filter((iter, index, arr) => arr.indexOf(iter) == index);

            const firstEv: number = Math.min(...transAssists.map(iter => iter.timestamp));
            const lastEv: number = Math.max(...transAssists.map(iter => iter.timestamp));

            const map: StatMap = new StatMap();

            const meta: BreakdownMeta = new BreakdownMeta();
            meta.title = "Transport assists";
            meta.data = new BreakdownArray();

            EventAPI.getMultiDeaths(killedIDs, firstEv, lastEv).ok((data: EventDeath[]) => {
                const killers: string[] = [];

                for (const assist of transAssists) {
                    const death = data.find(iter => iter.sourceID == assist.targetID && iter.timestamp == assist.timestamp);
                    if (death == undefined) {
                        console.warn(`Missing event death for transport assist for ${assist.targetID} at ${assist.timestamp}`);
                        continue;
                    }
                    killers.push(death.targetID);
                }

                CharacterAPI.getByIDs(killers.filter((v, i, a) => a.indexOf(v) == i)).ok((data: Character[]) => {
                    for (const killer of killers) {
                        const killerChar = data.find(iter => iter.ID == killer);
                        if (killerChar == undefined) {
                            console.warn(`Missing character ${killer} when generating transport assists`);
                            continue;
                        }

                        map.increment(killerChar.name);
                    }

                    map.getMap().forEach((amount: number, char: string) => {
                        const breakdown: Breakdown = {
                            display: char,
                            sortField: char,
                            amount: amount,
                            color: undefined
                        };

                        meta.data.data.push(breakdown);
                        meta.data.total += amount;
                    });

                    meta.data.data.sort((a, b) => {
                        return (b.amount - a.amount) || a.sortField.localeCompare(b.sortField);
                    });

                    response.resolveOk(meta);
                });
            });
        } else {
            response.resolve({ code: 204, data: null });
        }

        return response;
    }

    private static calculatedStats(parameters: ReportParameters, classKd: ClassUsage): Map<string, string> {
        const map: Map<string, string> = new Map<string, string>();

        const stats: StatMap = parameters.player.stats;

        map.set("KPM",
            (stats.get("Kill") / (parameters.player.secondsOnline / 60)).toFixed(2)
        );

        // K/D = Kills / Deaths
        map.set("K/D",
            (stats.get("Kill") / stats.get("Death", 1)).toFixed(2)
        );

        // KA/D = Kills + Assits / Deaths
        map.set("KA/D",
            ((stats.get("Kill") + stats.get("Kill assist")) / stats.get("Death", 1)).toFixed(2)
        );

        // HSR = Headshots / Kills
        map.set("HSR",
            `${(stats.get("Headshot") / stats.get("Kill") * 100).toFixed(2)}%`
        );

        // KR/D  = Kills + Revives / Deaths
        map.set("KR/D",
            ((classKd.medic.kills + stats.get("Revive")) 
                / (classKd.medic.deaths || 1)).toFixed(2)
        );

        // R/D = Revives / Death
        map.set("R/D",
            (stats.get("Revive") / (classKd.medic.deaths || 1)).toFixed(2)
        );

        // RPM = Revives / minutes online
        map.set("RPM",
            (stats.get("Revive") / (classKd.medic.secondsAs / 60)).toFixed(2)
        );

        return map;
    }

    private static scoreBreakdown(parameters: ReportParameters): ExpBreakdown[] {
        const breakdown: Map<string, ExpBreakdown> = new Map<string, ExpBreakdown>();
        for (const event of parameters.player.events) {
            if (event.type == "exp") {
                const exp: PsEvent = PsEvents.get(event.expID) || PsEvent.other;
                if (!breakdown.has(exp.name)) {
                    breakdown.set(exp.name, new ExpBreakdown());
                }

                const score: ExpBreakdown = breakdown.get(exp.name)!;
                score.name = exp.name;
                score.score += event.amount;
                score.amount += 1;

                if (exp == PsEvent.other) {
                    //console.log(`Other: ${JSON.stringify(event)}`);
                }
            }
        }

        // Sort all the entries by score, followed by amount, then lastly name
        return [...breakdown.entries()].sort((a, b) => {
            return b[1].score - a[1].score
                || b[1].amount - a[1].amount
                || a[0].localeCompare(b[0]);
        }).map((a) => a[1]); // Transform the tuple into the ExpBreakdown
    }

    public static classVersusKd(events: Event[], classLimit?: PsLoadoutType): ClassKdCollection {
        const kds: ClassKdCollection = classKdCollection();

        events.forEach((event: Event) => {
            if (event.type == "kill" || event.type == "death") {

                const targetLoadoutID: string = event.targetLoadoutID;
                const targetLoadout = PsLoadouts.get(targetLoadoutID);
                if (targetLoadout == undefined) { return; }

                if (classLimit != undefined) {
                    if (targetLoadout.type == classLimit) {
                        return; // Continue to next iteration
                    }
                }

                if (event.type == "kill") {
                    switch (targetLoadout.type) {
                        case "infil": kds.infil.kills += 1; break;
                        case "lightAssault": kds.lightAssault.kills += 1; break;
                        case "medic": kds.medic.kills += 1; break;
                        case "engineer":  kds.engineer.kills += 1; break;
                        case "heavy":  kds.heavy.kills += 1; break;
                        case "max": kds.max.kills += 1; break;
                        default: console.warn(`Unknown type`);
                    }
                }
                if (event.type == "death" && event.revived == false) {
                    switch (targetLoadout.type) {
                        case "infil": kds.infil.deaths += 1; break;
                        case "lightAssault": kds.lightAssault.deaths += 1; break;
                        case "medic": kds.medic.deaths += 1; break;
                        case "engineer":  kds.engineer.deaths += 1; break;
                        case "heavy":  kds.heavy.deaths += 1; break;
                        case "max": kds.max.deaths += 1; break;
                        default: console.warn(`Unknown type`);
                    }
                }
                if (event.type == "death" && event.revived == true) {
                    switch (targetLoadout.type) {
                        case "infil": kds.infil.score += 1; break;
                        case "lightAssault": kds.lightAssault.score += 1; break;
                        case "medic": kds.medic.score += 1; break;
                        case "engineer":  kds.engineer.score += 1; break;
                        case "heavy":  kds.heavy.score += 1; break;
                        case "max": kds.max.score += 1; break;
                        default: console.warn(`Unknown type`);
                    }
                }
            }
        });

        return kds;
    }

    public static classUsage(parameters: ReportParameters): Playtime {
        const usage: Playtime = new Playtime();

        if (parameters.player.events.length == 0) {
            return usage;
        }

        let lastLoadout: PsLoadout | undefined = undefined;
        let lastTimestamp: number = parameters.player.events[0].timestamp;

        const finalTimestamp: number = parameters.player.events[parameters.player.events.length - 1].timestamp;

        usage.characterID = parameters.player.characterID;
        usage.secondsOnline = (finalTimestamp - lastTimestamp) / 1000;

        parameters.player.events.forEach((event: Event) => {
            if (event.type == "capture") {
                return;
            }

            lastLoadout = PsLoadouts.get(event.loadoutID);
            if (lastLoadout == undefined) {
                return console.warn(`Unknown loadout ID: ${event.loadoutID}`);
            }

            if (event.type == "exp") {
                const diff: number = (event.timestamp - lastTimestamp) / 1000;
                lastTimestamp = event.timestamp;

                switch (lastLoadout.type) {
                    case "infil": usage.infil.secondsAs += diff; break;
                    case "lightAssault": usage.lightAssault.secondsAs += diff; break;
                    case "medic": usage.medic.secondsAs += diff; break;
                    case "engineer":  usage.engineer.secondsAs += diff; break;
                    case "heavy":  usage.heavy.secondsAs += diff; break;
                    case "max": usage.max.secondsAs += diff; break;
                    default: console.warn(`Unknown type`);
                }
            }

            if (event.type == "exp") {
                switch (lastLoadout.type) {
                    case "infil": usage.infil.score += event.amount; break;
                    case "lightAssault": usage.lightAssault.score += event.amount; break;
                    case "medic": usage.medic.score += event.amount; break;
                    case "engineer":  usage.engineer.score += event.amount; break;
                    case "heavy":  usage.heavy.score += event.amount; break;
                    case "max": usage.max.score += event.amount; break;
                    default: console.warn(`Unknown type`);
                }
            } else if (event.type == "kill") {
                switch (lastLoadout.type) {
                    case "infil": usage.infil.kills += 1; break;
                    case "lightAssault": usage.lightAssault.kills += 1; break;
                    case "medic": usage.medic.kills += 1; break;
                    case "engineer":  usage.engineer.kills += 1; break;
                    case "heavy":  usage.heavy.kills += 1; break;
                    case "max": usage.max.kills += 1; break;
                    default: console.warn(`Unknown type`);
                }
            } else if (event.type == "death" && event.revived == false) {
                switch (lastLoadout.type) {
                    case "infil": usage.infil.deaths += 1; break;
                    case "lightAssault": usage.lightAssault.deaths += 1; break;
                    case "medic": usage.medic.deaths += 1; break;
                    case "engineer":  usage.engineer.deaths += 1; break;
                    case "heavy":  usage.heavy.deaths += 1; break;
                    case "max": usage.max.deaths += 1; break;
                    default: console.warn(`Unknown type`);
                }
            }
        });

        let maxTime: number = 0;
        if (usage.infil.secondsAs > maxTime) {
            maxTime = usage.infil.secondsAs;
            usage.mostPlayed.name = "Infiltrator";
        }
        if (usage.lightAssault.secondsAs > maxTime) {
            maxTime = usage.lightAssault.secondsAs;
            usage.mostPlayed.name = "Light Assault";
        }
        if (usage.medic.secondsAs > maxTime) {
            maxTime = usage.medic.secondsAs;
            usage.mostPlayed.name = "Medic";
        } 
        if (usage.engineer.secondsAs > maxTime) {
            maxTime = usage.engineer.secondsAs;
            usage.mostPlayed.name = "Engineer";
        }
        if (usage.heavy.secondsAs > maxTime) {
            maxTime = usage.heavy.secondsAs;
            usage.mostPlayed.name = "Heavy";
        }
        if (usage.max.secondsAs > maxTime) {
            maxTime = usage.max.secondsAs;
            usage.mostPlayed.name = "MAX";
        }
        usage.mostPlayed.secondsAs = maxTime;

        return usage;
    }

    public static unrevivedTime(events: Event[]): number[] {
        const array: number[] = [];

        for (const ev of events) {
            if (ev.type != "death") {
                continue;
            }

            if (ev.revivedEvent != null) {
                array.push((ev.revivedEvent.timestamp - ev.timestamp) / 1000);
            }
        }

        return array.sort((a, b) => b - a);
    }

    public static reviveLifeExpectance(events: Event[]): number[] {
        const array: number[] = [];

        for (const ev of events) {
            if (ev.type != "death" || ev.revivedEvent == null) {
                continue;
            }

            const charEvents: Event[] = events.filter(iter => iter.sourceID == ev.sourceID);

            const index: number = charEvents.findIndex(iter => {
                return iter.type == "death" && iter.timestamp == ev.timestamp && iter.targetID == ev.targetID;
            });

            if (index == -1) {
                console.error(`Failed to find a death for ${ev.sourceID} at ${ev.timestamp} but wasn't found in charEvents`);
                continue;
            }

            let nextDeath: EventDeath | null = null;
            for (let i = index + 1; i < charEvents.length; ++i) {
                if (charEvents[i].type == "death") {
                    nextDeath = charEvents[i] as EventDeath;
                    break;
                }
            }

            if (nextDeath == null) {
                console.error(`Failed to find the next death for ${ev.sourceID} at ${ev.timestamp}`);
                continue;
            }

            const diff: number = (nextDeath.timestamp - ev.revivedEvent.timestamp) / 1000;
            if (diff <= 20) {
                array.push(diff);
            }
        }

        return array.sort((a, b) => b - a);
    }

    public static generateContinentPlayedOn(events: Event[]): string {
        let indar: number = 0;
        let esamir: number = 0;
        let amerish: number = 0;
        let hossin: number = 0;

        for (const ev of events) {
            if (ev.type == "kill" || ev.type == "death") {
                switch (ev.zoneID) {
                    case "2": ++indar; break;
                    case "4": ++hossin; break;
                    case "6": ++amerish; break;
                    case "8": ++esamir; break;
                }
            }
        }

        let count: number = 0;
        let cont: string = "Default";
        if (indar > count) {
            cont = "Indar";
            count = indar;
        }
        if (esamir > count) {
            cont = "Esamir";
            count = esamir;
        }
        if (amerish > count) {
            cont = "Amerish";
            count = amerish;
        }
        if (hossin > count) {
            cont = "Hossin";
            count = hossin;
        }

        return cont;
    }

}