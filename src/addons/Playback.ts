
import Core from "core/index";
import { TrackedPlayer } from "core/TrackedPlayer";
import { CoreSettings } from "core/CoreSettings";
import { SquadAddon } from "addons/SquadAddon";
import { Squad } from "core/squad/Squad";
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
    OutfitVersusBreakdown, ClassCollection, classCollectionNumber
} from "EventReporter";
import { ApiResponse } from "census/ApiWrapper";

const log = (msg: any): void => {
    console.log(`[Playback] ${msg}`);
}

const warn = (msg: any): void => {
    console.warn(`[Playback] ${msg}`);
}

const error = (msg: any): void => {
    console.error(`[Playback] ${msg}`);
}

const debug = (msg: any): void => {
    console.log(`[Playback] ${msg}`);
}

export class PlaybackOptions {

    public speed: number = 0;

}

export class Playback {

    private static _core: Core | null = null;

    private static _file: File | null = null;

    private static _events: any[] = [];
    private static _parsed: any[] = [];

    public static setCore(core: Core): void {
        Playback._core = core;
    }

    public static loadFile(file: File): ApiResponse {
        if (Playback._core == null) {
            throw `Cannot load file: Core has not been set. Did you forget to use Playback.setCore()?`;
        }
        Playback._file = file;

        const response: ApiResponse = new ApiResponse();

        const reader: FileReader = new FileReader();

        reader.onload = ((ev: ProgressEvent<FileReader>) => {
            const data: any = JSON.parse(reader.result as string);

            if (!data.version) {
                error(`Missing version from import`);
            } else if (data.version == "1") {
                const nowMs: number = new Date().getTime();

                debug(`Exported data uses version 1`);
                const chars: Character[] = data.players;
                const outfits: string[] = data.outfits;
                const events: any[] = data.events;

                // Force online for squad tracking
                this._core!.subscribeToEvents(chars.map(iter => { iter.online = iter.secondsPlayed > 0; return iter; }));

                this._core!.outfits = outfits;

                if (events != undefined && events.length != 0) {
                    Playback._events = events;

                    const parsedData = events.map(iter => JSON.parse(iter));
                    Playback._parsed = parsedData;
                }

                debug(`Took ${new Date().getTime() - nowMs}ms to import data`);
                response.resolveOk();
            } else {
                error(`Unchecked version: ${data.version}`);
                response.resolve({ code: 400, data: `` });
            }
        });

        reader.readAsText(file);

        return response;
    }

    public static start(parameters: PlaybackOptions): void {
        if (this._core == null) {
            throw `Cannot start playback, core is null. Did you forget to call Playback.setCore()?`;
        }

        // Instant playback
        if (parameters.speed <= 0) {
            debug(`Doing instant playback`);

            this._core.tracking.startTime = Math.min(...Playback._parsed.map(iter => (Number.parseInt(iter.payload.timestamp) * 1000) || 0));
            this._core.tracking.endTime = Math.max(...Playback._parsed.map(iter => (Number.parseInt(iter.payload.timestamp) * 1000) || 0));

            for (const ev of Playback._events) {
                this._core.processMessage(ev, true);
            }
            this._core.stop();
        } else {
            const start: number = Math.min(...Playback._parsed.map(iter => (Number.parseInt(iter.payload.timestamp) * 1000) || 0));
            const end: number = Math.max(...Playback._parsed.map(iter => (Number.parseInt(iter.payload.timestamp) * 1000) || 0));

            this._core.tracking.startTime = start;

            const slots: Map<number, object[]> = new Map();

            for (const ev of Playback._parsed) {
                const time: number = Number.parseInt(ev.payload.timestamp) * 1000;
                if (Number.isNaN(time)) {
                    warn(`Failed to get a timestamp from ${ev}`);
                }

                const diff: number = time - start;

                if (!slots.has(diff)) {
                    slots.set(diff, []);
                }

                slots.get(diff)!.push(ev);
            }

            let index: number = 0;

            const intervalID = setInterval(() => {
                if (!slots.has(index)) {
                    debug(`Index ${index} has no events, skipping`);
                } else {
                    const events: object[] = slots.get(index)!;
                    for (const ev of events) {
                        this._core!.processMessage(JSON.stringify(ev), true);
                    }
                }

                index += 1000;
                if (index > end) {
                    debug(`Ended on index ${index}`);
                    clearInterval(intervalID);
                }
            }, 1000 * parameters.speed);
        }
    }

}
(window as any).Playback = Playback;