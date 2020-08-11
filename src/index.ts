import "popper.js"
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";

import Vue, { PropType } from "vue";

import { ApiResponse } from "census/ApiWrapper";
import { Loading, Loadable } from "Loadable";

import * as moment from "moment";
import * as $ from "jquery";
import * as JSZip from "jszip";

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
    TEvent, TEventType, TLoadoutEvent, TZoneEvent,
    TExpEvent, TKillEvent, TDeathEvent, TTeamkillEvent,
    TCaptureEvent, TDefendEvent,
    TVehicleKillEvent,
    TEventHandler
} from "events/index";

import EventReporter, { statMapToBreakdown,
    Breakdown, BreakdownArray,
    OutfitVersusBreakdown, ClassCollection, classCollectionNumber
} from "EventReporter";
import {
    ExpBreakdown, FacilityCapture, ClassBreakdown, IndividualReporter, OutfitReport,
    CountedRibbon, Report, TimeTracking, BreakdownCollection, BreakdownSection, BreakdownMeta,
    TrackedRouter,
    ReportParameters
} from "InvididualGenerator";

import { PersonalReportGenerator } from "PersonalReportGenerator";

// @ts-ignore
import * as FileSaver from "../node_modules/file-saver/dist/FileSaver.js";

// @ts-ignore
import ChartDataLabels from "../node_modules/chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.js";
Chart.plugins.unregister(ChartDataLabels);

import { Chart } from "chart.js";

// @ts-ignore
import "../node_modules/chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js";

import "BreakdownList";
import "BreakdownChart";
import "BreakdownInterval";
import "BreakdownBox";
import "BreakdownBar";
import "MomentFilter";
import "KillfeedSquad";

import { OutfitTrendsV1, OutfitTrends, SessionV1 } from "OutfitTrends";
import { StorageHelper, StorageSession, StorageTrend } from "Storage";
import { KillfeedGeneration, KillfeedEntry, KillfeedOptions, Killfeed } from "Killfeed";

import { WinterReportGenerator } from "winter/WinterReportGenerator";
import { WinterReport } from "winter/WinterReport";
import { WinterReportParameters, WinterReportSettings } from "winter/WinterReportParameters";

import Core from "core/index";
import { TrackedPlayer } from "core/TrackedPlayer";

class OpReportSettings {
    public zoneID: string | null = null;
}

(window as any).$ = $;

export const vm = new Vue({
    el: "#app" as string,

    data: {
        coreObject: null as (Core | null),

        view: "setup" as "setup" | "realtime" | "ops" | "killfeed" | "winter",

        // Field related to settings about how TOPT runs
        settings: {
            serviceToken: "" as string,
            updateRate: 1 as number,
            eventType: "general" as PsEventType,
            sortColumn: "name" as string,

            serverID: "1" as string,

            darkMode: false as boolean
        },

        // Field related to filtering or adding data
        parameters: {
            outfitTag: "" as string,
            playerName: "" as string,

            report: "" as string,

            importing: false as boolean,

            outfitRequest: Loadable.loaded("") as Loading<string>,
        },

        storage: {
            enabled: false as boolean,

            trends: [] as StorageTrend[],
            pendingTrend: null as string | null,
            newTrendFile: "" as string,

            trendFileName: "" as string
        },

        generation: {
            names: [] as string[],
            state: [] as string[]
        },

        killfeed: {
            entry: new Killfeed() as Killfeed,
            options: new KillfeedOptions() as KillfeedOptions
        },

        // Used to make iteration thru classes easier
        classIterator: [
            { title: "Infiltrator", name: "infil" },
            { title: "Light Assault", name: "lightAssault" },
            { title: "Medic", name: "medic" },
            { title: "Engineer", name: "engineer" },
            { title: "Heavy", name: "heavy" },
            { title: "Max", name: "max" },
        ],

        winter: {
            report: Loadable.idle() as Loading<WinterReport>,
            settings: new WinterReportSettings() as WinterReportSettings,
        },

        outfitReport: new OutfitReport() as OutfitReport,
        opsReportSettings: new OpReportSettings() as OpReportSettings,

        outfitTrends: new OutfitTrendsV1() as OutfitTrends,

        refreshIntervalID: -1 as number, // ID of the timed interval to refresh the realtime view

        showFrog: false as boolean,

        display: [] as TrackedPlayer[] // The currently displayed stats
    },

    created: function(): void {
        this.refreshIntervalID = setInterval(this.updateDisplay, this.settings.updateRate * 1000) as unknown as number;

        this.storage.enabled = StorageHelper.isEnabled();

        WeaponAPI.loadJson();
        FacilityAPI.loadJson();
    },

    mounted: function(): void {
        if (this.storage.enabled == true) {
            this.storage.trends = StorageHelper.getTrends();
        }

        window.onbeforeunload = (ev: BeforeUnloadEvent) => {
            this.core.disconnect();
        };

        document.addEventListener("keyup", this.squadKeyEvent);
    },

    methods: {
        connect: function(): void {
            if (this.canConnect == false) {
                return console.warn(`Cannot connect: service ID is empty`);
            }

            if (this.coreObject != null) {
                this.coreObject.disconnect();
            }

            this.coreObject = new Core(this.settings.serviceToken);
            this.coreObject.connect().ok(() => {
                this.view = "realtime";
            });

            if (this.storage.pendingTrend !== null && this.storage.pendingTrend !== undefined) {
                console.log(`Loading trends from storage: ${this.storage.pendingTrend}`);

                const trend: OutfitTrendsV1 | null = StorageHelper.getTrend(this.storage.pendingTrend);
                if (trend != null) {
                    console.log(`Successfully loaded trends file for ${this.storage.pendingTrend}`);
                    this.outfitTrends = {...trend};

                    this.storage.trendFileName = this.storage.pendingTrend;
                } else {
                    throw `Failed to load trends file for ${this.storage.pendingTrend}`;
                }
            } else if (this.storage.pendingTrend === null) {
                StorageHelper.setTrends(this.storage.newTrendFile, new OutfitTrendsV1());
                this.storage.trendFileName = this.storage.newTrendFile;

                this.outfitTrends = new OutfitTrendsV1();

                console.log(`Created new trends file named ${this.storage.trendFileName}`);
            } else if (this.storage.pendingTrend === undefined) {
                this.storage.enabled = false;
            } else {
                throw `Messed up logic: storage.pendingTrends is null or undefined, and not null, and not undefined`;
            }
        },

        importData: function(): void {
            const elem: HTMLElement | null = document.getElementById("data-import-input");
            if (elem == null) {
                throw ``;
            }

            const input: HTMLInputElement = elem as HTMLInputElement;
            if (input.files == null) {
                throw `Input is not type of 'file'`;
            }

            if (input.files.length == 0) {
                return console.warn(`Cannot import data, no file selected`);
            }

            const file: File = input.files[0];

            const reader: FileReader = new FileReader();

            reader.onload = ((ev: ProgressEvent<FileReader>) => {
                const data: any = JSON.parse(reader.result as string);

                if (!data.version) {
                    console.error(`Missing version from import`);
                } else if (data.version == "1") {
                    const nowMs: number = new Date().getTime();

                    console.log(`Exported data uses version 1`);
                    const chars: Character[] = data.players;
                    const outfits: string[] = data.outfits;
                    const events: any[] = data.events;

                    this.core.subscribeToEvents(chars);

                    this.core.outfits = outfits;

                    if (events != undefined && events.length != 0) {
                        const parsedData = events.map(iter => JSON.parse(iter));
                        this.core.tracking.startTime = Math.min(...parsedData.map(iter => (Number.parseInt(iter.payload.timestamp) * 1000) || 0));
                        this.core.tracking.endTime = Math.max(...parsedData.map(iter => (Number.parseInt(iter.payload.timestamp) * 1000) || 0));

                        for (const ev of events) {
                            this.core.processMessage(ev, true);
                        }

                        this.setSaveEvents(false);
                    }

                    console.log(`Took ${new Date().getTime() - nowMs}ms to import data`);
                } else {
                    console.error(`Unchecked version: ${data.version}`);
                }
            });

            reader.readAsText(file);
        },

        importOutfitTrends: function(): void {
            const elem: HTMLElement | null = document.getElementById("data-import-outfit-trends");
            if (elem == null) {
                throw `Missing <input> #data-import-outfit-trends`;
            }

            const input: HTMLInputElement = elem as HTMLInputElement;
            if (input.files == null) {
                throw `Input is not type of 'file'`;
            }

            if (input.files.length == 0) {
                return console.warn(`Cannot import trends, no file selected`);
            }

            const file: File = input.files[0];

            const reader: FileReader = new FileReader();

            reader.onload = ((ev: ProgressEvent<FileReader>) => {
                const data: any = JSON.parse(reader.result as string);

                if (!data.version) {
                    console.error(`Missing version from import`);
                } else if (data.version == "1") {
                    console.log(`Reading version 1 of trends file`);
                    this.outfitTrends = {
                        ...data,
                        sessions: data.sessions.map((iter: SessionV1) => {
                            return {
                                kds: iter.kds,
                                kpms: iter.kpms,
                                timestamp: new Date(iter.timestamp)
                            }
                        })
                    };

                } else {
                    console.error(`Unchecked version: ${data.version}`);
                }
            });

            reader.readAsText(file);
        },

        exportData: function(): void {
            const json: object = {
                version: "1" as string,
                events: this.core.rawData,
                players: this.core.characters,
                outfits: this.core.outfits
            };

            const file = new File([JSON.stringify(json)], "data.json", { type: "text/json" });

            FileSaver.saveAs(file);
        },

        exportTrends: function(): void {
            const file = new File([JSON.stringify(this.outfitTrends)], "trends.json", { type: "text/json"});

            FileSaver.saveAs(file);
        },

        saveTrends: function(): void {
            const name: string | null = prompt("What to name this trends file as? Leave blank to cancel");
            
            if (name == null || name.length == 0) {
                return;
            }

            StorageHelper.setTrends(name, this.outfitTrends);
        },

        updateDisplay: function(): void {
            //console.time("update display");

            if (this.view == "realtime") {
                this.updateRealtimeDisplay();
            } else if (this.view == "killfeed") {
                this.updateKillfeedDisplay();
            }
        },

        updateKillfeedDisplay: function(): void {
            this.killfeed.entry = KillfeedGeneration.generate(this.killfeed.options);
        },

        updateRealtimeDisplay: function(): void {
            const nowMs: number = new Date().getTime();

            this.display = [];
            this.core.stats.forEach((char: TrackedPlayer, charID: string) => {
                if (char.stats.size() == 0) { return; }

                const collection: TrackedPlayer = new TrackedPlayer();
                collection.name = char.name;
                collection.outfitTag = char.outfitTag;
                collection.characterID = char.characterID;
                collection.online = char.online;
                collection.secondsOnline = char.secondsOnline;
                collection.score = char.score;

                if (char.online == true && this.core.tracking.running == true) {
                    collection.secondsOnline += (nowMs - char.joinTime) / 1000;
                }

                let containsType: boolean = false;

                char.stats.getMap().forEach((value: number, key: string) => {
                    const psEvent: PsEvent = PsEvents.get(key) || PsEvent.default;

                    // Is this stat one of the ones being displayed?
                    if (psEvent.types.indexOf(this.settings.eventType) > -1) {
                        //console.log(`Needed ${this.settings.eventType} to display ${char.name}, found from ${key}`);
                        containsType = true;
                    }

                    // Always copy the stat to the display collection, useful if the event type is not what
                    //      is currently being displayed, but the event is gotten anyways (medic kills)
                    collection.stats.set(psEvent.name, value);
                });

                if (containsType) {
                    this.display.push(collection);
                }
            });

            let sortFunc: ((a: TrackedPlayer, b: TrackedPlayer) => number);

            if (this.settings.sortColumn == "name") {
                sortFunc = (a, b) => a.name.localeCompare(b.name);
            } else if (this.settings.sortColumn == "outfit") {
                sortFunc = (a, b) => {
                    const ret = a.outfitTag.localeCompare(b.outfitTag);
                    return ret || a.name.localeCompare(b.name);
                };
            } else if (this.settings.sortColumn == "score") {
                sortFunc = (a, b) => {
                    const ret = b.score - a.score;
                    return ret || (a.name.localeCompare(b.name));
                };
            } else {
                sortFunc = (a, b) => {
                    const av: number = a.stats.get(this.settings.sortColumn);
                    const bv: number = b.stats.get(this.settings.sortColumn);
                    return (bv - av) || b.name.localeCompare(a.name);
                }
            }

            this.display.sort(sortFunc);
            //console.timeEnd("update display");
        },

        squadKeyEvent(ev: KeyboardEvent): void {
            if (this.view != "killfeed") {
                return;
            }

            const whatHovered = KillfeedGeneration.getHovered();

            if (whatHovered == "squad") {
                KillfeedGeneration.mergeSquads(ev.key);
                this.updateDisplay();
            } else if (whatHovered == "member") {
                KillfeedGeneration.moveMember(ev.key);
                this.updateDisplay();
            } else {

            }
        },

        generateReport: function(): void {
            if (this.parameters.report == "ops") {
                this.generateOutfitReport();
                this.view = "ops";
            } else if (this.parameters.report == "winter") {
                this.generateWinterReport();
                this.view = "winter";
            }

            this.parameters.report = "";
        },

        generateOutfitReport: function(): void {
            this.outfitReport = new OutfitReport();

            let filterZoneID: boolean = this.opsReportSettings.zoneID != null;

            this.outfitReport.facilityCaptures = this.core.facilityCaptures.filter((iter: FacilityCapture) => {
                return (filterZoneID == false || (filterZoneID == true && iter.zoneID == this.opsReportSettings.zoneID))
                    && this.core.outfits.indexOf(iter.outfitID) > -1;
            });

            this.outfitReport.facilityCaptures.sort((a, b) => {
                return a.timestamp.getTime() - b.timestamp.getTime();
            });

            EventReporter.facilityCaptures({
                captures: this.outfitReport.facilityCaptures,
                players: this.core.playerCaptures
            }).ok(data => this.outfitReport.baseCaptures = data);

            const sessions: SessionV1[] = this.outfitTrends.sessions
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

            this.outfitReport.trends.kpm.total = sessions.map(iter => { return { timestamp: iter.timestamp, values: iter.kpms.total }; });
            this.outfitReport.trends.kpm.infil = sessions.map(iter => { return { timestamp: iter.timestamp, values: iter.kpms.infil }; });
            this.outfitReport.trends.kpm.lightAssault = sessions.map(iter => { return { timestamp: iter.timestamp, values: iter.kpms.lightAssault }; });
            this.outfitReport.trends.kpm.medic = sessions.map(iter => { return { timestamp: iter.timestamp, values: iter.kpms.medic }; });
            this.outfitReport.trends.kpm.engineer = sessions.map(iter => { return { timestamp: iter.timestamp, values: iter.kpms.engineer }; });
            this.outfitReport.trends.kpm.heavy = sessions.map(iter => { return { timestamp: iter.timestamp, values: iter.kpms.heavy }; });

            this.outfitReport.trends.kd.total = sessions.map(iter => { return { timestamp: iter.timestamp, values: iter.kds.total }; });
            this.outfitReport.trends.kd.infil = sessions.map(iter => { return { timestamp: iter.timestamp, values: iter.kds.infil }; });
            this.outfitReport.trends.kd.lightAssault = sessions.map(iter => { return { timestamp: iter.timestamp, values: iter.kds.lightAssault }; });
            this.outfitReport.trends.kd.medic = sessions.map(iter => { return { timestamp: iter.timestamp, values: iter.kds.medic }; });
            this.outfitReport.trends.kd.engineer = sessions.map(iter => { return { timestamp: iter.timestamp, values: iter.kds.engineer }; });
            this.outfitReport.trends.kd.heavy = sessions.map(iter => { return { timestamp: iter.timestamp, values: iter.kds.heavy }; });

            this.core.statTotals.getMap().forEach((amount: number, expID: string) => {
                const event: PsEvent | undefined = PsEvents.get(expID);
                if (event == undefined) { return; }

                this.outfitReport.stats.set(event.name, amount);
            });

            this.core.stats.forEach((player: TrackedPlayer, charID: string) => {
                if (player.events.length == 0) { return; }

                let onZoneID: boolean = false;

                this.outfitReport.score += player.score;
                if (filterZoneID == true) {
                    const zoneEvents = player.events.filter(iter => iter.zoneID == this.opsReportSettings.zoneID);
                    if (zoneEvents.length > 0) {
                        onZoneID = true;
                        this.outfitReport.events.push(...zoneEvents);
                    } else {
                        return;
                    }
                } else {
                    this.outfitReport.events.push(...player.events);
                }

                const playtime = IndividualReporter.classUsage({
                    player: player,
                    events: [],
                    routers: [],
                    tracking: this.core.tracking
                });

                this.outfitReport.players.push({
                    name: `${(player.outfitTag != '' ? `[${player.outfitTag}] ` : '')}${player.name}`,
                    ...playtime 
                });
            });

            this.outfitReport.events = this.outfitReport.events.sort((a, b) => a.timestamp - b.timestamp);

            if (this.core.tracking.running == true) {
                console.log(`Running setting endTime to now as the tracking is running`);
                this.core.tracking.endTime = new Date().getTime();
            }

            const headshots: ClassCollection<number> = classCollectionNumber();
            for (const ev of this.outfitReport.events) {
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
            this.outfitReport.classStats.set("Headshot", headshots);

            for (const ev of this.outfitReport.events) {
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

                if (!this.outfitReport.classStats.has(statName)) {
                    //console.log(`Added stats for '${statName}'`);
                    this.outfitReport.classStats.set(statName, classCollectionNumber());
                }

                const classCollection: ClassCollection<number> = this.outfitReport.classStats.get(statName)!;
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

            EventReporter.weaponKills(this.outfitReport.events).ok(data => this.outfitReport.weaponKillBreakdown = data);
            EventReporter.weaponTypeKills(this.outfitReport.events).ok(data => this.outfitReport.weaponTypeKillBreakdown = data);

            EventReporter.factionKills(this.outfitReport.events).ok(data => this.outfitReport.factionKillBreakdown = data);
            EventReporter.factionDeaths(this.outfitReport.events).ok(data => this.outfitReport.factionDeathBreakdown = data);

            EventReporter.continentKills(this.outfitReport.events).ok(data => this.outfitReport.continentKillBreakdown = data);
            EventReporter.continentDeaths(this.outfitReport.events).ok(data => this.outfitReport.continentDeathBreakdown = data);

            EventReporter.weaponDeaths(this.outfitReport.events).ok(data => this.outfitReport.deathAllBreakdown = data);
            EventReporter.weaponDeaths(this.outfitReport.events, true).ok(data => this.outfitReport.deathRevivedBreakdown = data);
            EventReporter.weaponDeaths(this.outfitReport.events, false).ok(data => this.outfitReport.deathKilledBreakdown = data);
            EventReporter.weaponTypeDeaths(this.outfitReport.events).ok(data => this.outfitReport.deathAllTypeBreakdown = data);
            EventReporter.weaponTypeDeaths(this.outfitReport.events, true).ok(data => this.outfitReport.deathRevivedTypeBreakdown = data);
            EventReporter.weaponTypeDeaths(this.outfitReport.events, false).ok(data => this.outfitReport.deathKilledTypeBreakdown = data);

            EventReporter.weaponDeathBreakdown(this.outfitReport.events).ok(data => this.outfitReport.weaponTypeDeathBreakdown = data);

            /* Not super useful and take a long time to generate
            this.outfitReport.timeUnrevived = IndividualReporter.unrevivedTime(this.outfitReport.events);
            this.outfitReport.revivedLifeExpectance = IndividualReporter.reviveLifeExpectance(this.outfitReport.events);
            this.outfitReport.kmLifeExpectance = IndividualReporter.lifeExpectanceRate(this.outfitReport.events);
            this.outfitReport.kmTimeDead = IndividualReporter.timeUntilReviveRate(this.outfitReport.events);
            */

            const classFilter: (iter: Event, type: "kill" | "death", loadouts: string[]) => boolean = (iter, type, loadouts) => {
                if (iter.type == type) {
                    return loadouts.indexOf(iter.loadoutID) > -1;
                }
                return false;
            };

            EventReporter.weaponTypeKills(this.outfitReport.events.filter(iter => classFilter(iter, "kill", ["1", "8", "15"])))
                .ok(data => this.outfitReport.classTypeKills.infil = data);
            EventReporter.weaponTypeKills(this.outfitReport.events.filter(iter => classFilter(iter, "kill", ["3", "10", "17"])))
                .ok(data => this.outfitReport.classTypeKills.lightAssault = data);
            EventReporter.weaponTypeKills(this.outfitReport.events.filter(iter => classFilter(iter, "kill", ["4", "11", "18"])))
                .ok(data => this.outfitReport.classTypeKills.medic = data);
            EventReporter.weaponTypeKills(this.outfitReport.events.filter(iter => classFilter(iter, "kill", ["5", "12", "19"])))
                .ok(data => this.outfitReport.classTypeKills.engineer = data);
            EventReporter.weaponTypeKills(this.outfitReport.events.filter(iter => classFilter(iter, "kill", ["6", "13", "20"])))
                .ok(data => this.outfitReport.classTypeKills.heavy = data);
            EventReporter.weaponTypeKills(this.outfitReport.events.filter(iter => classFilter(iter, "kill", ["7", "14", "21"])))
                .ok(data => this.outfitReport.classTypeKills.max = data);

            EventReporter.weaponTypeDeaths(this.outfitReport.events.filter(iter => classFilter(iter, "death", ["1", "8", "15"])))
                .ok(data => this.outfitReport.classTypeDeaths.infil = data);
            EventReporter.weaponTypeDeaths(this.outfitReport.events.filter(iter => classFilter(iter, "death", ["3", "10", "17"])))
                .ok(data => this.outfitReport.classTypeDeaths.lightAssault = data);
            EventReporter.weaponTypeDeaths(this.outfitReport.events.filter(iter => classFilter(iter, "death", ["4", "11", "18"])))
                .ok(data => this.outfitReport.classTypeDeaths.medic = data);
            EventReporter.weaponTypeDeaths(this.outfitReport.events.filter(iter => classFilter(iter, "death", ["5", "12", "19"])))
                .ok(data => this.outfitReport.classTypeDeaths.engineer = data);
            EventReporter.weaponTypeDeaths(this.outfitReport.events.filter(iter => classFilter(iter, "death", ["6", "13", "20"])))
                .ok(data => this.outfitReport.classTypeDeaths.heavy = data);
            EventReporter.weaponTypeDeaths(this.outfitReport.events.filter(iter => classFilter(iter, "death", ["7", "14", "21"])))
                .ok(data => this.outfitReport.classTypeDeaths.max = data);

            this.outfitReport.classKds.infil = IndividualReporter.classVersusKd(this.outfitReport.events, "infil");
            this.outfitReport.classKds.lightAssault = IndividualReporter.classVersusKd(this.outfitReport.events, "lightAssault");
            this.outfitReport.classKds.medic = IndividualReporter.classVersusKd(this.outfitReport.events, "medic");
            this.outfitReport.classKds.engineer = IndividualReporter.classVersusKd(this.outfitReport.events, "engineer");
            this.outfitReport.classKds.heavy = IndividualReporter.classVersusKd(this.outfitReport.events, "heavy");
            this.outfitReport.classKds.max = IndividualReporter.classVersusKd(this.outfitReport.events, "max");
            this.outfitReport.classKds.total = IndividualReporter.classVersusKd(this.outfitReport.events);

            EventReporter.outfitVersusBreakdown(this.outfitReport.events).ok(data => this.outfitReport.outfitVersusBreakdown = data);

            EventReporter.vehicleKills(this.outfitReport.events).ok(data => this.outfitReport.vehicleKillBreakdown = data);
            EventReporter.vehicleWeaponKills(this.outfitReport.events).ok(data => this.outfitReport.vehicleKillWeaponBreakdown = data);

            let otherIDs: string[] = [];
            const breakdown: Map<string, ExpBreakdown> = new Map<string, ExpBreakdown>();
            for (const event of this.outfitReport.events) {
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
            this.outfitReport.scoreBreakdown = [...breakdown.entries()].sort((a, b) => {
                return (b[1].score - a[1].score)
                    || (b[1].amount - a[1].amount)
                    || (b[0].localeCompare(a[0]))
            }).map((a) => a[1]); // Transform the tuple into the ExpBreakdown

            this.outfitReport.continent = IndividualReporter.generateContinentPlayedOn(this.outfitReport.events);

            this.outfitReport.overtimePer1.kpm = EventReporter.kpmOverTime(this.outfitReport.events, 60000);
            this.outfitReport.overtimePer1.kd = EventReporter.kdOverTime(this.outfitReport.events, 60000);
            this.outfitReport.overtimePer1.rpm = EventReporter.revivesOverTime(this.outfitReport.events, 60000);

            this.outfitReport.overtimePer5.kpm = EventReporter.kpmOverTime(this.outfitReport.events);
            this.outfitReport.overtimePer5.kd = EventReporter.kdOverTime(this.outfitReport.events);
            this.outfitReport.overtimePer5.rpm = EventReporter.revivesOverTime(this.outfitReport.events);

            this.outfitReport.perUpdate.kd = EventReporter.kdPerUpdate(this.outfitReport.events);
        },

        generateWinterReport: function(): void {
            const params: WinterReportParameters = new WinterReportParameters();
            params.players = Array.from(this.core.stats.values());
            params.timeTracking = this.core.tracking;
            params.settings = this.winter.settings;

            this.core.stats.forEach((player: TrackedPlayer, charID: string) => {
                if (player.events.length == 0) { return; }

                params.events.push(...player.events);
            });

            this.winter.report = Loadable.loading();
            WinterReportGenerator.generate(params).ok((data: WinterReport) => {
                this.winter.report = Loadable.loaded(data);
            });
        },

        generatePersonalReport: function(charID: string): void {
            let opsLeft: number = 2;

            let html: string = "";
            let report: Report = new Report();

            PersonalReportGenerator.getTemplate().ok((type: string) => {
                html = type;
                if (--opsLeft == 0) {
                    done();
                }
            });

            this.generatePlayerReport(charID).ok((data: Report) => {
                report = data;
                console.log(`Made report: ${JSON.stringify(report.playerVersus)}`);
                if (--opsLeft == 0) {
                    done();
                }
            });

            const done = () => {
                const str: string = PersonalReportGenerator.generate(html, report);

                FileSaver.saveAs(new File([str], `topt-${report.player?.name}.html`, { type: "text/html" }))
            };
        },

        removeTrendSession: function(index: number): void {
            const conf: boolean = confirm(`Are you sure you want to remove this trend entry?`);
            if (conf == false) {
                return;
            }

            this.outfitTrends.sessions.splice(index, 1);

            StorageHelper.setTrends(this.storage.trendFileName, this.outfitTrends);
        },

        generatePlayerReport: function(charID: string): ApiResponse<Report> {
            const response: ApiResponse<Report> = new ApiResponse();

            const player: TrackedPlayer | undefined = this.core.stats.get(charID);
            if (player == undefined) {
                response.resolve({ code: 404, data: `` });
            } else {
                const events: TEvent[] = [...player.events];
                this.core.stats.forEach((player: TrackedPlayer, _: string) => {
                    if (charID == player.characterID) { // Don't add the characters's events twice
                        return;
                    }
                    events.push(...player.events);
                });
                events.push(...this.core.miscEvents);

                events.sort((a, b) => a.timestamp - b.timestamp);

                const parameters: ReportParameters = {
                    player: player,
                    events: events,
                    tracking: {...this.core.tracking},
                    routers: [...this.core.routerTracking.routers]
                };

                IndividualReporter.generatePersonalReport(parameters).ok(data => {
                    response.resolveOk(data);
                });
            }

            return response;
        },

        generateAllReports: function(): void {
            let left: TrackedPlayer[] = [];
            this.core.stats.forEach((player: TrackedPlayer, charID: string) => {
                if (player.events.length > 0) {
                    left.push(player);
                }
            });

            let reports: Report[] = [];
            let html: string = "";

            let opsLeft: number = 2;

            this.generation.names = left.map(iter => iter.name);
            this.generation.state = left.map(iter => "Pending");

            $("#generation-modal").modal("show");

            const generateReport = () => {
                if (left.length == 0) {
                    if (--opsLeft == 0) {
                        console.log(`opsLeft is 0, performing done`);
                        done();
                    }
                    console.log(`No reports left`);
                    return;
                }

                const char: TrackedPlayer = left.shift()!;
                console.log(`Generating report for ${char.name}: Have ${left.length} left`);

                const index: number = this.generation.names.findIndex(iter => iter == char.name);
                this.generation.state[index] = "Generating...";

                try {
                    this.generatePlayerReport(char.characterID).ok((report: Report) => {
                        if (report.player == null) {
                            console.warn(`Missing player for report ${char.characterID}`);
                        }
                        reports.push(report);
                        this.generation.state[index] = "Done";

                        generateReport();
                    }).always(() => {
                        console.log(`Finished ${char.name} generation`);
                    });
                } catch {
                    this.generation.state[index] = "Error";
                    generateReport();
                }
            };

            PersonalReportGenerator.getTemplate().ok((type: string) => {
                html = type;
                if (--opsLeft == 0) {
                    done();
                }
            });

            const done = () => {
                $("#generation-modal").modal("hide");

                const zip: JSZip = new JSZip();

                const timestamp: string = moment(new Date()).format("YYYY-MM-DD");

                for (const report of reports) {
                    const str = PersonalReportGenerator.generate(html, report);

                    zip.file(`topt_report_${report.player?.name}_${timestamp}.html`, str);
                    console.log(`Added ${report.player?.name} to zip file`);
                }

                console.log(`Generating zip file`);

                zip.generateAsync({
                    type: "blob"
                }).then((content: Blob) => {
                    console.log(`Generated zip file`);
                    FileSaver.saveAs(content, `topt_ops_${timestamp}_all.zip`);
                    console.log(`FileSaver performed save of zip`);
                });
            };

            generateReport();
        },

        setEventType: function(type: PsEventType): void {
            this.settings.eventType = type;
            this.updateDisplay();
        },

        sortTable: function(statName: string): void {
            this.settings.sortColumn = statName;
            this.updateDisplay();
        },

        setSaveEvents: function(save: boolean): void {
            if (save == true) {
                this.core.start();
            } else {
                this.core.stop();

                const chars: TrackedPlayer[] = Array.from(this.core.stats.values());
                this.outfitTrends.sessions.push({
                    timestamp: new Date(this.core.tracking.startTime),
                    kds: {
                        total: EventReporter.kdBoxplot(chars, this.core.tracking),
                        infil: EventReporter.kdBoxplot(chars, this.core.tracking, "infil"),
                        lightAssault: EventReporter.kdBoxplot(chars, this.core.tracking, "lightAssault"),
                        medic: EventReporter.kdBoxplot(chars, this.core.tracking, "medic"),
                        engineer: EventReporter.kdBoxplot(chars, this.core.tracking, "engineer"),
                        heavy: EventReporter.kdBoxplot(chars, this.core.tracking, "heavy"),
                        max: EventReporter.kdBoxplot(chars, this.core.tracking, "max")
                    },
                    kpms: {
                        total: EventReporter.kpmBoxplot(chars, this.core.tracking),
                        infil: EventReporter.kpmBoxplot(chars, this.core.tracking, "infil"),
                        lightAssault: EventReporter.kpmBoxplot(chars, this.core.tracking, "lightAssault"),
                        medic: EventReporter.kpmBoxplot(chars, this.core.tracking, "medic"),
                        engineer: EventReporter.kpmBoxplot(chars, this.core.tracking, "engineer"),
                        heavy: EventReporter.kpmBoxplot(chars, this.core.tracking, "heavy"),
                        max: EventReporter.kpmBoxplot(chars, this.core.tracking, "max"),
                    }
                });

                if (this.storage.enabled == true) {
                    StorageHelper.setTrends(this.storage.newTrendFile, this.outfitTrends);
                }
            }
        },

        addOutfit: function(): void {
            if (this.parameters.outfitTag.trim().length == 0) {
                return;
            }

            if (["fooi", "fiji", "g0bs"].indexOf(this.parameters.outfitTag.toLowerCase()) > -1) {
                this.showFrog = true;
            }

            this.core.addOutfit(this.parameters.outfitTag);
        },

        addPlayer: function(): void {
            if (this.parameters.playerName.trim().length == 0) {
                return;
            }

            this.core.addPlayer(this.parameters.playerName);
        },

    },

    computed: {
        canConnect: function(): boolean {
            return this.settings.serviceToken.trim().length > 0
                && (
                    this.storage.pendingTrend != null
                    || this.storage.newTrendFile.length > 0
                    || this.storage.pendingTrend == undefined
                );
        },

        core: function(): Core {
            if (this.coreObject == null) {
                throw ``;
            }
            return this.coreObject;
        }
    },

    watch: {
        "settings.updateRate": function(): void {
            clearInterval(this.refreshIntervalID);
            this.refreshIntervalID = setInterval(
                this.updateDisplay,
                this.settings.updateRate * 1000
            ) as unknown as number;
        }
    }
});
(window as any).vm = vm;
