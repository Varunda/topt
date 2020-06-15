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
import { Event, EventExp, EventKill, EventDeath, EventVehicleKill, EventCapture } from "Event";
import StatMap from "StatMap";

import EventReporter, { statMapToBreakdown,
    Breakdown, BreakdownArray,
    OutfitVersusBreakdown, ClassCollection, classCollectionNumber
} from "EventReporter";
import {
    ExpBreakdown, FacilityCapture, ClassBreakdown, IndividualReporter, OutfitReport,
    CountedRibbon, Report, TrackedPlayer, TimeTracking, BreakdownCollection, BreakdownSection, BreakdownMeta,
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

import { BaseReport, BaseGenerator } from "BaseGenerator";
import { OutfitTrendsV1, OutfitTrends, SessionV1 } from "OutfitTrends";
import { StorageHelper, StorageSession, StorageTrend } from "Storage";
import { KillfeedGeneration, KillfeedEntry, KillfeedOptions, Killfeed } from "Killfeed";

class OpReportSettings {
    public zoneID: string | null = null;
}

class BaseReportSettings {
    public zoneID: string | null = null;
}

(window as any).$ = $;

export const vm = new Vue({
    el: "#app" as string,

    data: {
        socketStatus: Loadable.idle() as Loading<string>,
        socketStep: "idle" as  "idle" | "connecting" | "pinging" | "connected",

        sockets: {
            tracked: null as WebSocket | null,
            logistics: null as WebSocket | null,
            logins: null as WebSocket | null,
            facility: null as WebSocket | null,

            queue: [] as string[]
        },

        routerTracking: {
            // key - Who placed the router
            // value - Lastest npc ID that gave them a router spawn tick
            routerNpcs: new Map() as Map<string, TrackedRouter>, // <char ID, npc ID>

            routers: [] as TrackedRouter[] // All routers that have been placed
        },

        data: [] as any[], // Collection of all messages from all sockets, used for exporting

        view: "setup" as "setup" | "realtime" | "ops" | "personal" | "base" | "killfeed",

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

        // Fields related to the current state of tracking
        tracking: {
            running: false as boolean,
            startTime: new Date().getTime() as number,
            endTime: new Date().getTime() as number
        } as TimeTracking,

        // Used to make iteration thru classes easier
        classIterator: [
            { title: "Infiltrator", name: "infil" },
            { title: "Light assault", name: "lightAssault" },
            { title: "Medic", name: "medic" },
            { title: "Engineer", name: "engineer" },
            { title: "Heavy", name: "heavy" },
            { title: "Max", name: "max" },
        ],

        outfitReport: new OutfitReport() as OutfitReport,
        opsReportSettings: new OpReportSettings() as OpReportSettings,

        outfitTrends: new OutfitTrendsV1() as OutfitTrends,

        refreshIntervalID: -1 as number, // ID of the timed interval to refresh the realtime view
        characters: [] as Character[], // Characters being tracked
        outfits: [] as string[], // Outfits being tracked for base caps
        facilityCaptures: [] as FacilityCapture[], // Facilities captures while tracking
        playerCaptures: [] as EventCapture[], // Any PlayerFacilityCapture events
        miscEvents: [] as Event[], // Other events captured used to generate stats

        zoneIDs: [] as string[], // All the zone IDs captured during this operational

        stats: new Map<string, TrackedPlayer>() as Map<string, TrackedPlayer>,  // <char ID, Player>

        statTotals: new StatMap() as StatMap, // Total time an event has been ticked

        // How many events have been tracked, useful for debugging
        totalTicks: 0 as number,
        totalLength: 0 as number,

        showFrog: false as boolean,

        display: [] as TrackedPlayer[] // The currently displayed stats
    },

    created: function(): void {
        this.refreshIntervalID = setInterval(this.updateDisplay, this.settings.updateRate * 1000) as unknown as number;

        this.storage.enabled = StorageHelper.isEnabled();

        this.sockets.queue.length = 5;

        WeaponAPI.loadJson();
        FacilityAPI.loadJson();
    },

    mounted: function(): void {
        if (this.storage.enabled == true) {
            this.storage.trends = StorageHelper.getTrends();
        }

        window.onbeforeunload = (ev: BeforeUnloadEvent) => {
            this.disconnect();
        };

        document.addEventListener("keyup", this.squadKeyEvent);
    },

    methods: {
        connect: function(): void {
            this.disconnect();

            if (this.canConnect == false) {
                return console.warn(`Cannot connect: service ID is empty`);
            }

            this.socketStep = "connecting";
            CensusAPI.init(this.settings.serviceToken);

            this.sockets.tracked = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${this.settings.serviceToken}`);
            this.sockets.tracked.onopen = this.onTestOpen;
            this.sockets.tracked.onerror = this.onTestError;
            this.sockets.tracked.onmessage = this.onTestMessage;

            this.sockets.logistics = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${this.settings.serviceToken}`);
            this.sockets.logistics.onopen = this.onRouterOpen;
            this.sockets.logistics.onerror = this.onRouterError;
            this.sockets.logistics.onmessage = this.onRouterMessage;

            this.sockets.logins = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${this.settings.serviceToken}`);
            this.sockets.logins.onopen = this.onLoginOpen;
            this.sockets.logins.onerror = this.onLoginError;
            this.sockets.logins.onmessage = this.onLoginMessage;

            this.sockets.facility = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${this.settings.serviceToken}`);
            this.sockets.facility.onopen = this.onFacilityOpen;
            this.sockets.facility.onmessage = this.onFacilityMessage;
            this.sockets.facility.onerror = this.onTestError;

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

        disconnect: function(): void {
            if (this.sockets.tracked != null) { this.sockets.tracked.close(); }
            if (this.sockets.logins != null) { this.sockets.logins.close(); }
            if (this.sockets.logistics != null) { this.sockets.logistics.close(); }
            if (this.sockets.facility != null) { this.sockets.facility.close(); }
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

                    this.subscribeToExpGains(chars);

                    this.outfits = outfits;

                    const parsedData = events.map(iter => JSON.parse(iter));
                    this.tracking.startTime = Math.min(...parsedData.map(iter => (Number.parseInt(iter.payload.timestamp) * 1000) || 0));
                    this.tracking.endTime = Math.max(...parsedData.map(iter => (Number.parseInt(iter.payload.timestamp) * 1000) || 0));

                    for (const ev of events) {
                        this.processMessage(ev, true);
                    }
                    this.setSaveEvents(false);

                    console.log(`Took ${new Date().getTime() - nowMs}ms to import data from ${this.tracking.startTime} ${new Date(this.tracking.startTime)} to ${this.tracking.endTime}`);
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
                events: this.data,
                players: this.characters,
                outfits: this.outfits
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
            this.stats.forEach((char: TrackedPlayer, charID: string) => {
                if (char.stats.size() == 0) { return; }

                const collection: TrackedPlayer = new TrackedPlayer();
                collection.name = char.name;
                collection.outfitTag = char.outfitTag;
                collection.characterID = char.characterID;
                collection.online = char.online;
                collection.secondsOnline = char.secondsOnline;
                collection.score = char.score;

                if (char.online == true && this.tracking.running == true) {
                    collection.secondsOnline += (nowMs - char.joinTime) / 1000;
                }

                let containsType: boolean = false;

                char.stats.getMap().forEach((value: number, key: string) => {
                    const psEvent: PsEvent = PsEvents.get(key) || PsEvent.default;

                    // Is this stat one of the ones being displayed?
                    if (psEvent.types.indexOf(this.settings.eventType) > -1) {
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

        trap: function(ev: any): void {
            debugger;
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
            }

            this.parameters.report = "";
        },

        generateOutfitReport: function(): void {
            this.outfitReport = new OutfitReport();

            let filterZoneID: boolean = this.opsReportSettings.zoneID != null;

            this.outfitReport.facilityCaptures = this.facilityCaptures.filter((iter: FacilityCapture) => {
                return (filterZoneID == false || (filterZoneID == true && iter.zoneID == this.opsReportSettings.zoneID))
                    && this.outfits.indexOf(iter.outfitID) > -1;
            });

            this.outfitReport.facilityCaptures.sort((a, b) => {
                return a.timestamp.getTime() - b.timestamp.getTime();
            });

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

            this.statTotals.getMap().forEach((amount: number, expID: string) => {
                const event: PsEvent | undefined = PsEvents.get(expID);
                if (event == undefined) { return; }

                this.outfitReport.stats.set(event.name, amount);
            });

            this.stats.forEach((player: TrackedPlayer, charID: string) => {
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
                    tracking: this.tracking
                });

                this.outfitReport.players.push({
                    name: `${(player.outfitTag != '' ? `[${player.outfitTag}] ` : '')}${player.name}`,
                    ...playtime 
                });
            });

            if (this.tracking.running == true) {
                console.log(`Running setting endTime to now as the tracking is running`);
                this.tracking.endTime = new Date().getTime();
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

            this.outfitReport.timeUnrevived = IndividualReporter.unrevivedTime(this.outfitReport.events);
            this.outfitReport.revivedLifeExpectance = IndividualReporter.reviveLifeExpectance(this.outfitReport.events);
            this.outfitReport.kmLifeExpectance = IndividualReporter.lifeExpectanceRate(this.outfitReport.events);
            this.outfitReport.kmTimeDead = IndividualReporter.timeUntilReviveRate(this.outfitReport.events);

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

            EventReporter.kpmOverTime(this.outfitReport.events).ok(data => this.outfitReport.overtime.kpm = data);
            EventReporter.kdOverTime(this.outfitReport.events).ok(data => this.outfitReport.overtime.kd = data);
            EventReporter.revivesOverTime(this.outfitReport.events).ok(data => this.outfitReport.overtime.rpm = data);

            EventReporter.kdPerUpdate(this.outfitReport.events).ok(data => this.outfitReport.perUpdate.kd = data);
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

            const player: TrackedPlayer | undefined = this.stats.get(charID);
            if (player == undefined) {
                response.resolve({ code: 404, data: `` });
            } else {
                const events: Event[] = [...player.events];
                this.stats.forEach((player: TrackedPlayer, charID: string) => {
                    events.push(...player.events);
                });
                events.push(...this.miscEvents);

                events.sort((a, b) => a.timestamp - b.timestamp);

                const parameters: ReportParameters = {
                    player: player,
                    events: events,
                    tracking: {...this.tracking},
                    routers: [...this.routerTracking.routers]
                };

                IndividualReporter.generatePersonalReport(parameters).ok(data => {
                    response.resolveOk(data);
                });
            }

            return response;
        },

        generateAllReports: function(): void {
            let left: TrackedPlayer[] = [];
            this.stats.forEach((player: TrackedPlayer, charID: string) => {
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
                const nowMs: number = new Date().getTime();
                this.tracking.startTime = nowMs;
                console.log(`Setting startTime to ${nowMs}`);
                this.stats.forEach((char: TrackedPlayer, charID: string) => {
                    char.joinTime = nowMs;
                });
            } else {
                // If TOPT was already running update the end time, else we're doing an import of old data
                if (this.tracking.running == true) {
                    const nowMs: number = new Date().getTime();
                    this.tracking.endTime = nowMs;
                }

                this.stats.forEach((char: TrackedPlayer, charID: string) => {
                    if (char.events.length > 0) {
                        const first = char.events[0];
                        const last = char.events[char.events.length - 1];

                        char.joinTime = first.timestamp;
                        char.secondsOnline = (last.timestamp - first.timestamp) / 1000;
                    } else {
                        char.secondsOnline = 0;
                    }
                });

                const chars: TrackedPlayer[] = Array.from(this.stats.values());

                this.outfitTrends.sessions.push({
                    timestamp: new Date(this.tracking.startTime),
                    kds: {
                        total: EventReporter.kdBoxplot(chars, this.tracking),
                        infil: EventReporter.kdBoxplot(chars, this.tracking, "infil"),
                        lightAssault: EventReporter.kdBoxplot(chars, this.tracking, "lightAssault"),
                        medic: EventReporter.kdBoxplot(chars, this.tracking, "medic"),
                        engineer: EventReporter.kdBoxplot(chars, this.tracking, "engineer"),
                        heavy: EventReporter.kdBoxplot(chars, this.tracking, "heavy"),
                        max: EventReporter.kdBoxplot(chars, this.tracking, "max")
                    },
                    kpms: {
                        total: EventReporter.kpmBoxplot(chars, this.tracking),
                        infil: EventReporter.kpmBoxplot(chars, this.tracking, "infil"),
                        lightAssault: EventReporter.kpmBoxplot(chars, this.tracking, "lightAssault"),
                        medic: EventReporter.kpmBoxplot(chars, this.tracking, "medic"),
                        engineer: EventReporter.kpmBoxplot(chars, this.tracking, "engineer"),
                        heavy: EventReporter.kpmBoxplot(chars, this.tracking, "heavy"),
                        max: EventReporter.kpmBoxplot(chars, this.tracking, "max"),
                    }
                });

                if (this.storage.enabled == true) {
                    StorageHelper.setTrends(this.storage.newTrendFile, this.outfitTrends);
                }
            }

            this.tracking.running = save;
        },

        addOutfit: function(): void {
            if (this.parameters.outfitTag.trim().length == 0) {
                return;
            }

            OutfitAPI.getByTag(this.parameters.outfitTag).ok((data: Outfit) => {
                this.outfits.push(data.ID);
                console.log(`Tracking outfit ${data.ID} for base caps/defends`);
            });

            if (["fooi", "fiji", "g0bs"].indexOf(this.parameters.outfitTag.toLowerCase()) > -1) {
                this.showFrog = true;
            }

            this.parameters.outfitRequest = Loadable.loading();
            OutfitAPI.getCharactersByTag(this.parameters.outfitTag).ok((data: Character[]) => {
                this.parameters.outfitRequest = Loadable.loaded("");
                this.subscribeToExpGains(data);

                KillfeedGeneration.addCharacters(data);

                this.parameters.outfitTag = "";
            });
        },

        addPlayer: function(): void {
            if (this.parameters.playerName.trim().length == 0) {
                return;
            }

            CharacterAPI.getByName(this.parameters.playerName).ok((data: Character) => {
                this.subscribeToExpGains([data]);
                this.parameters.playerName = "";
            });
        },

        clearEvents: function(): void {
            const conf = confirm(`Are you sure you want to remove all events?`);
            if (conf == true) {
                this.stats.forEach((value: TrackedPlayer, key: string) => {
                    value.secondsOnline = 0;
                    value.score = 0;
                    value.events = [];
                    value.stats.clear();
                });
                this.updateDisplay();
                this.totalTicks = 0;
            }
        },

        subscribeToExpGains: function(chars: Character[]): void {
            // No duplicates
            chars = chars.filter((char: Character) => {
                return this.characters.map((c) => c.ID).indexOf(char.ID) == -1;
            });

            if (chars.length == 0) {
                return;
            }

            this.characters = this.characters.concat(chars).sort((a, b) => {
                return a.name.localeCompare(b.name);
            });

            chars.forEach((character: Character) => {
                const player: TrackedPlayer = new TrackedPlayer();
                player.characterID = character.ID;
                player.faction = character.faction;
                player.outfitTag = character.outfitTag;
                player.name = character.name;
                if (character.online == true) {
                    player.joinTime = new Date().getTime();
                }
                this.stats.set(character.ID, player);
            });

            const subscribeExp: object = {
                "action": "subscribe",
                "characters": [
                    ...(chars.map((char) => char.ID))
                ],
                "eventNames": [
                    "GainExperience",
                    "AchievementEarned",
                    "Death",
                    "FacilityControl",
                    "ItemAdded",
                    "VehicleDestroy"
                ],
                "service": "event"
            };
            this.sendMessage(subscribeExp);
        },

        sendMessage: function(msg: object): void {
            if (this.sockets.tracked == null) {
                return console.error(`Cannot send message to socket, socket is null`);
            }

            const str: string = JSON.stringify(msg);

            console.log(`>>> ${str}`);

            this.sockets.tracked.send(str);
        },

        onerror: function(ev: any): void {
            console.log(`On error`);
        },

        processMessage: function(input: string, override: boolean = false): void {
            if (this.tracking.running == false && override == false) {
                return;
            }

            let save: boolean = false;

            const msg = JSON.parse(input);

            if (msg.type == "serviceMessage") {
                const event: string = msg.payload.event_name;

                const zoneID: string = msg.payload.zone_id;
                if (this.zoneIDs.indexOf(zoneID) == -1) {
                    this.zoneIDs.push(zoneID);
                    console.log(`Encountered new zone ID ${zoneID}:\n${JSON.stringify(msg)}`);
                }

                if (event == "GainExperience") {
                    const eventID: string = msg.payload.experience_id;
                    const charID: string = msg.payload.character_id;
                    const targetID: string = msg.payload.other_id;
                    const amount: number = Number.parseInt(msg.payload.amount);
                    const event: PsEvent | undefined = PsEvents.get(eventID);
                    const timestamp: number = Number.parseInt(msg.payload.timestamp) * 1000;

                    if (eventID == "1410") {
                        if (this.stats.get(charID) != undefined) {
                            if (this.routerTracking.routerNpcs.has(charID)) {
                                //console.log(`${charID} router npc check for ${targetID}`);
                                const router: TrackedRouter = this.routerTracking.routerNpcs.get(charID)!;
                                if (router.ID != targetID) {
                                    //console.warn(`New router placed by ${charID}, missed ItemAdded event: removing old one and replacing with ${targetID}`);

                                    router.destroyed = timestamp;

                                    this.routerTracking.routers.push({...router});

                                    this.routerTracking.routerNpcs.set(charID, {
                                        ID: targetID,
                                        owner: charID,
                                        pulledAt: timestamp,
                                        firstSpawn: timestamp,
                                        destroyed: undefined,
                                        count: 1, // Count the event that caused the new router to be tracked
                                        type: "router"
                                    });
                                } else {
                                    //console.log(`Same router, incrementing count`);
                                    if (router.ID == "") {
                                        router.ID = targetID;
                                    }
                                    if (router.firstSpawn == undefined) {
                                        router.firstSpawn = timestamp;
                                    }
                                    ++router.count;
                                }
                            } else {
                                //console.log(`${charID} has new router ${targetID} placed/used`);

                                this.routerTracking.routerNpcs.set(charID, {
                                    ID: targetID,
                                    owner: charID,
                                    pulledAt: timestamp,
                                    firstSpawn: timestamp,
                                    destroyed: undefined,
                                    count: 1, // Count the event that caused the new router to be tracked
                                    type: "router"
                                });
                            }

                            save = true;
                        }
                    } else if (eventID == "1409") {
                        const trackedNpcs: TrackedRouter[] = Array.from(this.routerTracking.routerNpcs.values());
                        const ids: string[] = trackedNpcs.map(iter => iter.ID);
                        if (ids.indexOf(targetID) > -1) {
                            const router: TrackedRouter = trackedNpcs.find(iter => iter.ID == targetID)!;
                            //console.log(`Router ${router.ID} placed by ${router.owner} destroyed, saving`);

                            router.destroyed = timestamp;
                            this.routerTracking.routers.push({...router});

                            this.routerTracking.routerNpcs.delete(router.owner);

                            save = true;
                        }
                    }

                    const ev: EventExp = {
                        type: "exp",
                        amount: amount,
                        expID: eventID,
                        zoneID: zoneID,
                        trueExpID: eventID,
                        loadoutID: msg.payload.loadout_id,
                        sourceID: charID,
                        targetID: targetID,
                        timestamp: timestamp
                    };

                    // Undefined means was the target of the event, not the source
                    const player = this.stats.get(charID);
                    if (player != undefined) {
                        ++this.totalTicks;

                        if (Number.isNaN(amount)) {
                            console.warn(`NaN amount from event: ${JSON.stringify(msg)}`);
                        } else {
                            player.score += amount;
                        }

                        if (event != undefined) {
                            if (event.track == true) {
                                player.stats.increment(eventID);
                                this.statTotals.increment(eventID);

                                if (event.alsoIncrement != undefined) {
                                    const alsoEvent: PsEvent = PsEvents.get(event.alsoIncrement)!;
                                    if (alsoEvent.track == true) {
                                        player.stats.increment(event.alsoIncrement);
                                    }

                                    ev.expID = event.alsoIncrement;
                                }
                            }
                        }

                        player.events.push(ev);
                    } else {
                        this.miscEvents.push(ev);
                    }

                    if (eventID == PsEvent.revive || eventID == PsEvent.squadRevive) {
                        const target = this.stats.get(targetID);
                        if (target != undefined) {
                            if (target.recentDeath != null) {
                                target.recentDeath.revived = true;
                                target.recentDeath.revivedEvent = ev;
                                //console.log(`${targetID} died but was revived by ${charID}`);
                            }

                            target.stats.decrement(PsEvent.death);
                            target.stats.increment(PsEvent.revived);

                            this.statTotals.decrement(PsEvent.death);
                            this.statTotals.increment(PsEvent.revived);
                        }
                    }

                    KillfeedGeneration.exp(ev);

                    save = true;
                } else if (event == "Death") {
                    const targetID: string = msg.payload.character_id;
                    const sourceID: string = msg.payload.attacker_character_id;
                    const isHeadshot: boolean = msg.payload.is_headshot == "1";
                    const targetLoadoutID: string = msg.payload.character_loadout_id;
                    const sourceLoadoutID: string = msg.payload.attacker_loadout_id;

                    if (this.tracking.running == true) {
                        CharacterAPI.cache(targetID);
                        CharacterAPI.cache(sourceID);
                    }

                    const targetLoadout: PsLoadout | undefined = PsLoadouts.get(targetLoadoutID);
                    if (targetLoadout == undefined) {
                        return console.warn(`Unknown target loadout ID: ${targetLoadoutID}`);
                    }

                    const sourceLoadout: PsLoadout | undefined = PsLoadouts.get(sourceLoadoutID);
                    if (sourceLoadout == undefined) {
                        return console.warn(`Unknown source loadout ID: ${sourceLoadoutID}`);
                    }

                    let targetTicks = this.stats.get(targetID);
                    if (targetTicks != undefined && targetLoadout.faction != sourceLoadout.faction) {
                        targetTicks.stats.increment(PsEvent.death);
                        this.statTotals.increment(PsEvent.death);

                        const ev: EventDeath = {
                            type: "death",
                            isHeadshot: isHeadshot,
                            sourceID: targetID, // Swap the target and source to keep the events consistent
                            targetID: sourceID,
                            loadoutID: targetLoadoutID,
                            targetLoadoutID: sourceLoadoutID,
                            weaponID: msg.payload.attacker_weapon_id,
                            revived: false,
                            revivedEvent: null,
                            timestamp: Number.parseInt(msg.payload.timestamp) * 1000, // Include MS
                            zoneID: zoneID
                        };
                        targetTicks.events.push(ev);
                        targetTicks.recentDeath = ev;

                        WeaponAPI.precache(ev.weaponID);

                        if (this.view == "killfeed") {
                            KillfeedGeneration.add(ev);
                        }

                        save = true;
                    }

                    let sourceTicks = this.stats.get(sourceID);
                    if (sourceTicks != undefined) {
                        if (targetLoadout.faction == sourceLoadout.faction) {
                            sourceTicks.stats.increment(PsEvent.teamkill);
                            targetTicks?.stats.increment(PsEvent.teamkilled);

                            this.statTotals.increment(PsEvent.teamkill);
                            this.statTotals.increment(PsEvent.teamkilled);
                        } else {
                            sourceTicks.stats.increment(PsEvent.kill);
                            this.statTotals.increment(PsEvent.kill);

                            if (isHeadshot == true) {
                                sourceTicks.stats.increment(PsEvent.headshot);
                                this.statTotals.increment(PsEvent.headshot);
                            }

                            const ev: EventKill = {
                                type: "kill",
                                isHeadshot: isHeadshot,
                                sourceID: sourceID,
                                targetID: targetID,
                                loadoutID: sourceLoadoutID,
                                targetLoadoutID: targetLoadoutID,
                                weaponID: msg.payload.attacker_weapon_id,
                                timestamp: Number.parseInt(msg.payload.timestamp) * 1000, // Include MS
                                zoneID: zoneID
                            };
                            sourceTicks.events.push(ev);

                            WeaponAPI.precache(ev.weaponID);

                            if (this.view == "killfeed") {
                                KillfeedGeneration.add(ev);
                            }
                        }
                        save = true;
                    }

                    ++this.totalTicks;
                } else if (event == "PlayerFacilityCapture") {
                    const playerID: string = msg.payload.character_id;
                    const outfitID: string = msg.payload.outfit_id;
                    const facilityID: string = msg.payload.facility_id;
                    const timestamp: number = Number.parseInt(msg.payload.timestamp) * 1000;

                    const ev: EventCapture = {
                        type: "capture",
                        sourceID: playerID,
                        outfitID: outfitID,
                        facilityID: facilityID,
                        timestamp: timestamp,
                        zoneID: zoneID
                    };

                    this.playerCaptures.push(ev);

                    let player = this.stats.get(playerID);
                    if (player != undefined) {
                        player.stats.increment(PsEvent.baseCapture);
                        player.events.push(ev);
                    }

                    save = true;
                } else if (event == "PlayerFacilityDefend") {
                    const playerID: string = msg.payload.character_id;

                    let player = this.stats.get(playerID);
                    if (player != undefined) {
                        player.stats.increment(PsEvent.baseDefense);
                    }
                    save = true;
                } else if (event == "AchievementEarned") {
                    const charID: string = msg.payload.character_id;
                    const achivID: string = msg.payload.achievement_id;

                    const char = this.stats.get(charID);
                    if (char != undefined) {
                        char.ribbons.increment(achivID);
                        save = true;
                    }
                } else if (event == "FacilityControl") {
                    const outfitID: string = msg.payload.outfit_id;
                    const facilityID: string = msg.payload.facility_id;
                    const timestamp: number = Number.parseInt(msg.payload.timestamp) * 1000;

                    FacilityAPI.getByID(facilityID).ok((data: Facility) => {
                        const capture: FacilityCapture = {
                            facilityID: data.ID,
                            zoneID: zoneID,
                            name: data.name,
                            typeID: data.typeID,
                            type: data.type,
                            timestamp: new Date(timestamp),
                            timeHeld: Number.parseInt(msg.payload.duration_held),
                            factionID: msg.payload.new_faction_id,
                            outfitID: outfitID,
                            previousFaction: msg.payload.old_faction_id,
                        };

                        this.facilityCaptures.push(capture);
                    }).noContent(() => {
                        console.error(`Failed to find facility ID ${facilityID}`);
                    });
                    save = true;
                } else if (event == "ItemAdded"){
                    const itemID: string = msg.payload.item_id;
                    const charID: string = msg.payload.character_id;
                    const timestamp: number = Number.parseInt(msg.payload.timestamp) * 1000;

                    if (itemID == "6003551") {
                        if (this.stats.get(charID) != undefined) {
                            //console.log(`${charID} pulled a new router`);

                            if (this.routerTracking.routerNpcs.has(charID)) {
                                const router: TrackedRouter = this.routerTracking.routerNpcs.get(charID)!;
                                //console.log(`${charID} pulled a new router, saving old one`);
                                router.destroyed = timestamp;

                                this.routerTracking.routers.push({...router});
                            }

                            const router: TrackedRouter = {
                                ID: "", // We don't get the NPC ID until someone spawns on the router
                                owner: charID,
                                count: 0,
                                destroyed: undefined,
                                firstSpawn: undefined,
                                pulledAt: timestamp,
                                type: "router"
                            };

                            this.routerTracking.routerNpcs.set(charID, router);

                            save = true;
                        }
                    }
                } else if (event == "VehicleDestroy") {
                    const killerID: string = msg.payload.attacker_character_id;
                    const killerLoadoutID: string = msg.payload.attacker_loadout_id;
                    const killerWeaponID: string = msg.payload.attacker_weapon_id;
                    const vehicleID: string = msg.payload.vehicle_id;
                    const timestamp: number = Number.parseInt(msg.payload.timestamp) * 1000;

                    const player = this.stats.get(killerID);
                    if (player != undefined) {
                        const ev: EventVehicleKill = {
                            type: "vehicle",
                            sourceID: killerID,
                            loadoutID: killerLoadoutID,
                            weaponID: killerWeaponID,
                            targetID: msg.payload.character_id,
                            vehicleID: vehicleID,
                            timestamp: timestamp,
                            zoneID: zoneID
                        };
                        player.events.push(ev);
                        save = true;
                        //console.log(`${killerID} killed vehicle ${vehicleID}`);
                    }
                } else {
                    console.warn(`Unknown event type: ${event}\n${JSON.stringify(msg)}`);
                }
            } else if (msg.type == "heartbeat") {
                //console.log(`Heartbeat ${new Date().toISOString()}`);
            } else if (msg.type == "serviceStateChanged") {
                console.log(`serviceStateChanged event`);
            } else if (msg.type == "connectionStateChanged") {
                console.log(`connectionStateChanged event`);
            } else if (msg.type == "echo") {
                // Comes from the initial setup
                // Pong!
            } else if (msg.type == undefined) {
                // Occurs in response to subscribing to new events
            } else {
                console.warn(`Unchecked message type: '${msg.type}'`);
            }

            if (save == true) {
                this.data.push(JSON.stringify(msg));
            }
        },

        onmessage: function(ev: MessageEvent): void {
            if (typeof ev.data == "string") {
                this.totalLength += ev.data.length;
            }

            for (const message of this.sockets.queue) {
                if (ev.data == message) {
                    //console.log(`Duplicate message found: ${ev.data}`);
                    return;
                }
            }

            this.sockets.queue.push(ev.data);
            this.sockets.queue.shift();

            this.processMessage(ev.data);
        },

        onTestOpen: function(ev: any): void {
            console.log(`Testing service ID`);
            this.socketStatus = Loadable.saving("Connecting...");
        },

        onTestError: function(ev: any): void {
            if (ev.type == "error") {
                console.error(`Failed to connect to streaming API`);
                this.socketStatus = Loadable.error(`Failed to connect. Bad Service ID?`);
            }
        },

        onTestMessage: function(ev: MessageEvent): void {
            const msg: any = JSON.parse(ev.data);

            if (this.socketStep == "connecting") {
                if (msg.connected == "true") {
                    if (this.sockets.tracked != null) {
                        this.socketStatus = Loadable.saving(`Connected, pinging`);
                        this.socketStep = "pinging";

                        const ping: object = {
                            action: "echo",
                            payload: {
                                ping: "ping",
                                type: "echo"
                            },
                            service: "event"
                        };
                        this.sendMessage(ping);
                    }
                } else {
                    this.socketStatus = Loadable.error(`onTestMessage failed: Expected onTestError to handle connected not being 'true'`);
                }
            } else if (this.socketStep == "pinging") {
                if (msg.type != "echo") {
                    return;
                }

                this.socketStatus = Loadable.loaded(`Connected!`);

                setTimeout(() => {
                    this.view = "realtime";
                }, 1000);

                const subscribeExp: object = {
                    action: "subscribe",
                    worlds: [this.settings.serverID],
                    eventNames: [
                        "FacilityControl",
                    ],
                    service: "event"
                };
                this.sendMessage(subscribeExp);

                if (this.sockets.tracked != null) {
                    this.sockets.tracked.onmessage = this.onmessage;
                    this.sockets.tracked.onerror = this.onerror;
                }
            } else {
                throw `Unchecked socketStep in onTestMessage: '${this.socketStep}'`;
            }
        },

        onLoginOpen: function(ev: any): void {
            if (this.sockets.logins == null) {
                throw `sockest.logins is null`;
            }

            console.log(`login socket connected`);

            const msg: object = {
                service: "event",
                action: "subscribe",
                characters: ["all"],
                worlds: [
                    this.settings.serverID
                ],
                eventNames: [
                    "PlayerLogin",
                    "PlayerLogout"
                ],
                logicalAndCharactersWithWorlds: true
            };

            this.sockets.logins.send(JSON.stringify(msg));
        },

        onLoginMessage: function(ev: MessageEvent): void {
            const input = ev.data;
            const msg = JSON.parse(input);

            if (msg.type == "serviceMessage") {
                const event: string = msg.payload.event_name;

                if (event == "PlayerLogin") {
                    const charID: string = msg.payload.character_id;
                    if (this.stats.has(charID)) {
                        const char: TrackedPlayer = this.stats.get(charID)!;
                        char.online = true;
                        if (this.tracking.running == true) {
                            char.joinTime = new Date().getTime();
                        }
                        console.log(`${charID} logged in`);
                    }
                } else if (event == "PlayerLogout") {
                    const charID: string = msg.payload.character_id;
                    if (this.stats.has(charID)) {
                        const char: TrackedPlayer = this.stats.get(charID)!;
                        char.online = false;

                        if (this.tracking.running == true) {
                            const diff: number = new Date().getTime() - char.joinTime;
                            char.secondsOnline += (diff / 1000);
                            console.log(`${charID} logged out, added ${diff / 1000} seconds`);
                        }
                    }
                }
            } else if (msg.type == "heartbeat") {
                //console.log(`Heartbeat ${new Date().toISOString()}`);
            } else if (msg.type == "serviceStateChanged") {
                console.log(`login socket: serviceStateChanged event`);
            } else if (msg.type == "connectionStateChanged") {
                console.log(`login socket: connectionStateChanged event`);
            } else if (msg.type == undefined) {
                // Occurs in response to subscribing to new events
            } else {
                console.warn(`login socket: Unchecked message type: '${msg.type}'`);
            }
        },

        onLoginError: function(ev: any): void {
            console.error(`Error in login socket`);
        },

        onRouterOpen: function(ev: any): void {
            if (this.sockets.logistics == null) {
                throw `sockets.logistics is null`;
            }

            console.log(`logistics socket connected`);

            const msg: object = {
                service: "event",
                action: "subscribe",
                characters: ["all"],
                worlds: [
                    this.settings.serverID
                ],
                eventNames: [
                    "GainExperience_experience_id_1409",
                    "GainExperience_experience_id_550",
                    "GainExperience_experience_id_551"
                ],
                logicalAndCharactersWithWorlds: true
            };

            this.sockets.logistics.send(JSON.stringify(msg));
        },

        onRouterError: function(ev: any): void {},

        onRouterMessage: function(ev: MessageEvent): void {
            if (typeof ev.data == "string") {
                this.totalLength += ev.data.length;
            }

            this.processMessage(ev.data);
        },

        onFacilityOpen: function(ev: any): void {
            if (this.sockets.facility == null) {
                throw `sockets.facility is null`;
            }

            console.log(`facility socket connected`);

            const msg: object = {
                service: "event",
                action: "subscribe",
                characters: ["all"],
                worlds: [this.settings.serverID],
                eventNames: [
                    "PlayerFacilityCapture",
                    "PlayerFacilityDefend"
                ],
                logicalAndCharactersWithWorlds: true
            };

            this.sockets.facility.send(JSON.stringify(msg));
        },

        onFacilityMessage: function(ev: MessageEvent): void {
            if (typeof ev.data == "string") {
                this.totalLength += ev.data.length;
            }

            this.processMessage(ev.data);
        }
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

        totalBytes: function(): string {
            if (this.totalLength < 1024) {
                return `${this.totalLength} bytes`;
            }
            if (this.totalLength < 1024 * 1024) {
                return `${(this.totalLength / 1024).toFixed(2)} KiB`;
            }
            if (this.totalLength < 1024 * 1024 * 1024) {
                return `${(this.totalLength / (1024 * 1024)).toFixed(2)} MiB`;
            }
            return `${this.totalLength} bytes`;
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
