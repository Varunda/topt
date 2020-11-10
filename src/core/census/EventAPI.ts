import CensusAPI from "./CensusAPI";
import { ApiResponse } from "./ApiWrapper";
//import { Event, EventKill, EventDeath } from "core/events/index";

export class EventAPI {

    public static parseEvent(elem: any): Event {
        throw ``;
    }

    /*
    public static parseEventKill(elem: any): EventKill {
        return {
            type: "kill",
            isHeadshot: elem.is_headshot == "1",
            loadoutID: elem.attacker_loadout_id,
            sourceID: elem.attacker_character_id,
            targetID: elem.character_id,
            targetLoadoutID: elem.character_loadout_id,
            timestamp: Number.parseInt(elem.timestamp) * 1000,
            weaponID: elem.attacker_weapon_id,
            zoneID: elem.zone_id
        }
    }

    public static parseEventDeath(elem: any): EventDeath {
        return {
            type: "death",
            isHeadshot: elem.is_headshot == "1",
            loadoutID: elem.character_loadout_id,
            sourceID: elem.character_id,
            targetID: elem.attacker_character_id,
            targetLoadoutID: elem.attacker_loadout_id,
            timestamp: Number.parseInt(elem.timestamp) * 1000,
            weaponID: elem.attacker_weapon_id,
            revived: false,
            revivedEvent: null,
            zoneID: elem.zone_id
        }
    }

    public static getKills(charID: string, startMs: number, endMs: number): ApiResponse<EventKill[]> {
        const response: ApiResponse<EventKill[]> = new ApiResponse();

        startMs = Math.round((startMs / 1000)) - 1;
        endMs = Math.round((endMs / 1000)) + 1;

        if (startMs >= endMs) {
            response.resolve({ code: 400, data: `Start must come before end` });
        } else {
            const request: ApiResponse<any> = CensusAPI.get(
                `/characters_event/?character_id=${charID}&type=KILL&after=${startMs}&before=${endMs}`
            );

            request.ok((data: any) => {
                const events: EventKill[] = [];
                for (const datum of data.characters_event_list) {
                    events.push(EventAPI.parseEventKill(datum));
                }
                response.resolveOk(events);
            });
        }

        return response;
    }

    public static getMultiDeaths(ids: string[], startMs: number, endMs: number): ApiResponse<EventDeath[]> {
        const response: ApiResponse<EventDeath[]> = new ApiResponse();

        startMs = (startMs / 1000) - 1;
        endMs = (endMs / 1000) + 1;

        const request: ApiResponse<any> = CensusAPI.get(
            `/characters_event/?character_id=${ids.join(",")}&type=DEATH&after=${startMs}&before=${endMs}&c:limit=10000`
        );

        request.ok((data: any) => {
            const events: EventDeath[] = [];
            for (const datum of data.characters_event_list) {
                events.push(EventAPI.parseEventDeath(datum));
            }
            response.resolveOk(events);
        });

        return response;
    }

    public static getDeaths(charID: string, startMs: number, endMs: number): ApiResponse<EventDeath[]> {
        const response: ApiResponse<EventDeath[]> = new ApiResponse();

        startMs = (startMs / 1000) - 1;
        endMs = (endMs / 1000) + 1;

        const request: ApiResponse<any> = CensusAPI.get(
            `/characters_event/?character_id=${charID}&type=DEATH&after=${startMs}&before=${endMs}`
        );

        request.ok((data: any) => {
            const events: EventDeath[] = [];
            for (const datum of data.characters_event_list) {
                events.push(EventAPI.parseEventDeath(datum));
            }
            response.resolveOk(events);
        });

        return response;
    }
    */

}
(window as any).EventAPI = EventAPI;