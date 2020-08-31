import { ApiResponse } from "census/ApiWrapper";
import { Loading, Loadable } from "Loadable";

import CensusAPI from "census/CensusAPI";
import OutfitAPI, { Outfit } from "census/OutfitAPI";
import { CharacterAPI, Character } from "census/CharacterAPI";
import { Weapon, WeaponAPI } from "census/WeaponAPI";
import { EventAPI } from "census/EventAPI";
import { Achievement, AchievementAPI } from "census/AchievementAPI";
import { FacilityAPI, Facility } from "census/FacilityAPI";

import { PsLoadout, PsLoadouts } from "census/PsLoadout";
import { PsEventType, PsEvent, PsEvents } from "PsEvent";
import { Event, EventExp, EventKill, EventDeath, EventVehicleKill, EventCapture, EventTeamkill, EventDefend } from "Event";
import StatMap from "StatMap";

import {
    TEvent, TEventType,
    TExpEvent, TKillEvent, TDeathEvent, TTeamkillEvent,
    TCaptureEvent, TDefendEvent,
    TVehicleKillEvent,
    TEventHandler
} from "events/index";

import EventReporter, { statMapToBreakdown,
    Breakdown, BreakdownArray,
    OutfitVersusBreakdown, ClassCollection, classCollectionNumber,
    BreakdownTimeslot, BreakdownTrend, BreakdownWeaponType, BaseCapture, BaseCaptureOutfit
} from "EventReporter";
import {
    ExpBreakdown, FacilityCapture, ClassBreakdown, IndividualReporter,
    CountedRibbon, Report, TimeTracking, BreakdownCollection, BreakdownSection, BreakdownMeta,
    TrackedRouter, ClassUsage, ClassKdCollection, classKdCollection,
    ReportParameters, BreakdownSingle, BreakdownSingleCollection, BreakdownSpawn, PlayerVersus,
    ClassCollectionBreakdownTrend, classCollectionBreakdownTrend, Playtime, PlayerVersusEntry
} from "InvididualGenerator";

import { TrackedPlayer } from "core/TrackedPlayer";

export class OutfitReportSettings {

    /**
     * ID of the zone to limit events to. Leaven null for all zones
     */
    public zoneID: string | null = null;

}

export class OutfitReportParameters {

    public settings: OutfitReportSettings = new OutfitReportSettings();

    public captures: FacilityCapture[] = [];

    public playerCaptures: (TCaptureEvent | TDefendEvent)[] = [];

    public events: TEvent[] = [];

    public players: Map<string, TrackedPlayer> = new Map();

    public outfits: string[] = [];

    public tracking: TimeTracking = new TimeTracking()

}

export class OutfitReport {
    stats: Map<string, number> = new Map();
    score: number = 0;
    players: ({ name: string } & Playtime)[] = [];
    events: TEvent[] = [];
    tracking: TimeTracking = {
        startTime: 0,
        endTime: 0,
        running: false
    };

    facilityCaptures: FacilityCapture[] = [];

    classStats: Map<string, ClassCollection<number>> = new Map();

    scoreBreakdown: ExpBreakdown[] = [];

    /**
     * Collection of stats per 5 minute blocks
     */
    overtimePer5 = {
        kpm: [] as BreakdownTimeslot[],
        kd: [] as BreakdownTimeslot[],
        rpm: [] as BreakdownTimeslot[],
    };

    /**
     * Collection of stats per 1 minute blocks
     */
    overtimePer1 = {
        kpm: [] as BreakdownTimeslot[],
        kd: [] as BreakdownTimeslot[],
        rpm: [] as BreakdownTimeslot[],
    };

    /**
     * Collection of stats updated everytime a relevant event is performed
     */
    perUpdate = {
        kpm: [] as BreakdownTimeslot[],
        kd: [] as BreakdownTimeslot[],
        rpm: [] as BreakdownTimeslot[]
    };

    /**
     * Numbers used to create the boxplot of KPMs
     */
    kpmBoxPlot = {
        total: [] as number[],
        infil: [] as number[],
        lightAssault: [] as number[],
        medic: [] as number[],
        engineer: [] as number[],
        heavy: [] as number[],
        max: [] as number[]
    };

    /**
     * Numbers used to create the boxplot of KDs
     */
    kdBoxPlot = {
        total: [] as number[],
        infil: [] as number[],
        lightAssault: [] as number[],
        medic: [] as number[],
        engineer: [] as number[],
        heavy: [] as number[],
        max: [] as number[]
    }

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
    kmLifeExpectance: number[] = [];
    kmTimeDead: number[] = [];

    factionKillBreakdown: BreakdownArray = new BreakdownArray();
    factionDeathBreakdown: BreakdownArray = new BreakdownArray();

    continentKillBreakdown: BreakdownArray = new BreakdownArray();
    continentDeathBreakdown: BreakdownArray = new BreakdownArray();

    baseCaptures: BaseCapture[] = [];

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

export class OutfitReportGenerator {

    public static generate(parameters: OutfitReportParameters): ApiResponse<OutfitReport> {
        const response: ApiResponse<OutfitReport> = new ApiResponse();

        const report: OutfitReport = new OutfitReport();
        report.tracking = parameters.tracking;

        let filterZoneID: boolean = parameters.settings.zoneID != null;

        report.facilityCaptures = parameters.captures.filter((iter: FacilityCapture) => {
            return (filterZoneID == false || (filterZoneID == true && iter.zoneID == parameters.settings.zoneID))
                && parameters.outfits.indexOf(iter.outfitID) > -1;
        });

        report.facilityCaptures.sort((a, b) => {
            return a.timestamp.getTime() - b.timestamp.getTime();
        });

        let opsLeft: number =
            + 1 // Facility captures
            + 1 // Weapon kills
            + 1 // Weapon type kills
            + 1 // Faction kills
            + 1 // Faction deaths
            + 1 // Cont kills
            + 1 // Cont deaths
            + 1 // All weapon deaths
            + 1 // Unrevived weapon deaths
            + 1 // Revived weapon deaths
            + 1 // All weapon type deaths
            + 1 // Unrevived weapon type deaths
            + 1 // Revived weapon type deaths
            + 1 // Weapon death breakdown
            + 6 // Weapon kill types for all classes
            + 6 // Weapon death types for all classes
            + 1 // Outfit VS KD
            + 1 // Vehicle kills
            + 1 // Vehicle weapon kills

        const totalOps: number = opsLeft;

        const callback = (step: string) => {
            return () => {
                console.log(`Finished ${step}: Have ${opsLeft - 1} ops left outta ${totalOps}`);
                if (--opsLeft == 0) {
                    response.resolveOk(report);
                }
            }
        }

        EventReporter.facilityCaptures({
            captures: report.facilityCaptures,
            players: parameters.playerCaptures
        }).ok(data => report.baseCaptures = data).always(callback("Facility captuers"));

        const chars: TrackedPlayer[] = Array.from(parameters.players.values());

        report.kpmBoxPlot = {
            total: EventReporter.kpmBoxplot(chars, parameters.tracking),
            infil: EventReporter.kpmBoxplot(chars, parameters.tracking, "infil"),
            lightAssault: EventReporter.kpmBoxplot(chars, parameters.tracking, "lightAssault"),
            medic: EventReporter.kpmBoxplot(chars, parameters.tracking, "medic"),
            engineer: EventReporter.kpmBoxplot(chars, parameters.tracking, "engineer"),
            heavy: EventReporter.kpmBoxplot(chars, parameters.tracking, "heavy"),
            max: EventReporter.kpmBoxplot(chars, parameters.tracking, "max"),
        }

        report.kdBoxPlot = {
            total: EventReporter.kdBoxplot(chars, parameters.tracking),
            infil: EventReporter.kdBoxplot(chars, parameters.tracking, "infil"),
            lightAssault: EventReporter.kdBoxplot(chars, parameters.tracking, "lightAssault"),
            medic: EventReporter.kdBoxplot(chars, parameters.tracking, "medic"),
            engineer: EventReporter.kdBoxplot(chars, parameters.tracking, "engineer"),
            heavy: EventReporter.kdBoxplot(chars, parameters.tracking, "heavy"),
            max: EventReporter.kdBoxplot(chars, parameters.tracking, "max")
        }

        parameters.players.forEach((player: TrackedPlayer, charID: string) => {
            player.stats.getMap().forEach((amount: number, expID: string) => {
                const event: PsEvent | undefined = PsEvents.get(expID);
                if (event == undefined) { return; }

                const reportAmount: number = report.stats.get(event.name) ?? 0;
                report.stats.set(event.name, reportAmount + amount);
            });
        });

        parameters.players.forEach((player: TrackedPlayer, charID: string) => {
            if (player.events.length == 0) { return; }

            report.score += player.score;
            report.events.push(...player.events);

            const playtime = IndividualReporter.classUsage({
                player: player,
                events: [],
                routers: [],
                tracking: parameters.tracking
            });

            report.players.push({
                name: `${(player.outfitTag != '' ? `[${player.outfitTag}] ` : '')}${player.name}`,
                ...playtime 
            });
        });

        report.events = report.events.sort((a, b) => a.timestamp - b.timestamp);

        // Track how many headshots each class got
        const headshots: ClassCollection<number> = classCollectionNumber();
        for (const ev of report.events) {
            if (ev.type != "kill" || ev.isHeadshot == false) {
                continue;
            }

            const loadout: PsLoadout | undefined = PsLoadouts.get(ev.loadoutID);
            if (loadout == undefined) { continue; }

            if (loadout.type == "infil") { ++headshots.infil; }
            else if (loadout.type == "lightAssault") { ++headshots.lightAssault; }
            else if (loadout.type == "medic") { ++headshots.medic; }
            else if (loadout.type == "engineer") { ++headshots.engineer; }
            else if (loadout.type == "heavy") { ++headshots.heavy; }
            else if (loadout.type == "max") { ++headshots.max; }

            ++headshots.total;
        }
        report.classStats.set("Headshot", headshots);

        for (const ev of report.events) {
            let statName: string = "Other";

            if (ev.type == "kill") {
                statName = "Kill";
            } else if (ev.type == "death") {
                statName = (ev.revived == true) ? "Revived" : "Death";
            } else if (ev.type == "exp") {
                const event: PsEvent | undefined = PsEvents.get(ev.expID);
                if (event != undefined) {
                    if (event.track == false) { continue; }
                    statName = event.name;
                }
            } else {
                continue;
            }

            if (!report.classStats.has(statName)) {
                //console.log(`Added stats for '${statName}'`);
                report.classStats.set(statName, classCollectionNumber());
            }

            const classCollection: ClassCollection<number> = report.classStats.get(statName)!;
            ++classCollection.total;

            const loadout: PsLoadout | undefined = PsLoadouts.get(ev.loadoutID);
            if (loadout == undefined) { continue; }

            if (loadout.type == "infil") { ++classCollection.infil; }
            else if (loadout.type == "lightAssault") { ++classCollection.lightAssault; }
            else if (loadout.type == "medic") { ++classCollection.medic; }
            else if (loadout.type == "engineer") { ++classCollection.engineer; } 
            else if (loadout.type == "heavy") { ++classCollection.heavy; } 
            else if (loadout.type == "max") { ++classCollection.max; }
        }

        EventReporter.weaponKills(report.events).ok(data => report.weaponKillBreakdown = data).always(callback("Weapon kills"));
        EventReporter.weaponTypeKills(report.events).ok(data => report.weaponTypeKillBreakdown = data).always(callback("Weapon type kills"));

        EventReporter.factionKills(report.events).ok(data => report.factionKillBreakdown = data).always(callback("Faction kills"));
        EventReporter.factionDeaths(report.events).ok(data => report.factionDeathBreakdown = data).always(callback("Faction deaths"));

        EventReporter.continentKills(report.events).ok(data => report.continentKillBreakdown = data).always(callback("Cont kills"));
        EventReporter.continentDeaths(report.events).ok(data => report.continentDeathBreakdown = data).always(callback("Cont deaths"));

        EventReporter.weaponDeaths(report.events).ok(data => report.deathAllBreakdown = data).always(callback("All weapon deaths"));
        EventReporter.weaponDeaths(report.events, true).ok(data => report.deathRevivedBreakdown = data).always(callback("Revived weapon deaths"));
        EventReporter.weaponDeaths(report.events, false).ok(data => report.deathKilledBreakdown = data).always(callback("Unrevived weapon deaths"));
        EventReporter.weaponTypeDeaths(report.events).ok(data => report.deathAllTypeBreakdown = data).always(callback("All weapon type deaths"));
        EventReporter.weaponTypeDeaths(report.events, true).ok(data => report.deathRevivedTypeBreakdown = data).always(callback("Revived weapon type deaths"));
        EventReporter.weaponTypeDeaths(report.events, false).ok(data => report.deathKilledTypeBreakdown = data).always(callback("Unrevived weapon type deaths"));

        EventReporter.weaponDeathBreakdown(report.events).ok(data => report.weaponTypeDeathBreakdown = data).always(callback("Weapon death breakdown"));

        /* Not super useful and take a long time to generate
        report.timeUnrevived = IndividualReporter.unrevivedTime(report.events);
        report.revivedLifeExpectance = IndividualReporter.reviveLifeExpectance(report.events);
        report.kmLifeExpectance = IndividualReporter.lifeExpectanceRate(report.events);
        report.kmTimeDead = IndividualReporter.timeUntilReviveRate(report.events);
        */

        const classFilter: (iter: TEvent, type: "kill" | "death", loadouts: string[]) => boolean = (iter, type, loadouts) => {
            if (iter.type == type) {
                return loadouts.indexOf(iter.loadoutID) > -1;
            }
            return false;
        };

        EventReporter.weaponTypeKills(report.events.filter(iter => classFilter(iter, "kill", ["1", "8", "15"])))
            .ok(data => report.classTypeKills.infil = data).always(callback("Weapon type kills: Infil"));
        EventReporter.weaponTypeKills(report.events.filter(iter => classFilter(iter, "kill", ["3", "10", "17"])))
            .ok(data => report.classTypeKills.lightAssault = data).always(callback("Weapon type kills: LA"));
        EventReporter.weaponTypeKills(report.events.filter(iter => classFilter(iter, "kill", ["4", "11", "18"])))
            .ok(data => report.classTypeKills.medic = data).always(callback("Weapon type kills: Medic"));
        EventReporter.weaponTypeKills(report.events.filter(iter => classFilter(iter, "kill", ["5", "12", "19"])))
            .ok(data => report.classTypeKills.engineer = data).always(callback("Weapon type kills: Eng"));
        EventReporter.weaponTypeKills(report.events.filter(iter => classFilter(iter, "kill", ["6", "13", "20"])))
            .ok(data => report.classTypeKills.heavy = data).always(callback("Weapon type kills: Heavy"));
        EventReporter.weaponTypeKills(report.events.filter(iter => classFilter(iter, "kill", ["7", "14", "21"])))
            .ok(data => report.classTypeKills.max = data).always(callback("Weapon type kills: MAX"));

        EventReporter.weaponTypeDeaths(report.events.filter(iter => classFilter(iter, "death", ["1", "8", "15"])))
            .ok(data => report.classTypeDeaths.infil = data).always(callback("Weapon type deaths: Infil"));
        EventReporter.weaponTypeDeaths(report.events.filter(iter => classFilter(iter, "death", ["3", "10", "17"])))
            .ok(data => report.classTypeDeaths.lightAssault = data).always(callback("Weapon type deaths: LA"));
        EventReporter.weaponTypeDeaths(report.events.filter(iter => classFilter(iter, "death", ["4", "11", "18"])))
            .ok(data => report.classTypeDeaths.medic = data).always(callback("Weapon type deaths: Medic"));
        EventReporter.weaponTypeDeaths(report.events.filter(iter => classFilter(iter, "death", ["5", "12", "19"])))
            .ok(data => report.classTypeDeaths.engineer = data).always(callback("Weapon type deaths: Eng"));
        EventReporter.weaponTypeDeaths(report.events.filter(iter => classFilter(iter, "death", ["6", "13", "20"])))
            .ok(data => report.classTypeDeaths.heavy = data).always(callback("Weapon type deaths: Heavy"));
        EventReporter.weaponTypeDeaths(report.events.filter(iter => classFilter(iter, "death", ["7", "14", "21"])))
            .ok(data => report.classTypeDeaths.max = data).always(callback("Weapon type deaths: MAX"));

        report.classKds.infil = IndividualReporter.classVersusKd(report.events, "infil");
        report.classKds.lightAssault = IndividualReporter.classVersusKd(report.events, "lightAssault");
        report.classKds.medic = IndividualReporter.classVersusKd(report.events, "medic");
        report.classKds.engineer = IndividualReporter.classVersusKd(report.events, "engineer");
        report.classKds.heavy = IndividualReporter.classVersusKd(report.events, "heavy");
        report.classKds.max = IndividualReporter.classVersusKd(report.events, "max");
        report.classKds.total = IndividualReporter.classVersusKd(report.events);

        EventReporter.outfitVersusBreakdown(report.events).ok(data => report.outfitVersusBreakdown = data).always(callback("Outfit VS KD"));

        EventReporter.vehicleKills(report.events).ok(data => report.vehicleKillBreakdown = data).always(callback("Vehicle type kills"));
        EventReporter.vehicleWeaponKills(report.events).ok(data => report.vehicleKillWeaponBreakdown = data).always(callback("Vehicle weapon kills"));

        let otherIDs: string[] = [];
        const breakdown: Map<string, ExpBreakdown> = new Map<string, ExpBreakdown>();
        for (const event of report.events) {
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
                    otherIDs.push(event.expID);
                }
            }
        }
        console.log(`Untracked experience IDs: ${otherIDs.filter((v, i, a) => a.indexOf(v) == i).join(", ")}`);

        // Sort all the entries by score, followed by amount, then lastly name
        report.scoreBreakdown = [...breakdown.entries()].sort((a, b) => {
            return (b[1].score - a[1].score)
                || (b[1].amount - a[1].amount)
                || (b[0].localeCompare(a[0]))
        }).map((a) => a[1]); // Transform the tuple into the ExpBreakdown

        report.overtimePer1.kpm = EventReporter.kpmOverTime(report.events, 60000);
        report.overtimePer1.kd = EventReporter.kdOverTime(report.events, 60000);
        report.overtimePer1.rpm = EventReporter.revivesOverTime(report.events, 60000);

        report.overtimePer5.kpm = EventReporter.kpmOverTime(report.events);
        report.overtimePer5.kd = EventReporter.kdOverTime(report.events);
        report.overtimePer5.rpm = EventReporter.revivesOverTime(report.events);

        report.perUpdate.kd = EventReporter.kdPerUpdate(report.events);

        return response;
    }

}
