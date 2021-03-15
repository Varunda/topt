import "popper.js"
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";

import Vue, { PropType } from "vue";

import { Loading, Loadable } from "Loadable";

import * as moment from "moment";
import * as $ from "jquery";
import * as JSZip from "jszip";
import * as axios from "axios";

// @ts-ignore
import * as FileSaver from "../node_modules/file-saver/dist/FileSaver.js";

import { Chart } from "chart.js";

// @ts-ignore
import ChartDataLabels from "../node_modules/chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.js";
Chart.plugins.unregister(ChartDataLabels);

// @ts-ignore
import "../node_modules/chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js";

import "BreakdownList";
import "BreakdownChart";
import "BreakdownInterval";
import "BreakdownBox";
import "BreakdownBar";
import "MomentFilter";
import "KillfeedSquad";
import "FightReportTop";
import "VehicleVersusEntry";
import "RelicImage";

import Core, {
    ApiResponse,
    WinterReportGenerator, WinterReport, WinterReportParameters, WinterReportSettings,
    IndividualReporter, Report, ReportParameters,
    OutfitReport, OutfitReportGenerator, OutfitReportSettings,
    FightReport, FightReportParameters, FightReportGenerator, FightReportEntry,
    DesoReport, DesoReportParameters, DesoReportGenerator,
    ProgressCallback, ProgressNotification, ProgressSteps, ProgressUpdate,
    TrackedPlayer,
    CoreSettings,
    Squad,
    Playback, Logger,
    Character, CharacterAPI,
    Weapon, WeaponAPI,
    Region, MapAPI,
    Facility, FacilityAPI,
    TEvent, TBaseEvent,
    PsEvent, PsEventType, PsEvents
} from "tcore";

import { PersonalReportGenerator } from "PersonalReportGenerator";

import { SquadAddon } from "addons/SquadAddon";
import { StorageHelper } from "Storage";
import { LoggerMetadata, LoggerMetadataLevel } from "LoggerMetadata";
import * as loglevel from "loglevel";
import { map, param } from "jquery";
import { OutfitReportParameters, TDeathEvent, TExpEvent, TKillEvent, TVehicleKillEvent, Vehicle, Vehicles } from "../../topt-core/build/core/index.js";

(window as any).CharacterAPI = CharacterAPI;
(window as any).Playback = Playback;
(window as any).Logger = Logger;
(window as any).PsEvent = PsEvent;
(window as any).moment = moment;
(window as any).$ = $;

const log = Logger.getLogger("UI");
log.enableAll();

type Relic = {
    regionID: string;
    faction: string;
    cutoff: boolean;
    adjacent: string[];
}

const RELIC_A_ID: string = "6101"; // Kwahtee
const RELIC_B_ID: string = "6102"; // Ikanam Bio
const RELIC_C_ID: string = "6111"; // Sungrey
const RELIC_D_ID: string = "6113"; // Onatha
const RELIC_E_ID: string = "6123"; // Xelas
const RELIC_F_ID: string = "6121"; // Wokuk
const RELIC_G_ID: string = "6205"; // Bastion
const RELIC_H_ID: string = "6204"; // Crux HQ
const RELIC_I_ID: string = "6206"; // AFC
const RELIC_N_WG_ID: string = "6001";
const RELIC_SW_WG_ID: string = "6003";
const RELIC_SE_WG_ID: string = "6002";

const RELIC_A_REGION: string = "204000";
const RELIC_B_REGION: string = "205000";
const RELIC_C_REGION: string = "207000";
const RELIC_D_REGION: string = "209000";
const RELIC_E_REGION: string = "212000";
const RELIC_F_REGION: string = "210001";
const RELIC_G_REGION: string = "217000";
const RELIC_H_REGION: string = "216000";
const RELIC_I_REGION: string = "218000";

/*
const RELIC_A_ID: string = "18221";
const RELIC_B_ID: string = "18222";
const RELIC_C_ID: string = "18224";
const RELIC_D_ID: string = "18225";
const RELIC_E_ID: string = "18226";
const RELIC_F_ID: string = "18227";
const RELIC_G_ID: string = "18228";
const RELIC_H_ID: string = "18229";
const RELIC_I_ID: string = "18230";
const RELIC_N_WG_ID: string = "18215";
const RELIC_SE_WG_ID: string = "18217";
const RELIC_SW_WG_ID: string = "18216";

const RELIC_A_REGION: string = "400284";
const RELIC_B_REGION: string = "400285";
const RELIC_C_REGION: string = "400287";
const RELIC_D_REGION: string = "400288";
const RELIC_E_REGION: string = "400289";
const RELIC_F_REGION: string = "400290";
const RELIC_G_REGION: string = "400291";
const RELIC_H_REGION: string = "400292";
const RELIC_I_REGION: string = "400293";
*/

const facilityToRegion: Map<string, string> = new Map([
    [RELIC_A_REGION, RELIC_A_ID],
    [RELIC_B_REGION, RELIC_B_ID],
    [RELIC_C_REGION, RELIC_C_ID],
    [RELIC_D_REGION, RELIC_D_ID],
    [RELIC_E_REGION, RELIC_E_ID],
    [RELIC_F_REGION, RELIC_F_ID],
    [RELIC_G_REGION, RELIC_G_ID],
    [RELIC_H_REGION, RELIC_H_ID],
    [RELIC_I_REGION, RELIC_I_ID],
]);

class DesoOutfit {
    public tag: string = "";
    public count: number = 0;

    public kills: number = 0;
    public deaths: number = 0;
    public revives: number = 0;

    public armorKills: number = 0;
    public airKills: number = 0;

    public sundySpawns: number = 0;
    public constructionSpawns: number = 0;
    public squadSpawns: number = 0;
    public beaconSpawns: number = 0;
};

export const vm = new Vue({
    el: "#app" as string,

    data: {
        coreObject: null as (Core | null),

        view: "setup" as "setup" | "realtime" | "ops" | "killfeed" | "winter" | "example" | "battle" | "deso" | "map",

        // Field related to settings about how TOPT runs
        settings: {
            serviceToken: "" as string,
            updateRate: 1 as number,
            eventType: "general" as PsEventType,
            sortColumn: "name" as string,

            fromStorage: false as boolean,
            serverID: "1" as string,
            darkMode: false as boolean,
            debug: false as boolean
        },

        relic: {
            connected: true as boolean,
            zoneID: "" as string,
            serverID: "" as string,

            showUI: true as boolean,

            warnings: {
                badZone: false as boolean,
            },

            tr_stats: new DesoOutfit() as DesoOutfit,
            nc_stats: new DesoOutfit() as DesoOutfit,
            vs_stats: new DesoOutfit() as DesoOutfit,

            outfits: {
                tr: "" as string,
                nc: "" as string,
                vs: "" as string
            },

            vs_rate: 0 as number,
            nc_rate: 0 as number,
            tr_rate: 0 as number,

            N_WG: RELIC_N_WG_ID,
            SE_WG: RELIC_SE_WG_ID,
            SW_WG: RELIC_SW_WG_ID,

            A: RELIC_A_ID,
            B: RELIC_B_ID,
            C: RELIC_C_ID,
            D: RELIC_D_ID,
            E: RELIC_E_ID,
            F: RELIC_F_ID,
            G: RELIC_G_ID,
            H: RELIC_H_ID,
            I: RELIC_I_ID,

            regions: new Map([
                [RELIC_A_ID, { regionID: RELIC_A_ID, faction: "", cutoff: false, adjacent: [RELIC_F_ID, RELIC_G_ID, RELIC_N_WG_ID] }],
                [RELIC_B_ID, { regionID: RELIC_B_ID, faction: "", cutoff: false, adjacent: [RELIC_H_ID, RELIC_C_ID, RELIC_N_WG_ID] }],
                [RELIC_C_ID, { regionID: RELIC_C_ID, faction: "", cutoff: false, adjacent: [RELIC_B_ID, RELIC_G_ID, RELIC_SE_WG_ID] }],
                [RELIC_D_ID, { regionID: RELIC_D_ID, faction: "", cutoff: false, adjacent: [RELIC_I_ID, RELIC_E_ID, RELIC_SE_WG_ID] }],
                [RELIC_E_ID, { regionID: RELIC_E_ID, faction: "", cutoff: false, adjacent: [RELIC_I_ID, RELIC_D_ID, RELIC_SW_WG_ID] }],
                [RELIC_F_ID, { regionID: RELIC_F_ID, faction: "", cutoff: false, adjacent: [RELIC_A_ID, RELIC_G_ID, RELIC_SW_WG_ID] }],
                [RELIC_G_ID, { regionID: RELIC_G_ID, faction: "", cutoff: false, adjacent: [RELIC_A_ID, RELIC_F_ID, RELIC_H_ID, RELIC_I_ID] }],
                [RELIC_H_ID, { regionID: RELIC_H_ID, faction: "", cutoff: false, adjacent: [RELIC_B_ID, RELIC_C_ID, RELIC_G_ID, RELIC_I_ID] }],
                [RELIC_I_ID, { regionID: RELIC_I_ID, faction: "", cutoff: false, adjacent: [RELIC_E_ID, RELIC_D_ID, RELIC_G_ID, RELIC_H_ID] }],
                [RELIC_N_WG_ID, { regionID: RELIC_N_WG_ID, faction: "", cutoff: false, adjacent: [] }],
                [RELIC_SE_WG_ID, { regionID: RELIC_SE_WG_ID, faction: "", cutoff: false, adjacent: [] }],
                [RELIC_SW_WG_ID, { regionID: RELIC_SW_WG_ID, faction: "", cutoff: false, adjacent: [] }]
            ]) as Map<string, Relic>,
        },

        // Field related to filtering or adding data
        parameters: {
            outfitTag: "" as string,
            playerName: "" as string,

            autoStartTime: "" as string,
            validStartTime: true as boolean,
            startTimerID: -1 as number,
            startTimeLeft: 0 as number,

            report: "" as string,

            squadForReport: null as number | null
        },

        storage: {
            enabled: false as boolean,
        },

        generation: {
            names: [] as string[],
            state: [] as string[]
        },

        squad: {
            perm: [] as Squad[],
            guesses: [] as Squad[],
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

            ignoredPlayers: "" as string
        },

        deso: {
            report: Loadable.idle() as Loading<DesoReport>
        },

        battle: {
            report: Loadable.idle() as Loading<FightReport>
        },

        outfit: {
            report: Loadable.idle() as Loading<OutfitReport>,
            steps: [] as {name: string, state: string}[]
        },

        battleReport: new FightReport() as FightReport,

        outfitReport: new OutfitReport() as OutfitReport,
        opsReportSettings: new OutfitReportSettings() as OutfitReportSettings,

        refreshIntervalID: -1 as number, // ID of the timed interval to refresh the realtime view

        loadingOutfit: false as boolean,

        loggers: [] as LoggerMetadata[],

        showFrog: false as boolean,

        display: [] as TrackedPlayer[] // The currently displayed stats
    },

    created: function(): void {
        this.refreshIntervalID = setInterval(this.updateDisplay, this.settings.updateRate * 1000) as unknown as number;

        this.storage.enabled = StorageHelper.isEnabled();

        new ApiResponse<Weapon[]>(axios.default.get(`/data/weapons.json`)).ok((data: Weapon[]) => {
            console.log(`Loaded ${data.length} weapons`);
            WeaponAPI.setCache(data);
        });

        new ApiResponse<Facility[]>(axios.default.get(`/data/bases.json`)).ok((data: Facility[]) => {
            console.log(`Loaded ${data.length} facilities`);
            FacilityAPI.setCache(data);
        });

        this.settings.fromStorage = false;

        if (this.storage.enabled == true) {
            const loggerMeta: LoggerMetadata[] | null = StorageHelper.getLoggers();
            if (loggerMeta != null) {
                const existingLoggers: string[] = Logger.getLoggerNames();

                for (const meta of loggerMeta) {
                    if (existingLoggers.indexOf(meta.name) > -1) {
                        Logger.getLogger(meta.name).setLevel(meta.level);
                        console.log(`Loaded logger ${meta.name} to ${meta.level}`);
                    } else {
                        console.warn(`Logger ${meta.name} does not exist`);
                    }
                }

                this.updateLoggers();
            }
        }
    },

    mounted: function(): void {
        // Confirm exiting the page
        window.onbeforeunload = (ev: BeforeUnloadEvent) => { return false; };

        // Disconnect to be polite
        window.onunload = () => { this.core.disconnect(); }

        document.addEventListener("keyup", this.squadKeyEvent);

        this.settings.fromStorage = false;

        const params: URLSearchParams = new URLSearchParams(location.search);
        const showMap: string | null = params.get("deso");
        const serverID: string | null = params.get("serverID");
        const zoneID: string | null = params.get("zoneID");

        if (showMap && serverID && zoneID) {
            this.relic.showUI = false;
            this.relic.zoneID = zoneID;
            this.relic.serverID = serverID;

            const vsTag: string | null = params.get("vs_tag");
            if (vsTag) { this.relic.outfits.vs = vsTag; }

            const ncTag: string | null = params.get("nc_tag");
            if (ncTag) { this.relic.outfits.nc = ncTag; }

            const trTag: string | null = params.get("tr_tag");
            if (trTag) { this.relic.outfits.tr = trTag; }

            this.startMap();
        } else {
            if (this.storage.enabled == true) {
                const settings: CoreSettings | null = StorageHelper.getSettings();

                if (settings != null) {
                    this.settings.darkMode = settings.darkMode;
                    this.settings.serverID = settings.serverID;
                    this.settings.serviceToken = settings.serviceID;
                    this.settings.debug = settings.debug;

                    this.settings.fromStorage = true;

                    this.connect();
                }
            }
        }
    },

    methods: {
        connect: function(): void {
            if (this.canConnect == false) {
                return console.warn(`Cannot connect: service ID is empty`);
            }

            if (this.coreObject != null) {
                this.coreObject.disconnect();
                this.coreObject = null;
            }

            this.coreObject = new Core(this.settings.serviceToken, this.settings.serverID);
            this.coreObject.connect().ok(() => {
                this.view = "realtime";
            });
        },

        startMap: function(): void {
            if (this.coreObject != null) {
                this.coreObject.disconnect();
                this.coreObject = null;
            }

            this.settings.darkMode = true;

            this.coreObject = new Core("asdf", this.settings.serverID);
            this.coreObject.connect().ok(() => {
                this.view = "map";

                this.core.start();

                if (this.relic.outfits.vs != "") {
                    this.core.addOutfit(this.relic.outfits.vs);
                }
                if (this.relic.outfits.nc != "") {
                    this.core.addOutfit(this.relic.outfits.nc);
                }
                if (this.relic.outfits.tr != "") {
                    this.core.addOutfit(this.relic.outfits.tr);
                }

                setTimeout(() => {
                    this.core.subscribe({
                        worlds: [ "all" ],
                        events: [ "FacilityControl" ],
                        socket: "tracked"
                    });
                }, 1000);

                this.core.on("kill", (ev: TKillEvent) => {
                    if (ev.zoneID != this.relic.zoneID) { return; }

                    const char: Character | undefined = this.core.characters.find(i => i.ID == ev.sourceID);
                    if (!char) { return; }

                    if (char.faction == "1") {
                        ++this.relic.vs_stats.kills;
                    } else if (char.faction == "2") {
                        ++this.relic.nc_stats.kills;
                    } else if (char.faction == "3") {
                        ++this.relic.tr_stats.kills;
                    }
                });

                this.core.on("death", (ev: TDeathEvent) => {
                    if (ev.zoneID != this.relic.zoneID) { return; }

                    const char: Character | undefined = this.core.characters.find(i => i.ID == ev.sourceID);
                    if (!char) { return; }

                    if (char.faction == "1") {
                        ++this.relic.vs_stats.deaths;
                    } else if (char.faction == "2") {
                        ++this.relic.nc_stats.deaths;
                    } else if (char.faction == "3") {
                        ++this.relic.tr_stats.deaths;
                    }
                });

                this.core.on("exp", (ev: TExpEvent) => {
                    if (ev.zoneID != this.relic.zoneID) { return; }

                    const char: Character | undefined = this.core.characters.find(i => i.ID == ev.sourceID);
                    if (!char) { return; }

                    let stats: DesoOutfit;

                    if (char.faction == "1") {
                        stats = this.relic.vs_stats;
                    } else if (char.faction == "2") {
                        stats = this.relic.nc_stats;
                    } else if (char.faction == "3") {
                        stats = this.relic.tr_stats;
                    } else {
                        return;
                    }

                    if (ev.expID == PsEvent.revive || ev.expID == PsEvent.squadRevive) {
                        ++stats.revives;
                    } else if (ev.expID == PsEvent.sundySpawn) {
                        ++stats.sundySpawns;
                    } else if (ev.expID == PsEvent.squadSpawn) {
                        ++stats.beaconSpawns;
                    } else if (ev.expID == PsEvent.constructionSpawn) {
                        ++stats.constructionSpawns;
                    } else if (ev.expID == "355") {
                        ++stats.squadSpawns;
                    }
                });

                this.core.on("vehicle", (ev: TVehicleKillEvent) => {
                    const char: Character | undefined = this.core.characters.find(i => i.ID == ev.sourceID);
                    if (!char) { return; }

                    let stats: DesoOutfit;

                    if (char.faction == "1") {
                        stats = this.relic.vs_stats;
                    } else if (char.faction == "2") {
                        stats = this.relic.nc_stats;
                    } else if (char.faction == "3") {
                        stats = this.relic.tr_stats;
                    } else {
                        return;
                    }

                    if (ev.targetID != "0") {

                    }

                    if (ev.vehicleID == Vehicles.mosquito || ev.vehicleID == Vehicles.reaver || ev.vehicleID == Vehicles.scythe
                        || ev.vehicleID == Vehicles.valkyrie || ev.vehicleID == Vehicles.galaxy || ev.vehicleID == Vehicles.liberator) {
                        
                        ++stats.airKills;
                    } else if (ev.vehicleID == Vehicles.lightning
                        || ev.vehicleID == Vehicles.vanguard || ev.vehicleID == Vehicles.magrider || ev.vehicleID == Vehicles.prowler
                        || ev.vehicleID == Vehicles.flash || ev.vehicleID == Vehicles.harasser) {

                        ++stats.armorKills;
                    }
                });

                this.core.on("base", (ev: TBaseEvent) => {
                    if (this.relic.zoneID == "" || this.relic.serverID == "") {
                        return;
                    }

                    if (ev.zoneID != this.relic.zoneID || ev.worldID != this.relic.serverID) {
                        return;
                    }

                    const regionID: string = facilityToRegion.get(ev.facilityID) ?? ev.facilityID;

                    if (this.relic.regions.has(regionID)) {
                        const region: Relic = this.relic.regions.get(regionID)!;
                        region.faction = this.getFactionName(ev.factionID);
                        log.debug(`${region.regionID} captured by ${ev.factionID}`);
                        this.updateDesoMap();
                    }
                });
            });

            setInterval(async () => {
                this.refreshDesoMap();
            }, 5000);
        },

        copyDesoUrl: function(): void {
            const elem: any = document.getElementById("deso_setup_url");
            if (!elem) {
                return;
            }

            elem.select();
            if (document.execCommand("copy") == false) {
                log.warn(`failed to copy URL`);
            }
            window.getSelection()?.removeAllRanges();
        },

        validateStartTime: function(ev: InputEvent): void {
            const value: string = (ev.target as any).value;

            clearInterval(this.parameters.startTimerID);

            if (!value || value.trim().length == 0) {
                console.log(`Canceling start timer`);
                this.parameters.validStartTime = true;
                return;
            }

            if (value.match(/^\d{2}:\d{2}$/)) {
                console.log(`Valid value: ${value}`);
                this.parameters.validStartTime = true;
            } else {
                this.parameters.validStartTime = false;
                return;
            }

            const now: Date = new Date();
            const current: moment.Moment = moment(now).local();

            const monthPart: string = String(`${now.getMonth() + 1}`).padStart(2, "0");
            const dayPart: string = String(`${now.getDate()}`).padStart(2, "0");

            const timeString: string = `${now.getFullYear()}-${monthPart}-${dayPart}T${value}:00`;
            console.log(timeString);
            const when: moment.Moment = moment(timeString).local();

            const diff: number = when.diff(current, "seconds");
            console.log(`Timer set for ${diff} seconds`);

            this.parameters.startTimeLeft = diff;

            this.parameters.startTimerID = setInterval(this.timerCountdown, 1000) as unknown as number;
        },

        timerCountdown: function(): void {
            if (this.parameters.startTimeLeft <= 0) {
                this.setSaveEvents(true);
                clearInterval(this.parameters.startTimerID);
            } else {
                --this.parameters.startTimeLeft;
            }
        },

        refreshDesoMap: async function(): Promise<void> {
            if (this.relic.zoneID == "" || this.relic.serverID == "") {
                log.debug(`zoneID ${this.relic.zoneID} or serverID ${this.relic.serverID} is blank`);
                return;
            }
            const regions: Region[] = await MapAPI.getMap(this.relic.serverID, this.relic.zoneID);

            if (regions.length == 0) {
                this.relic.warnings.badZone = true;
                return;
            }

            this.relic.warnings.badZone = false;

            for (const map of regions) {
                if (this.relic.regions.has(map.regionID)) {
                    const region: Relic = this.relic.regions.get(map.regionID)!;
                    region.faction = this.getFactionName(map.factionID);
                }
            }

            this.updateDesoMap();
        },

        updateDesoMap: function(): void {
            this.relic.vs_rate = 0;
            this.relic.nc_rate = 0;
            this.relic.tr_rate = 0;

            this.relic.regions.forEach((relic: Relic, regionID: string) => {
                if (relic.adjacent.length == 0) { // Skip warpgate bases
                    return;
                }

                const queue: string[] = [];
                queue.push(regionID);
                const visited: string[] = [];

                let iterFallback: number = 0;

                let cutoff: boolean = true;
                let iter: string | undefined =  queue.shift();
                //log.debug(`Checking cutoff of ${regionID}:`);
                while (iter != undefined) {
                    const ir: Relic | undefined = this.relic.regions.get(iter);
                    if (ir == undefined) {
                        throw `Relic ${iter} must exist`;
                    }

                    if (iterFallback > 100) {
                        log.error(`Failed to find valid connection within 100 iterations, breaking`);
                        break;
                    }

                    //log.debug(`\tProcessing region ${iter}`);

                    if (ir.adjacent.length == 0) {
                        //log.debug(`\t${ir.regionID} is a warpgate, is connected`);
                        cutoff = false;
                        break;
                    }

                    for (const adj of ir.adjacent) {
                        const adjR: Relic | undefined = this.relic.regions.get(adj);
                        if (adjR == undefined) {
                            throw `Adjacent relic ${adj} must exist`;
                        }
                        if (adjR.faction != relic.faction) {
                            //log.debug(`\tNot adding adjacent ${adjR.regionID}, different faction ID`);
                            continue;
                        }

                        if (visited.find(iter => iter == adj) == null) {
                            //log.debug(`\tAdding new region to check: ${adj}`);
                            queue.push(adj);
                        } else {
                            //log.debug(`\tSkipping ${adj}, already visited`);
                        }
                        visited.push(adj);
                    }

                    ++iterFallback;

                    iter = queue.shift();
                }

                relic.cutoff = cutoff;

                if (relic.cutoff == true) {
                    return;
                }

                if (relic.faction == "VS") {
                    this.relic.vs_rate += 6;
                } else if (relic.faction == "NC") {
                    this.relic.nc_rate += 6;
                } else if (relic.faction == "TR") {
                    this.relic.tr_rate += 6;
                }
            });

            this.$forceUpdate();
            for (const child of this.$children) {
                child.$forceUpdate();
            }
        },

        getFactionName: function(factionID: string): string {
            if (factionID == "1") {
                return "VS";
            } else if (factionID == "2") {
                return "NC";
            } else if (factionID == "3") {
                return "TR";
            }
            return "";
        },

        importData: function(): void {
            const elem: HTMLElement | null = document.getElementById("data-import-input");
            if (elem == null) {
                throw `Missing #data-import-input element to import data`;
            }

            const input: HTMLInputElement = elem as HTMLInputElement;
            if (input.files == null) {
                throw `Input is not type of 'file'`;
            }

            if (input.files.length == 0) {
                return console.warn(`Cannot import data, no file selected`);
            }

            Playback.setCore(this.core);
            log.info(`loading ${input.files.length} files`);

            for (let i = 0; i < input.files.length; ++ i) {
                const file = input.files[i];
                Playback.loadFile(file).then(() => {
                    log.debug(`Playing back ${file.name}`);
                    Playback.start({ speed: 0.0 });
                });
            }
        },

        exportData: function(): void {
            log.debug(`Including ${CharacterAPI.getCache().length} cached characters in export`);

            const json: object = {
                version: "1" as string,
                events: this.core.rawData,
                players: this.core.characters,
                outfits: this.core.outfits,
                characters: CharacterAPI.getCache()
            };

            const file = new File([JSON.stringify(json)], "data.json", { type: "text/json" });

            FileSaver.saveAs(file);
        },

        exportOpsReport: function(): void {
            this.generateOutfitReport().then(() => {
                const json: string = JSON.stringify(this.outfitReport, null, 2);
                const file = new File([json], "report.json", { type: "text/json" });

                FileSaver.saveAs(file);
            });
        },

        saveSettings: function(): void {
            if (this.storage.enabled == false) {
                return;
            }

            const settings: CoreSettings = {
                serviceID: this.settings.serviceToken,
                serverID: this.settings.serverID,
                darkMode: this.settings.darkMode,
                debug: this.settings.debug
            };

            StorageHelper.setSettings(settings);

            this.connect();
        },

        clearSettings: function(): void {
            if (this.storage.enabled == false) {
                return;
            }

            StorageHelper.setSettings(null);
        },

        debugLoadfile: function(reportType?: string): void {
            const response = new ApiResponse<unknown>(axios.default.get(`/test-data/OW3-DPSO.json`)).ok((data: unknown) => {
                const type = typeof(data);

                Playback.setCore(this.core);
                if (type == "string") {
                    Playback.loadFile(data as string).then(() => {
                        Playback.start({ speed: 0 });

                        if (reportType != undefined) {
                            this.parameters.report = reportType;
                            this.generateReport();
                        }
                    });
                } else if (type == "object") {
                    Playback.loadFile(JSON.stringify(data)).then(() => {
                        Playback.start({ speed: 0 });

                        if (reportType != undefined) {
                            this.parameters.report = reportType;
                            this.generateReport();
                        }
                    });
                } else {
                    console.error(`Unknown type of data: ${typeof(data)}`);
                }
            }).always(() => {
                console.log(`Response resolved ${response.status}`);
            });
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
            this.squad = {
                perm: this.core.squad.perm,
                guesses: this.core.squad.guesses
            }
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

            const whatHovered = SquadAddon.getHovered();

            if (whatHovered == "squad" && SquadAddon.selectedSquadName != null) {
                const squad: Squad | null = this.core.getSquad(ev.key);
                if (squad == null) {
                    console.log(`Squad ${ev.key} does not exist`);
                    return;
                }

                const selectedSquad: Squad | null = this.core.getSquad(SquadAddon.selectedSquadName);
                if (selectedSquad == null) {
                    console.warn(`Failed to find squad ${SquadAddon.selectedSquadName}`);
                    return;
                }

                this.core.mergeSquads(squad, selectedSquad);
                this.updateDisplay();
            } else if (whatHovered == "member" && SquadAddon.selectedMemberID != null) {
                if (ev.key == "Delete") {
                    this.core.removeMemberFromSquad(SquadAddon.selectedMemberID);
                } else {
                    this.core.addMemberToSquad(SquadAddon.selectedMemberID, ev.key);
                }
                this.updateDisplay();
            } else {

            }
        },

        generateReport: async function(): Promise<void> {
            if (this.parameters.report == "ops") {
                await this.generateOutfitReport();
                $("#report-modal").modal("hide");
                this.parameters.report = "";
                console.log(`Report generated`);
            } else if (this.parameters.report == "winter") {
                this.generateWinterReport();
                $("#report-modal").modal("hide");
                this.parameters.report = "";
            } else if (this.parameters.report == "personal") {
                this.generateAllReports();
                $("#report-modal").modal("hide");
                this.parameters.report = "";
            } else if (this.parameters.report == "battle") {
                this.generateBattleReport();
            } else if (this.parameters.report == "deso") {
                this.generateDesoReport().then(() => {
                    $("#report-modal").modal("hide");
                    this.parameters.report = "";
                });
            }
        },

        generateOutfitReport: async function(): Promise<void> {
            let events: TEvent[] = [];

            this.core.stats.forEach((player: TrackedPlayer, charID: string) => {
                events.push(...player.events);
            });

            events.push(...this.core.miscEvents);

            events = events.sort((a, b) => a.timestamp - b.timestamp);

            let players: Map<string, TrackedPlayer> = this.core.stats;

            if (this.parameters.squadForReport != null) {
                const squad: Squad | null = this.core.getSquadByID(this.parameters.squadForReport);
                log.info(`Building outfit report with squad ID ${this.parameters.squadForReport}`);
                if (squad == null) {
                    log.error(`Failed to find squad ID ${this.parameters.squadForReport}`);
                } else {
                    log.debug(`Found squad ${squad.name}/#${squad.ID}. Members: ${squad.members.map(i => i.name).join(", ")}`);
                    players = new Map();
                    for (const player of squad.members) {
                        const entry: TrackedPlayer | undefined = this.core.stats.get(player.charID);
                        if (entry == undefined) {
                            log.warn(`Failed to find char ${player.name}/${player.charID} in squad ${squad.name}/${squad.ID}`);
                        } else {
                            players.set(player.charID, entry);
                        }
                    }
                }
            }

            const outfitReport: OutfitReport = await OutfitReportGenerator.generate({
                settings: {
                    zoneID: null,
                    showSquadStats: this.opsReportSettings.showSquadStats
                },
                captures: this.core.captures,
                playerCaptures: this.core.playerCaptures,
                players: players,
                outfits: this.core.outfits.map(iter => iter.ID),
                events: events,
                tracking: this.core.tracking,
                squads: {
                    perm: this.core.squad.perm,
                    guesses: this.core.squad.guesses
                }
            }, (ev: ProgressNotification) => {
                if (ev.type == "steps") {
                    log.info(`Steps: ${ev.steps.join(", ")}`);
                    this.outfit.steps = ev.steps.map(iter => {
                        return {
                            name: iter,
                            state: "pending"
                        };
                    });
                } else if (ev.type == "update") {
                    const step = this.outfit.steps.find(iter => iter.name == ev.step);
                    if (step) {
                        if (ev.state == "started") {
                            step.state = "In progress";
                        } else if (ev.state == "done") {
                            step.state = "Done";
                        } else if (ev.state == "errored") {
                            step.state = "Errored!";
                        }
                    }
                }
            });

            this.outfitReport = outfitReport;
            this.view = "ops";
        },

        generateBattleReport: async function(): Promise<void> {
            const params: FightReportParameters = new FightReportParameters();

            this.core.stats.forEach((player: TrackedPlayer, charID: string) => {
                if (player.events.length == 0) { return; }

                params.events.push(...player.events);
            });
            
            params.events.push(...this.core.miscEvents);
            params.events.push(...this.core.playerCaptures);
            params.events = params.events.sort((a, b) => a.timestamp - b.timestamp);

            params.players = this.core.stats;

            this.battleReport = await FightReportGenerator.generate(params);
            this.view = "battle";
        },

        generateWinterReport: async function(): Promise<void> {
            const playerNames: string[] = this.winter.ignoredPlayers.split(" ")
                .map(iter => iter.toLowerCase());

            if (this.parameters.squadForReport != null) {
                const squad: Squad | null = this.core.getSquadByID(this.parameters.squadForReport);
                if (squad == null) {
                    log.warn(`Failed to find squad #${this.parameters.squadForReport}`);
                } else {
                    for (const player of Array.from(this.core.stats.values())) {
                        const playerSquad = this.core.getSquadOfMember(player.characterID);
                        if (playerSquad == null || playerSquad.ID != squad.ID) {
                            playerNames.push(player.name.toLowerCase());
                        }
                    }
                }
            }

            const players: TrackedPlayer[] = Array.from(this.core.stats.values())
                .filter(iter => playerNames.indexOf(iter.name.toLowerCase()) == -1);

            console.log(`Making a winter report with: ${players.map(iter => iter.name).join(", ")}`);

            const params: WinterReportParameters = new WinterReportParameters();
            params.players = players;
            params.timeTracking = this.core.tracking;
            params.settings = this.winter.settings;

            this.core.stats.forEach((player: TrackedPlayer, charID: string) => {
                if (player.events.length == 0) { return; }
                if (playerNames.indexOf(player.name.toLowerCase()) != -1) { return; }

                params.events.push(...player.events);
            });

            this.winter.report = Loadable.loading();
            this.winter.report = Loadable.loaded(await WinterReportGenerator.generate(params));
            this.view = "winter";
        },

        generateDesoReport: async function(): Promise<void> {
            const params: DesoReportParameters = new DesoReportParameters();
            this.core.stats.forEach((player: TrackedPlayer, charID: string) => {
                if (player.events.length == 0) { return; }

                params.events.push(...player.events);
            });
            params.events.push(...this.core.miscEvents);

            params.npcs = [...this.core.npcs.all];
            params.players = [...Array.from(this.core.stats.values())];
            params.tracking = this.core.tracking;

            this.deso.report = Loadable.loading();
            this.deso.report = Loadable.loaded(await DesoReportGenerator.generate(params));
            this.view = "deso";
        },

        generatePersonalReport: async function(charID: string): Promise<void> {
            let html: string = await PersonalReportGenerator.getTemplate();
            let report: Report | null = await this.generatePlayerReport(charID);
            if (report == null) {
                return;
            }

            const str: string = PersonalReportGenerator.generate(html, report);
            console.log(`Saving report for ${charID}`);

            FileSaver.saveAs(new File([str], `topt-${report.player?.name}.html`, { type: "text/html" }))
        },

        generatePlayerReport: async function(charID: string): Promise<Report | null> {
            const player: TrackedPlayer | undefined = this.core.stats.get(charID);
            if (player == undefined) {
                return null;
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
                    tracking: { ...this.core.tracking },
                    routers: [ ...this.core.npcs.all.filter(iter => iter.type == "router") ]
                };

                return IndividualReporter.generatePersonalReport(parameters);
            }
        },

        generateAllReports: async function(): Promise<void> {
            let left: TrackedPlayer[] = [];
            this.core.stats.forEach((player: TrackedPlayer, charID: string) => {
                if (player.events.length > 0) {
                    left.push(player);
                }
            });

            let reports: Report[] = [];
            const html: string = await PersonalReportGenerator.getTemplate();

            this.generation.names = left.map(iter => iter.name);
            this.generation.state = left.map(iter => "Pending");

            $("#generation-modal").modal("show");

            for (const char of left) {
                const index: number = this.generation.names.findIndex(iter => iter == char.name);
                this.generation.state[index] = "Generating...";

                try {
                    const report: Report | null = await this.generatePlayerReport(char.characterID);
                    if (report != null) {
                        reports.push(report);
                    }
                    this.generation.state[index] = "Done";
                } catch {
                    this.generation.state[index] = "Error";
                }
            }

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
        },

        removeMostRecentPermSquad: function(): void {
            if (this.core.squad.perm.length == 1) {
                return;
            }

            const squad: Squad = this.core.squad.perm[this.core.squad.perm.length - 1];
            console.log(`Most recent perm squad is ${squad.name}`);

            this.core.removePermSquad(squad.name);

            this.updateKillfeedDisplay();
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
            }
        },

        addOutfit: async function(): Promise<void> {
            if (this.parameters.outfitTag.trim().length == 0) {
                return;
            }

            if (["fooi", "fiji", "g0bs"].indexOf(this.parameters.outfitTag.toLowerCase()) > -1) {
                this.showFrog = true;
            }

            this.loadingOutfit = true;
            await this.core.addOutfit(this.parameters.outfitTag);
            this.loadingOutfit = false;
            this.parameters.outfitTag = "";
        },

        addPlayer: function(): void {
            if (this.parameters.playerName.trim().length == 0) {
                return;
            }

            this.core.addPlayer(this.parameters.playerName);
        },

        updateLoggers: function(): void {
            const loggers: string[] = Logger.getLoggerNames();

            const levelLookup: Map<number, "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "SILENT"> = new Map([
                [0, "TRACE"],
                [1, "DEBUG"],
                [2, "INFO"],
                [3, "WARN"],
                [4, "ERROR"],
                [5, "SILENT"]
            ]);

            this.loggers = [];

            for (const loggerName of loggers) {
                const logger: loglevel.Logger = Logger.getLogger(loggerName);

                this.loggers.push({
                    name: loggerName,
                    level: levelLookup.get(logger.getLevel())!
                });
            }

            this.loggers.sort((a, b) => a.name.localeCompare(b.name));

            StorageHelper.setLoggers(this.loggers);
        },

        openLoggerModal: function(): void {
            this.updateLoggers();

            $("#logger-modal").modal("show");
        },

        updateLogger: function(name: string, mod: (logger: loglevel.Logger) => void): void {
            const logger: loglevel.Logger = Logger.getLogger(name);

            mod(logger);

            this.updateLoggers();
        },

        insertBattleStartMarker: function(): void {
            if (this.core.tracking.running == true) {
                this.core.addMarker("battle-start");
            }
        },

        insertBattleEndMarker: function(): void {
            if (this.core.tracking.running == true) {
                this.core.addMarker("battle-end");
            }
        },

        exportWeaponData: function(): void {
            const weapons: Weapon[] = WeaponAPI.getEntires();

            const lines: object[] = weapons.map((iter: Weapon) => {
                return {
                    item_id: iter.ID,
                    name: {
                        en: iter.name
                    },
                    category: {
                        name: {
                            en: iter.type
                        }
                    }
                };
            });

            FileSaver.saveAs(new File([JSON.stringify(lines, null, 2)], `weapons.json`, { type: "text/json"}));
        }
    },

    computed: {
        canConnect: function(): boolean {
            return this.settings.serviceToken.trim().length > 0
        },

        desoUrl: function(): string {
            //:value="'tide-op-tracker.ddns.net?deso=true&zoneID=' + relic.zoneID + '&serverID=' + relic.serverID">
            let url: string = `tide-op-tracker.ddns.net?deso=true&zoneID=${this.relic.zoneID}&serverID=${this.relic.serverID}`;
            if (this.relic.outfits.vs) {
                url += `&vs_tag=${this.relic.outfits.vs}`;
            }
            if (this.relic.outfits.nc) {
                url += `&nc_tag=${this.relic.outfits.nc}`;
            }
            if (this.relic.outfits.tr) {
                url += `&tr_tag=${this.relic.outfits.tr}`;
            }

            return url;
        },

        core: function(): Core {
            if (this.coreObject == null) {
                throw `Cannot get core, not connected`;
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
        },

        "settings.darkMode": function(): void {
            Chart.defaults.global.defaultFontColor = (this.settings.darkMode == true) ? "#CCCCCC" : "#666";
            console.log(`Default color is now: ${Chart.defaults.global.defaultFontColor}`);
        }
    }
});
(window as any).vm = vm;
(window as any).MapAPI = MapAPI;