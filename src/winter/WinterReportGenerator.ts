import { ApiResponse } from "census/ApiWrapper";
import { CharacterAPI, Character } from "census/CharacterAPI";

import { WinterReport } from "./WinterReport";
import { WinterMetric, WinterMetricEntry } from "./WinterMetric";
import { WinterReportParameters } from "./WinterReportParameters";

import StatMap from "StatMap";
import { PsEvent } from "PsEvent";
import { TrackedPlayer } from "InvididualGenerator";
import { VehicleTypes, Vehicle, VehicleAPI, Vehicles } from "census/VehicleAPI";

export class WinterMetricIndex {
    public static KILLS: number = 0;
    public static KD: number = 1;
    public static REVIVES: number = 2;
    public static HEALS: number = 3;
    public static RESUPPLIES: number = 4;
    public static REPAIRS: number = 5;

}

export class WinterReportGenerator {

    public static generate(parameters: WinterReportParameters): ApiResponse<WinterReport> {
        const response: ApiResponse<WinterReport> = new ApiResponse();

        const report: WinterReport = new WinterReport();
        report.start = new Date(parameters.events[0].timestamp);
        report.end = new Date(parameters.events[parameters.events.length - 1].timestamp);

        report.essential.length = 6;
        report.essential[WinterMetricIndex.KILLS] = this.kills(parameters);
        report.essential[WinterMetricIndex.KD] = this.kds(parameters);
        report.essential[WinterMetricIndex.HEALS] = this.heals(parameters);
        report.essential[WinterMetricIndex.REVIVES] = this.revives(parameters);
        report.essential[WinterMetricIndex.REPAIRS] = this.repairs(parameters);
        report.essential[WinterMetricIndex.RESUPPLIES] = this.resupplies(parameters);

        report.fun.push(this.mostRevived(parameters));
        report.fun.push(this.mostTransportAssists(parameters));
        report.fun.push(this.mostReconAssists(parameters));
        report.fun.push(this.mostConcAssists(parameters));
        report.fun.push(this.mostEMPAssist(parameters));
        report.fun.push(this.mostFlashAssists(parameters));
        report.fun.push(this.mostSaviors(parameters));
        report.fun.push(this.longestKillStreak(parameters));
        report.fun.push(this.highestHSR(parameters));
        report.fun.push(this.getDifferentWeapons(parameters));
        report.fun.push(this.mostESFSKills(parameters));
        report.fun.push(this.mostSunderersKilled(parameters));

        response.resolveOk(report);

        return response;
    }

    private static revives(parameters: WinterReportParameters): WinterMetric {
        return this.metric(parameters, [PsEvent.revive, PsEvent.squadResupply], {
            name: "Revives",
            funName: "Necromancer",
            description: "Players with the most revives",
            entries: []
        });
    }

    private static heals(parameters: WinterReportParameters): WinterMetric {
        return this.metric(parameters, [PsEvent.heal, PsEvent.squadHeal], {
            name: "Heals",
            funName: "Green Wizard",
            description: "Players with the most heals",
            entries: []
        });
    }

    private static repairs(parameters: WinterReportParameters): WinterMetric {
        return this.metric(parameters, [PsEvent.maxRepair, PsEvent.squadMaxRepair], {
            name: "MAX Repairs",
            funName: "Welder",
            description: "Players with the most repairs",
            entries: []
        });
    }

    private static resupplies(parameters: WinterReportParameters): WinterMetric {
        return this.metric(parameters, [PsEvent.resupply, PsEvent.squadResupply], {
            name: "Resupply",
            funName: "Ammo printer",
            description: "Players with the most resupplies",
            entries: []
        });
    }

    private static kills(parameters: WinterReportParameters): WinterMetric {
        return this.metric(parameters, [PsEvent.kill], {
            name: "Kills",
            funName: "Kills",
            description: "Players with the most kills",
            entries: []
        });
    }

    private static kds(parameters: WinterReportParameters): WinterMetric {
        const metric: WinterMetric = new WinterMetric();
        metric.name = "K/D";
        metric.funName = "K/D";
        metric.description = "Players with the highest K/D";

        const entries: StatMap = new StatMap();

        for (const player of parameters.players) {
            entries.set(player.name, player.stats.get(PsEvent.kill) / player.stats.get(PsEvent.death, 1));
        }

        metric.entries = this.statMapToEntires(parameters, entries, (value: number) => value.toFixed(2));

        return metric;
    }

    private static mostRevived(parameters: WinterReportParameters): WinterMetric {
        return this.metric(parameters, [PsEvent.revived], {
            name: "Revived",
            funName: "Zombie",
            description: "Players who were revived the most",
            entries: []
        });
    }

    private static mostTransportAssists(parameters: WinterReportParameters): WinterMetric {
        return this.metric(parameters, [PsEvent.transportAssists], {
            name: "Transport assists",
            funName: "Logistics Specialists",
            description: "Players with the most transport assists",
            entries: []
        });
    }

    private static mostReconAssists(parameters: WinterReportParameters): WinterMetric {
        return this.metric(parameters, [PsEvent.motionDetect, PsEvent.squadMotionDetect], {
            name: "Recon detections",
            funName: "Flies on the Wall",
            description: "Players with the most recon detection ticks",
            entries: []
        });
    }

    private static mostConcAssists(parameters: WinterReportParameters): WinterMetric {
        return this.metric(parameters, ["550", "551"], {
            name: "Conc assists",
            funName: "Concussive Maintenance",
            description: "Players with the most conc assists",
            entries: []
        });
    }

    private static mostFlashAssists(parameters: WinterReportParameters): WinterMetric {
        return this.metric(parameters, [PsEvent.flashAssist, PsEvent.squadFlashAssist], {
            name: "Flash assists",
            funName: "Flasher",
            description: "Players with the most flash assists",
            entries: []
        });
    }

    private static mostEMPAssist(parameters: WinterReportParameters): WinterMetric {
        return this.metric(parameters, [PsEvent.empAssist, PsEvent.squadEmpAssist], {
            name: "EMP assists",
            funName: "Sparky Sparky Boom",
            description: "Players with the most emp assists",
            entries: []
        });
    }

    private static mostSaviors(parameters: WinterReportParameters): WinterMetric {
        return this.metric(parameters, [PsEvent.savior], {
            name: "Savior",
            funName: "Savior",
            description: "Players with the most savior kills",
            entries: []
        });
    }

    private static longestKillStreak(parameters: WinterReportParameters): WinterMetric {
        const metric: WinterMetric = new WinterMetric();
        metric.name = "Kill streaks";
        metric.funName = "Big fish";
        metric.description = "Players with the longest kill streak";

        const amounts: StatMap = new StatMap();

        for (const player of parameters.players) {
            let currentStreak: number = 0;
            let longestStreak: number = 0;

            for (const ev of player.events) {
                if (ev.type != "kill" && ev.type != "death") {
                    continue;
                }

                if (ev.type == "kill") {
                    ++currentStreak;
                } else if (ev.type == "death" && ev.revivedEvent == null) {
                    if (currentStreak > longestStreak) {
                        longestStreak = currentStreak;
                        amounts.set(player.name, longestStreak);
                    }
                    currentStreak = 0;
                }
            }
        }

        metric.entries = this.statMapToEntires(parameters, amounts);

        return metric;
    }

    private static highestHSR(parameters: WinterReportParameters): WinterMetric {
        const metric: WinterMetric = new WinterMetric();
        metric.name = "HSR";
        metric.funName = "Head poppers";
        metric.description = "Players with the highest headshot ratio";

        const map: StatMap = new StatMap();

        for (const player of parameters.players) {
            const kills: number = player.events.filter(iter => iter.type == "kill").length || 1;
            const hsKills: number = player.events.filter(iter => iter.type == "kill" && iter.isHeadshot == true).length || 1;

            if (player.secondsOnline < 10) {
                continue;
            }

            if (kills == 1 || hsKills == 1) {
                continue;
            }

            map.set(player.name, hsKills / kills);
        }

        metric.entries = this.statMapToEntires(parameters, map, (iter: number) => `${(iter * 100).toFixed(2)}%`);

        return metric;
    }

    private static getDifferentWeapons(parameters: WinterReportParameters): WinterMetric {
        const metric: WinterMetric = new WinterMetric();
        metric.name = "Different weapons";
        metric.funName = "Diverse Skillset";
        metric.description = "Players with the most amount of unique weapons";

        const stats: StatMap = new StatMap();

        for (const player of parameters.players) {
            const set: Set<string> = new Set();

            for (const ev of player.events) {
                if (ev.type != "kill") {
                    continue;
                }

                set.add(ev.weaponID);
            }

            stats.set(player.name, set.size);
        }

        metric.entries = this.statMapToEntires(parameters, stats);

        return metric;
    }

    private static mostESFSKills(parameters: WinterReportParameters): WinterMetric {
        return this.vehicle(parameters, [Vehicles.mosquito, Vehicles.reaver, Vehicles.scythe], {
            name: "ESFs destroyed",
            funName: "Fly Swatter",
            description: "Players with the most ESFs destroyed",
            entries: []
        });
    }

    private static mostSunderersKilled(parameters: WinterReportParameters): WinterMetric {
        return this.vehicle(parameters, [Vehicles.sunderer], {
            name: "Sunderes killed",
            funName: "Bus Bully",
            description: "Players with the most sundies destroyed",
            entries: []
        });
    }

    private static vehicle(parameters: WinterReportParameters, vehicles: string[], metric: WinterMetric): WinterMetric {
        const amounts: StatMap = new StatMap();

        for (const player of parameters.players) {
            for (const ev of player.events) {
                if (ev.type != "vehicle") {
                    continue;
                }

                if (vehicles.indexOf(ev.vehicleID) > -1) {
                    amounts.increment(player.name);
                }
            }
        }

        metric.entries = this.statMapToEntires(parameters, amounts);

        return metric;
    }

    private static metric(parameters: WinterReportParameters, events: string[], metric: WinterMetric): WinterMetric {
        const amounts: StatMap = new StatMap();

        for (const player of parameters.players) {
            for (const ev of events) {
                amounts.increment(player.name, player.stats.get(ev));
            }
        }

        metric.entries = this.statMapToEntires(parameters, amounts);

        return metric;
    }

    private static value(parameters: WinterReportParameters, accessor: (player: TrackedPlayer) => number, metric: WinterMetric) {
        const map: StatMap = new StatMap();

        for (const player of parameters.players) {
            map.set(player.name, accessor(player));
        }

        metric.entries = this.statMapToEntires(parameters, map);
    }

    private static statMapToEntires(
        parameters: WinterReportParameters,
        map: StatMap,
        display: ((_: number) => string) | null = null): WinterMetricEntry[] {

        return Array.from(map.getMap().entries()).map((iter: [string, number]) => {
            return {
                name: iter[0],
                value: iter[1],
                display: display != null ? display(iter[1]) : null
            };
        }).filter(iter => iter.value)
            .sort((a, b) => b.value - a.value)
            .slice(0, parameters.settings.topNPlayers == -1 ? undefined : parameters.settings.topNPlayers);
    }

}