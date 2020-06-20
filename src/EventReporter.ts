import { ApiResponse } from "census/ApiWrapper";
import { Character, CharacterAPI } from "census/CharacterAPI";
import { Weapon, WeaponAPI } from "census/WeaponAPI";
import { Event, EventExp, EventKill, EventDeath } from "Event";
import StatMap from "StatMap";
import { PsLoadout, PsLoadouts, PsLoadoutType } from "census/PsLoadout";
import { Vehicle, VehicleAPI, VehicleTypes } from "census/VehicleAPI";

import * as moment from "moment";
import { PsEvent } from "PsEvent";

import { TrackedPlayer, IndividualReporter, TimeTracking, Playtime } from "InvididualGenerator";

export class BreakdownArray {
    data: Breakdown[] = [];
    total: number = 0;
}

export class Breakdown { 
    display: string = "";
    sortField: string = "";
    amount: number = 0;
    color: string | undefined = undefined;
}

export class BreakdownTimeslot {
    startTime: number = 0;
    endTime: number = 0;
    value: number = 0;
}

export class BreakdownTrend {
    timestamp: Date = new Date();
    values: number[] = [];
};

export class OutfitVersusBreakdown {
    tag: string = "";
    name: string = "";
    faction: string = "";
    kills: number = 0;
    deaths: number = 0;
    revived: number = 0;
    players: number = 0;

    classKills: ClassCollection<number> = classCollectionNumber();
    classDeaths: ClassCollection<number> = classCollectionNumber();
    classRevived: ClassCollection<number> = classCollectionNumber();
}

export class BreakdownWeaponType {
    type: string = "";
    deaths: number = 0;
    revived: number = 0;
    unrevived: number = 0;
    headshots: number = 0;
    mostUsed: string = "";
    mostUsedDeaths: number = 0;
}

export function classCollectionNumber() {
    return {
        total: 0,
        infil: 0,
        lightAssault: 0,
        medic: 0,
        engineer: 0,
        heavy: 0,
        max: 0
    }
}

export interface ClassCollection<T> {
    total: T;
    infil: T;
    lightAssault: T;
    medic: T;
    engineer: T;
    heavy: T;
    max: T;
}

export function statMapToBreakdown<T>(map: StatMap,
        source: (IDs: string[]) => ApiResponse<T[]>,
        matcher: (elem: T, ID: string) => boolean,
        mapper: (elem: T | undefined, ID: string) => string,
        sortField: ((elem: T | undefined, ID: string) => string) | undefined = undefined
    ): ApiResponse<BreakdownArray> {

    const breakdown: ApiResponse<BreakdownArray> = new ApiResponse();
    const arr: BreakdownArray = new BreakdownArray();

    if (map.size() > 0) {
        const IDs: string[] = Array.from(map.getMap().keys());
        source(IDs).ok((data: T[]) => {
            map.getMap().forEach((amount: number, ID: string) => {
                const datum: T | undefined = data.find(elem => matcher(elem, ID));
                const breakdown: Breakdown = {
                    display: mapper(datum, ID),
                    sortField: (sortField != undefined) ? sortField(datum, ID) : mapper(datum, ID),
                    amount: amount,
                    color: undefined
                }
                arr.total += amount;
                arr.data.push(breakdown);
            });

            arr.data.sort((a, b) => {
                const diff: number = b.amount - a.amount;
                return diff || b.sortField.localeCompare(a.sortField);
            });

            breakdown.resolveOk(arr);
        });
    } else {
        breakdown.resolveOk(arr);
    }

    return breakdown;
}

export function defaultCharacterMapper(elem: Character | undefined, ID: string): string {
    return `${(elem?.outfitTag) ? `[${elem.outfitTag}] ` : ``}${(elem) ? elem.name : `Unknown ${ID}`}`;
}

export function defaultCharacterSortField(elem: Character | undefined, ID: string): string {
    return elem?.name ?? `Unknown ${ID}}`;
}

export function defaultWeaponMapper(elem: Weapon | undefined, ID: string): string {
    return elem?.name ?? `Unknown ${ID}`;
}

export function defaultVehicleMapper(elem: Vehicle | undefined, ID: string): string {
    return elem?.name ?? `Unknown ${ID}`;
}

export default class EventReporter {

    public static experience(expID: string, events: Event[]): ApiResponse<BreakdownArray> {
        const exp: StatMap = new StatMap();

        for (const event of events) {
            if (event.type == "exp" && (event.expID == expID || event.trueExpID == expID)) {
                exp.increment(event.targetID);
            }
        }

        return statMapToBreakdown(exp,
            CharacterAPI.getByIDs,
            (elem: Character, charID: string) => elem.ID == charID,
            defaultCharacterMapper,
            defaultCharacterSortField
        );
    }

    public static experienceSource(ids: string[], targetID: string, events: Event[]): ApiResponse<BreakdownArray> {
        const exp: StatMap = new StatMap();

        for (const event of events) {
            if (event.type == "exp" && event.targetID == targetID && ids.indexOf(event.expID) > -1) {
                exp.increment(event.sourceID);
            }
        }

        if (exp.size() == 0) {
            return ApiResponse.resolve({ code: 204, data: null });
        }

        return statMapToBreakdown(exp,
            CharacterAPI.getByIDs,
            (elem: Character, charID: string) => elem.ID == charID,
            defaultCharacterMapper,
            defaultCharacterSortField
        );
    }

    public static outfitVersusBreakdown(events: Event[]): ApiResponse<OutfitVersusBreakdown[]> {
        const response: ApiResponse<OutfitVersusBreakdown[]> = new ApiResponse();

        const outfitBreakdowns: Map<string, OutfitVersusBreakdown> = new Map();
        const outfitPlayers: Map<string, string[]> = new Map();

       const killCount: number = events.filter(iter => iter.type == "kill").length;
       const deathCount: number = events.filter(iter => iter.type == "death" && iter.revived == false).length;

        const charIDs: string[] = events.filter((iter: Event) => iter.type == "kill" || (iter.type == "death" && iter.revived == false)) 
            .map((iter: Event) => {
                if (iter.type == "kill") {
                    return iter.targetID;
                } else if (iter.type == "death" && iter.revived == false) {
                    return iter.targetID;
                }
                throw `Invalid event type '${iter.type}'`;
            });

        CharacterAPI.getByIDs(charIDs).ok((data: Character[]) => {
            for (const ev of events) {
                if (ev.type == "kill" || ev.type == "death") {
                    const killedChar = data.find(iter => iter.ID == ev.targetID);
                    if (killedChar == undefined) {
                        console.warn(`Missing ${ev.type} targetID ${ev.targetID}`);
                    } else {
                        const outfitID: string = killedChar.outfitID;

                        if (outfitBreakdowns.has(outfitID) == false) {
                            const breakdown: OutfitVersusBreakdown = new OutfitVersusBreakdown();
                            breakdown.tag = killedChar.outfitTag;
                            breakdown.name = killedChar.outfitName || "<No outfit>";
                            breakdown.faction = killedChar.faction;
                            outfitBreakdowns.set(outfitID, breakdown);
                            outfitPlayers.set(outfitID, []);
                        }

                        const breakdown: OutfitVersusBreakdown = outfitBreakdowns.get(outfitID)!;
                        if (ev.type == "kill") {
                            ++breakdown.kills;
                        } else if (ev.type == "death") {
                            if (ev.revived == true) {
                                ++breakdown.revived;
                            } else {
                                ++breakdown.deaths;
                            }
                        }

                        const loadout: PsLoadout | undefined = PsLoadouts.get(ev.loadoutID);
                        const coll: ClassCollection<number> = ev.type == "kill" ? breakdown.classKills
                            : ev.type == "death" && ev.revived == false ? breakdown.classDeaths
                            : breakdown.classRevived;

                        if (loadout != undefined) {
                            if (loadout.type == "infil") {
                                ++coll.infil;
                            } else if (loadout.type == "lightAssault") {
                                ++coll.lightAssault;
                            } else if (loadout.type == "medic") {
                                ++coll.medic;
                            } else if (loadout.type == "engineer") {
                                ++coll.engineer;
                            } else if (loadout.type == "heavy") {
                                ++coll.heavy;
                            } else if (loadout.type == "max") {
                                ++coll.max;
                            }
                        }

                        const players: string[] = outfitPlayers.get(outfitID)!;
                        if (players.indexOf(ev.targetID) == -1) {
                            ++breakdown.players;
                            players.push(ev.targetID);
                        }
                    }
                }
            }

            // Only include the outfit if they were > 1% of the kills or deaths
            const breakdowns: OutfitVersusBreakdown[] = Array.from(outfitBreakdowns.values())
                .filter(iter => iter.kills > (killCount / 100) || iter.deaths > (deathCount / 100));

            breakdowns.sort((a, b) => {
                return b.deaths - a.deaths
                    || b.kills - a.kills
                    || b.revived - a.revived
                    || b.tag.localeCompare(a.tag);
            });

            response.resolveOk(breakdowns);
        });

        return response;
    }

    public static kpmBoxplot(players: TrackedPlayer[], tracking: TimeTracking, loadout?: PsLoadoutType): number[] {
        let kpms: number[] = [];

        for (const player of players) {
            if (player.secondsOnline <= 0) { continue; }

            let secondsOnline: number = player.secondsOnline;

            if (loadout != undefined) {
                const playtime: Playtime = IndividualReporter.classUsage({player: player, tracking: tracking, routers: [], events: []});
                if (loadout == "infil") {
                    secondsOnline = playtime.infil.secondsAs;
                } else if (loadout == "lightAssault") {
                    secondsOnline = playtime.lightAssault.secondsAs;
                } else if (loadout == "medic") {
                    secondsOnline = playtime.medic.secondsAs;
                } else if (loadout == "engineer") {
                    secondsOnline = playtime.engineer.secondsAs;
                } else if (loadout == "heavy") {
                    secondsOnline = playtime.heavy.secondsAs;
                } else if (loadout == "max") {
                    secondsOnline = playtime.max.secondsAs;
                }

                if (secondsOnline == 0) {
                    continue;
                }
            }

            let count: number = 0;
            const kills: EventKill[] = player.events.filter(iter => iter.type == "kill") as EventKill[];

            for (const kill of kills) {
                const psloadout = PsLoadouts.get(kill.loadoutID)
                if (loadout == undefined || (psloadout != undefined && psloadout.type == loadout)) {
                    ++count;
                }
            }

            if (count == 0) {
                continue;
            }

            const minutesOnline: number = secondsOnline / 60;
            const kpm = Number.parseFloat((count / minutesOnline).toFixed(2));

            //console.log(`${player.name} got ${count} kills on ${loadout} in ${minutesOnline} minutes (${kpm})`);

            kpms.push(kpm);
        }

        kpms.sort((a, b) => b - a);

        return kpms;
    }

    public static kdBoxplot(players: TrackedPlayer[], tracking: TimeTracking, loadout?: PsLoadoutType): number[] {
        let kds: number[] = [];

        for (const player of players) {
            if (player.secondsOnline <= 0) { continue; }

            let killCount: number = 0;
            const kills: EventKill[] = player.events.filter(iter => iter.type == "kill") as EventKill[];

            for (const kill of kills) {
                const psloadout = PsLoadouts.get(kill.loadoutID)
                if (loadout == undefined || (psloadout != undefined && psloadout.type == loadout)) {
                    ++killCount;
                }
            }

            let deathCount: number = 0;
            const deaths: EventDeath[] = player.events.filter(iter => iter.type == "death" && iter.revived == false) as EventDeath[];

            for (const death of deaths) {
                const psloadout = PsLoadouts.get(death.loadoutID)
                if (loadout == undefined || (psloadout != undefined && psloadout.type == loadout)) {
                    ++deathCount;
                }
            }

            if (killCount == 0 || deathCount == 0) {
                continue;
            }

            //console.log(`${player.name} went ${killCount} / ${deathCount} on ${loadout}`);

            const kd = Number.parseFloat((killCount / deathCount).toFixed(2));
            kds.push(kd);
        }

        kds.sort((a, b) => b - a);

        return kds;
    }

    public static weaponDeathBreakdown(events: Event[]): ApiResponse<BreakdownWeaponType[]> {
        const response: ApiResponse<BreakdownWeaponType[]> = new ApiResponse();

        const weapons: string[] = (events.filter((ev: Event) => ev.type == "death") as EventDeath[])
            .map((ev: EventDeath) => ev.weaponID)
            .filter((ID: string, index: number, arr: string[]) => arr.indexOf(ID) == index);

        let types: BreakdownWeaponType[] = [];

        // <weapon type, <weapon, count>>
        const used: Map<string, Map<string, number>> = new Map();

        const missingWeapons: Set<string> = new Set();

        WeaponAPI.getByIDs(weapons).ok((data: Weapon[]) => {
            const deaths: EventDeath[] = events.filter(ev => ev.type == "death") as EventDeath[];

            for (const death of deaths) {
                const weapon = data.find(iter => iter.ID == death.weaponID);
                if (weapon == undefined) {
                    missingWeapons.add(death.weaponID);
                }
                const typeName = weapon?.type ?? "Other";

                let type = types.find(iter => iter.type == typeName);
                if (type == undefined) {
                    type = {
                        type: typeName,
                        deaths: 0,
                        headshots: 0,
                        revived: 0,
                        unrevived: 0,
                        mostUsed: "",
                        mostUsedDeaths: 0
                    };
                    types.push(type);
                }

                if (weapon != undefined) {
                    if (!used.has(weapon.type)) {
                        used.set(weapon.type, new Map<string, number>());
                    }

                    const set: Map<string, number> = used.get(weapon.type)!;
                    set.set(weapon.name, (set.get(weapon.name) ?? 0) + 1);

                    used.set(weapon.type, set);
                }

                ++type.deaths;
                if (death.revived == false) {
                    ++type.unrevived;
                } else {
                    ++type.revived;
                }

                if (death.isHeadshot == true) {
                    ++type.headshots;
                }
            }

            used.forEach((weapons: Map<string, number>, type: string) => {
                const breakdown: BreakdownWeaponType = types.find(iter => iter.type == type)!;

                weapons.forEach((deaths: number, weapon: string) => {
                    if (deaths > breakdown.mostUsedDeaths) {
                        breakdown.mostUsedDeaths = deaths;
                        breakdown.mostUsed = weapon;
                    }
                });
            });

            types = types.filter((iter: BreakdownWeaponType) => {
                return iter.deaths / deaths.length > 0.0025;
            });

            types.sort((a, b) => {
                return b.deaths - a.deaths
                    || b.headshots - a.headshots
                    || b.type.localeCompare(a.type);
            });

            console.log(`Missing weapons:`, missingWeapons);

            response.resolveOk(types);
        });

        return response;
    }

    public static vehicleKills(events: Event[]): ApiResponse<BreakdownArray> {
        const vehKills: StatMap = new StatMap();

        for (const event of events) {
            if (event.type == "vehicle" && VehicleTypes.tracked.indexOf(event.vehicleID) > -1) {
                vehKills.increment(event.vehicleID);
            }
        }

        return statMapToBreakdown(vehKills,
            VehicleAPI.getAll,
            (elem: Vehicle, ID: string) => elem.ID == ID,
            defaultVehicleMapper
        );
    }

    public static vehicleWeaponKills(events: Event[]): ApiResponse<BreakdownArray> {
        const vehKills: StatMap = new StatMap();

        for (const event of events) {
            if (event.type == "vehicle" && event.weaponID != "0") {
                vehKills.increment(event.weaponID);
            }
        }

        return statMapToBreakdown(vehKills,
            WeaponAPI.getByIDs,
            (elem: Weapon, ID: string) => elem.ID == ID,
            defaultWeaponMapper
        );
    }

    public static weaponKills(events: Event[]): ApiResponse<BreakdownArray> {
        const wepKills: StatMap = new StatMap();

        for (const event of events) {
            if (event.type == "kill") {
                wepKills.increment(event.weaponID);
            }
        }

        return statMapToBreakdown(wepKills,
            WeaponAPI.getByIDs,
            (elem: Weapon, ID: string) => elem.ID == ID,
            defaultWeaponMapper
        );
    }

    public static weaponDeaths(events: Event[], revived: boolean | undefined = undefined): ApiResponse<BreakdownArray> {
        const amounts: StatMap = new StatMap();

        for (const event of events) {
            if (event.type == "death" && (revived == undefined || revived == event.revived)) {
                amounts.increment(event.weaponID);
            }
        }

        return statMapToBreakdown(amounts,
            WeaponAPI.getByIDs,
            (elem: Weapon, ID: string) => elem.ID == ID,
            defaultWeaponMapper
        );
    }

    public static weaponTypeKills(events: Event[]): ApiResponse<BreakdownArray> {
        const amounts: StatMap = new StatMap();
        const response: ApiResponse<BreakdownArray> = new ApiResponse();

        const weaponIDs: string[] = [];
        for (const event of events) {
            if (event.type == "kill") {
                weaponIDs.push(event.weaponID);
            }
        }

        const arr: BreakdownArray = new BreakdownArray();
        WeaponAPI.getByIDs(weaponIDs).ok((data: Weapon[]) => {
            for (const event of events) {
                if (event.type == "kill") {
                    const weapon = data.find(iter => iter.ID == event.weaponID);
                    if (weapon == undefined) {
                        amounts.increment("Unknown");
                    } else {
                        amounts.increment(weapon.type);
                    }
                    ++arr.total;
                }
            }

            amounts.getMap().forEach((count: number, wepType: string) => {
                arr.data.push({
                    display: wepType,
                    amount: count,
                    sortField: wepType,
                    color: undefined
                });
            });

            arr.data.sort((a, b) => {
                const diff: number = b.amount - a.amount;
                if (diff == 0) {
                    return b.display.localeCompare(a.display);
                }
                return diff;
            });
            response.resolveOk(arr);
        });

        return response;
    }

    public static weaponTypeDeaths(events: Event[], revived: boolean | undefined = undefined): ApiResponse<BreakdownArray> {
        const amounts: StatMap = new StatMap();
        const response: ApiResponse<BreakdownArray> = new ApiResponse();

        const weaponIDs: string[] = [];
        for (const event of events) {
            if (event.type == "death" && (revived == undefined || event.revived == revived)) {
                weaponIDs.push(event.weaponID);
            }
        }

        const arr: BreakdownArray = new BreakdownArray();
        WeaponAPI.getByIDs(weaponIDs).ok((data: Weapon[]) => {
            for (const event of events) {
                if (event.type == "death" && (revived == undefined || event.revived == revived)) {
                    const weapon = data.find(iter => iter.ID == event.weaponID);
                    if (weapon == undefined) {
                        amounts.increment("Unknown");
                    } else {
                        amounts.increment(weapon.type);
                    }
                    ++arr.total;
                }
            }

            amounts.getMap().forEach((count: number, wepType: string) => {
                arr.data.push({
                    display: wepType,
                    amount: count,
                    sortField: wepType,
                    color: undefined
                });
            });

            arr.data.sort((a, b) => {
                const diff: number = b.amount - a.amount;
                if (diff == 0) {
                    return b.display.localeCompare(a.display);
                }
                return diff;
            });
            response.resolveOk(arr);
        });

        return response;
    }

    public static factionKills(events: Event[]): ApiResponse<BreakdownArray> {
        const response: ApiResponse<BreakdownArray> = new ApiResponse();

        const arr: BreakdownArray = new BreakdownArray();

        const countKills = function(ev: Event, faction: string) {
            if (ev.type != "kill") {
                return false;
            }
            const loadout = PsLoadouts.get(ev.targetLoadoutID);
            return loadout != undefined && loadout.faction == faction;
        }

        arr.data.push({
            amount: events.filter(iter => countKills(iter, "VS")).length,
            color: "#AE06B3",
            display: "VS",
            sortField: "VS"
        });

        arr.data.push({
            amount: events.filter(iter => countKills(iter, "NC")).length,
            color: "#1A39F9",
            display: "NC",
            sortField: "NC"
        });

        arr.data.push({
            amount: events.filter(iter => countKills(iter, "TR")).length,
            color: "#CE2304",
            display: "TR",
            sortField: "TR"
        });

        arr.data.push({
            amount: events.filter(iter => countKills(iter, "NS")).length,
            color: "#6A6A6A",
            display: "NS",
            sortField: "NS"
        });

        arr.total = events.filter(iter => iter.type == "kill").length;

        response.resolveOk(arr);

        return response;
    }

    public static factionDeaths(events: Event[]): ApiResponse<BreakdownArray> {
        const response: ApiResponse<BreakdownArray> = new ApiResponse();

        const countDeaths = function(ev: Event, faction: string) {
            if (ev.type != "death") {
                return false;
            }
            const loadout = PsLoadouts.get(ev.targetLoadoutID);
            return loadout != undefined && loadout.faction == faction;
        }

        const arr: BreakdownArray = new BreakdownArray();
        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "VS")).length,
            color: "#AE06B3",
            display: "VS",
            sortField: "VS"
        });

        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "NC")).length,
            color: "#1A39F9",
            display: "NC",
            sortField: "NC"
        });

        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "TR")).length,
            color: "#CE2304",
            display: "TR",
            sortField: "TR"
        });

        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "NS")).length,
            color: "#6A6A6A",
            display: "NS",
            sortField: "NS"
        });

        arr.total = events.filter(iter => iter.type == "death").length;

        response.resolveOk(arr);

        return response;
    }

    public static continentKills(events: Event[]): ApiResponse<BreakdownArray> {
        const response: ApiResponse<BreakdownArray> = new ApiResponse();

        const countKills = function(ev: Event, zoneID: string) {
            return ev.type == "kill" && ev.zoneID == zoneID;
        }

        const arr: BreakdownArray = new BreakdownArray();
        arr.data.push({
            amount: events.filter(iter => countKills(iter, "2")).length,
            color: "#F4E11D",
            display: "Indar",
            sortField: "Indar"
        });

        arr.data.push({
            amount: events.filter(iter => countKills(iter, "4")).length,
            color: "#09B118",
            display: "Hossin",
            sortField: "Hossin"
        });

        arr.data.push({
            amount: events.filter(iter => countKills(iter, "6")).length,
            color: "#2DE53E",
            display: "Amerish",
            sortField: "Amerish"
        });

        arr.data.push({
            amount: events.filter(iter => countKills(iter, "8")).length,
            color: "#D8E9EC",
            display: "Esamir",
            sortField: "Esamir"
        });

        arr.total = events.filter(iter => iter.type == "kill").length;

        response.resolveOk(arr);

        return response;
    }

    public static continentDeaths(events: Event[]): ApiResponse<BreakdownArray> {
        const response: ApiResponse<BreakdownArray> = new ApiResponse();

        const countDeaths = function(ev: Event, zoneID: string) {
            return ev.type == "death" && ev.zoneID == zoneID;
        }

        const arr: BreakdownArray = new BreakdownArray();
        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "2")).length,
            color: "#F4E11D",
            display: "Indar",
            sortField: "Indar"
        });

        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "4")).length,
            color: "#09B118",
            display: "Hossin",
            sortField: "Hossin"
        });

        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "6")).length,
            color: "#2DE53E",
            display: "Amerish",
            sortField: "Amerish"
        });

        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "8")).length,
            color: "#D8E9EC",
            display: "Esamir",
            sortField: "Esamir"
        });

        arr.total = events.filter(iter => iter.type == "death").length;

        response.resolveOk(arr);

        return response;
    }

    public static characterKills(events: Event[]): ApiResponse<BreakdownArray> {
        const amounts: StatMap = new StatMap();

        for (const event of events) {
            if (event.type == "kill") {
                amounts.increment(event.targetID);
            }
        }

        return statMapToBreakdown(amounts,
            CharacterAPI.getByIDs,
            (elem: Character, ID: string) => elem.ID == ID,
            defaultCharacterMapper
        );
    }

    public static characterDeaths(events: Event[]): ApiResponse<BreakdownArray> {
        const amounts: StatMap = new StatMap();

        for (const event of events) {
            if (event.type == "death" && event.revived == false) {
                amounts.increment(event.targetID);
            }
        }

        return statMapToBreakdown(amounts,
            CharacterAPI.getByIDs,
            (elem: Character, ID: string) => elem.ID == ID,
            defaultCharacterMapper
        );
    }

    public static kpmOverTime(events: Event[]): BreakdownTimeslot[] { 
        const kills: EventKill[] = events.filter(iter => iter.type == "kill")
            .sort((a, b) => a.timestamp - b.timestamp) as EventKill[];

        const players: Set<string> = new Set();

        if (kills.length == 0) {
            return [];
        }

        const slots: BreakdownTimeslot[] = [];

        const diff = 1000 * 60 * 5; // 1000 ms * 60 sec/min * 5 mins
        const stop = kills[kills.length - 1].timestamp;
        let start = events[0].timestamp;
        let count = 0;

        while (true) {
            const end = start + diff;
            const section: EventKill[] = kills.filter(iter => iter.timestamp >= start && iter.timestamp < end);

            for (const ev of section) {
                players.add(ev.sourceID);
                ++count;
            }

            slots.push({
                startTime: start,
                endTime: end,
                value: Number.parseFloat((count / (players.size || 1) / 5).toFixed(2))
            });

            count = 0;
            players.clear();
            start += diff;

            if (start > stop) {
                break;
            }
        }

        return slots;
    }

    public static kdOverTime(events: Event[]): BreakdownTimeslot[] {
        const evs: Event[] = events.filter(iter => iter.type == "kill" || (iter.type == "death" && iter.revived == false));

        if (evs.length == 0) {
            return [];
        }

        const slots: BreakdownTimeslot[] = [];

        const diff = 1000 * 60 * 5; // 1000 ms * 60 sec/min * 5 mins
        const stop = evs[evs.length - 1].timestamp;
        let start = events[0].timestamp;

        while (true) {
            const end = start + diff;
            const section: Event[] = evs.filter(iter => iter.timestamp >= start && iter.timestamp < end);

            const kills: EventKill[] = section.filter(iter => iter.type == "kill") as EventKill[];
            const deaths: EventDeath[] = section.filter(iter => iter.type == "death" && iter.revived == false) as EventDeath[];

            slots.push({
                startTime: start,
                endTime: end,
                value: Number.parseFloat((kills.length / (deaths.length || 1)).toFixed(2))
            });

            start += diff;

            if (start > stop) {
                break;
            }
        }

        return slots;
    }

    public static kdPerUpdate(allEvents: Event[]): BreakdownTimeslot[] {
        const events: Event[] = allEvents.filter(iter => iter.type == "kill" || (iter.type == "death" && iter.revived == false));

        if (events.length == 0) {
            return [];
        }

        let kills: number = 0;
        let deaths: number = 0;

        const slots: BreakdownTimeslot[] = [];

        for (let i = events[0].timestamp; i < events[events.length - 1].timestamp; i += 1000) {
            const evs = events.filter(iter => iter.timestamp == i);
            if (evs.length == 0) {
                continue;
            }

            for (const ev of evs) {
                if (ev.type == "kill") {
                    ++kills;
                } else if (ev.type == "death") {
                    ++deaths;
                }
            }

            slots.push({
                value: Number.parseFloat((kills / (deaths || 1)).toFixed(2)),
                startTime: i,
                endTime: i
            });
        }

        return slots;
    }

    public static revivesOverTime(events: Event[]): BreakdownTimeslot[] {
        const revives: Event[] = events.filter(iter => iter.type == "exp" && (iter.expID == PsEvent.revive || iter.expID == PsEvent.squadRevive));

        if (revives.length == 0) {
            return [];
        }

        const slots: BreakdownTimeslot[] = [];

        const diff = 1000 * 60 * 5; // 1000 ms * 60 sec/min * 5 mins
        const stop = revives[revives.length - 1].timestamp;
        let start = events[0].timestamp;

        while (true) {
            const end = start + diff;
            const section: Event[] = revives.filter(iter => iter.timestamp >= start && iter.timestamp < end);

            const players: number = section.map(iter => iter.sourceID)
                .filter((value: string, index: number, arr: string[]) => arr.indexOf(value) == index).length;

            slots.push({
                startTime: start,
                endTime: end,
                value: Number.parseFloat((section.length / (players || 1) / 5).toFixed(2))
            });

            start += diff;

            if (start > stop) {
                break;
            }
        }

        return slots;
    }

}
(window as any).EventReporter = EventReporter;