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

import Core, {
    ApiResponse,
    WinterReportGenerator, WinterReport, WinterReportParameters, WinterReportSettings,
    IndividualReporter, Report, ReportParameters,
    OutfitReport, OutfitReportGenerator, OutfitReportSettings,
    FightReport, FightReportParameters, FightReportGenerator, FightReportEntry,
    TrackedPlayer,
    CoreSettings,
    Squad,
    Playback, Logger,
    CharacterAPI,
    Weapon, WeaponAPI,
    Facility, FacilityAPI,
    TEvent,
    PsEvent, PsEventType, PsEvents
} from "tcore";

import { PersonalReportGenerator } from "PersonalReportGenerator";

import { SquadAddon } from "addons/SquadAddon";
import { StorageHelper } from "Storage";
import { LoggerMetadata, LoggerMetadataLevel } from "LoggerMetadata";
import * as log from "loglevel";

(window as any).CharacterAPI = CharacterAPI;
(window as any).Playback = Playback;
(window as any).Logger = Logger;
(window as any).PsEvent = PsEvent;
(window as any).moment = moment;

(window as any).$ = $;

export const vm = new Vue({
    el: "#app" as string,

    data: {
        coreObject: null as (Core | null),

        view: "setup" as "setup" | "realtime" | "ops" | "killfeed" | "winter" | "example" | "battle",

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

        // Field related to filtering or adding data
        parameters: {
            outfitTag: "" as string,
            playerName: "" as string,

            autoStartTime: "" as string,
            validStartTime: true as boolean,
            startTimerID: -1 as number,
            startTimeLeft: 0 as number,

            report: "" as string,
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

        battleReport: new FightReport() as FightReport,

        outfitReport: new OutfitReport() as OutfitReport,
        opsReportSettings: new OutfitReportSettings() as OutfitReportSettings,
        outfitReportResponse: null as ApiResponse<OutfitReport> | null,

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
            const settings: CoreSettings | null = StorageHelper.getSettings();

            if (settings != null) {
                this.settings.darkMode = settings.darkMode;
                this.settings.serverID = settings.serverID;
                this.settings.serviceToken = settings.serviceID;
                this.settings.debug = settings.debug;

                this.settings.fromStorage = true;

                this.connect();
            }

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

            for (let i = 0; i < input.files.length; ++ i) {
                const file = input.files[i];
                Playback.loadFile(file).ok(() => {
                    Playback.start({ speed: 0.0 });
                });
            }
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

        exportOpsReport: function(): void {
            this.generateOutfitReport().ok(() => {
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
            const response = new ApiResponse<unknown>(axios.default.get(`/test-data/2020-12-12-T1DE.json`)).ok((data: unknown) => {
                const type = typeof(data);

                Playback.setCore(this.core);
                if (type == "string") {
                    Playback.loadFile(data as string).ok(() => {
                        Playback.start({ speed: 0 });
                    });
                } else if (type == "object") {
                    Playback.loadFile(JSON.stringify(data)).ok(() => {
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

        generateReport: function(): void {
            if (this.parameters.report == "ops") {
                this.generateOutfitReport().ok(() => {
                    $("#report-modal").modal("hide");
                    this.parameters.report = "";
                    console.log(`Report generated`);
                });
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
                $("#report-modal").modal("hide");
                this.parameters.report = "";
            }
        },

        generateOutfitReport: function(): ApiResponse {
            const response: ApiResponse = new ApiResponse();

            let events: TEvent[] = [];

            this.core.stats.forEach((player: TrackedPlayer, charID: string) => {
                events.push(...player.events);
            });

            events.push(...this.core.miscEvents);

            events = events.sort((a, b) => a.timestamp - b.timestamp);

            const outfitResponse: ApiResponse<OutfitReport> = OutfitReportGenerator.generate({
                settings: {
                    zoneID: null,
                    showSquadStats: this.opsReportSettings.showSquadStats
                },
                captures: this.core.captures,
                playerCaptures: this.core.playerCaptures,
                players: this.core.stats,
                outfits: this.core.outfits.map(iter => iter.ID),
                events: events,
                tracking: this.core.tracking,
                squads: {
                    perm: this.core.squad.perm,
                    guesses: this.core.squad.guesses
                }
            });

            this.outfitReportResponse = outfitResponse;
            console.log(`Have ${this.outfitReportResponse.getSteps().length} steps to complete`);

            outfitResponse.ok((data: OutfitReport) => { 
                this.outfitReport = data;
                this.view = "ops";
                response.resolveOk();
                this.outfitReportResponse = null;
            });

            return response;
        },

        generateBattleReport: function(): void {
            const params: FightReportParameters = new FightReportParameters();

            this.core.stats.forEach((player: TrackedPlayer, charID: string) => {
                if (player.events.length == 0) { return; }

                params.events.push(...player.events);
            });
            
            params.events.push(...this.core.miscEvents);
            params.events.push(...this.core.playerCaptures);
            params.events = params.events.sort((a, b) => a.timestamp - b.timestamp);

            params.players = this.core.stats;

            FightReportGenerator.generate(params).ok((data: FightReport) => {
                this.battleReport = data;
                this.view = "battle";
            });
        },

        generateWinterReport: function(): void {
            const playerNames: string[] = this.winter.ignoredPlayers.split(" ")
                .map(iter => iter.toLowerCase());

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
            WinterReportGenerator.generate(params).ok((data: WinterReport) => {
                this.winter.report = Loadable.loaded(data);
                this.view = "winter";
            });
        },

        generatePersonalReport: function(charID: string): void {
            let opsLeft: number = 2;

            let html: string = "";
            let report: Report = new Report();

            const personalTemplate = PersonalReportGenerator.getTemplate().ok((type: string) => {
                html = type;
                if (--opsLeft == 0) {
                    done();
                } else {
                    console.log(`Template loaded, waiting on player report`);
                }
            }).always(() => {
                console.log(`Report return ${personalTemplate.status}`);
            });

            this.generatePlayerReport(charID).ok((data: Report) => {
                report = data;
                console.log(`Made report: ${JSON.stringify(report.playerVersus)}`);
                if (--opsLeft == 0) {
                    done(); 
                } else {
                    console.log(`Report loaded, waiting on template`);
                }
            });

            const done = () => {
                const str: string = PersonalReportGenerator.generate(html, report);
                console.log(`Saving report for ${charID}`);

                FileSaver.saveAs(new File([str], `topt-${report.player?.name}.html`, { type: "text/html" }))
            };
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

        addOutfit: function(): void {
            if (this.parameters.outfitTag.trim().length == 0) {
                return;
            }

            if (["fooi", "fiji", "g0bs"].indexOf(this.parameters.outfitTag.toLowerCase()) > -1) {
                this.showFrog = true;
            }

            this.loadingOutfit = true;
            this.core.addOutfit(this.parameters.outfitTag).ok(() => {
                console.log(`Loaded ${this.parameters.outfitTag}`);
                this.loadingOutfit = false;
                this.parameters.outfitTag = "";
            });
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
                const logger: log.Logger = Logger.getLogger(loggerName);

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

        updateLogger: function(name: string, mod: (logger: log.Logger) => void): void {
            const logger: log.Logger = Logger.getLogger(name);

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
        },

        "settings.darkMode": function(): void {
            Chart.defaults.global.defaultFontColor = (this.settings.darkMode == true) ? "#CCCCCC" : "#666";
            console.log(`Default color is now: ${Chart.defaults.global.defaultFontColor}`);
        }
    }
});
(window as any).vm = vm;
