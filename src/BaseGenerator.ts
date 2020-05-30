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

import { PsLoadout, PsLoadouts } from "census/PsLoadout";
import { PsEventType, PsEvent, PsEvents } from "PsEvent";
import { Event, EventExp, EventKill, EventDeath, EventVehicleKill, EventCapture } from "Event";
import StatMap from "StatMap";
import EventReporter, { 
    statMapToBreakdown, BreakdownWeaponType,
    Breakdown, BreakdownArray, defaultCharacterMapper, defaultCharacterSortField,
    OutfitVersusBreakdown, ClassCollection, classCollectionNumber
} from "EventReporter";
import { FacilityCapture, CaptureBreakdown, OutfitParticipants } from "InvididualGenerator";

export class OutfitCapture {
    public name: string = "";
    public factionID: string = "";
    public score: number = 0;
    public captures: FacilityCapture[] = [];
    public breakdown: CaptureBreakdown[] = [];
}

export class BaseReport {
    public outfits: string[] = [];
    public captures: FacilityCapture[] = [];
    public breakdown: CaptureBreakdown[] = [];
    public outfitCaptures: OutfitCapture[] = [];
}

export class BaseGenerator {

    public static generate(events: Event[], captures: FacilityCapture[], participants: EventCapture[]): ApiResponse<BaseReport> {
        const response: ApiResponse<BaseReport> = new ApiResponse();
        const report: BaseReport = new BaseReport();

        if (events.length == 0 || captures.length == 0) {
            return response;
        }

        const lastTimestamp: number = events[events.length - 1].timestamp;

        report.captures = captures.filter(iter => iter.factionID != iter.previousFaction && iter.outfitID != "0");
        report.captures.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        report.outfits = captures.filter(iter => iter.outfitID.length > 0 && iter.outfitID != "0")
            .map(iter => iter.outfitID)
            .filter((val, index, arr) => arr.indexOf(val) == index);

        const participantOutfits: string[] = participants.map(iter => iter.outfitID)
            .filter((val, index, arr) => arr.indexOf(val) == index);

        report.outfits.push(...participantOutfits);
        report.outfits = report.outfits.filter((iter, index, arr) => arr.indexOf(iter) == index);

        console.log(`Loading ${report.outfits.length} outfits:\n\t${report.outfits.join(", ")}`);

        OutfitAPI.getByIDs(report.outfits).ok((data: Outfit[]) => {
            for (const capture of report.captures) {
                const breakdown: CaptureBreakdown = new CaptureBreakdown();
                Object.assign(breakdown, {...capture});

                if (capture.outfitID.length == 0 || capture.outfitID == "0") {
                    breakdown.outfitName = "No outfit";
                    breakdown.outfitTag = "";
                } else {
                    const outfit: Outfit | undefined = data.find(iter => iter.ID == capture.outfitID);

                    if (outfit == undefined) {
                        breakdown.outfitName = `Bad ID ${capture.outfitID}`;
                        breakdown.outfitTag = ``;
                    } else {
                        breakdown.outfitName = outfit.name;
                        breakdown.outfitTag = outfit.tag;
                    }
                }

                breakdown.participants = participants.filter((iter: EventCapture) => {
                    return iter.facilityID == breakdown.facilityID && iter.timestamp == breakdown.timestamp.getTime();
                }).map((iter: EventCapture) => {
                    const outfit = data.find(i => i.ID == iter.outfitID);
                    return {
                        characterID: iter.sourceID,
                        outfitID: iter.outfitID,
                        outfitName: outfit != undefined ? outfit.name : "<No outfit>",
                        outfitTag: outfit != undefined ? outfit.tag : "",
                        timestamp: iter.timestamp,
                        facilityID: iter.facilityID
                    }
                });

                for (const part of breakdown.participants) {
                    const existing = breakdown.outfits.find(iter => iter.outfitID == part.outfitID);
                    if (existing != undefined) {
                        continue;
                    }

                    const outfit: OutfitParticipants = new OutfitParticipants();
                    outfit.outfitID = part.outfitID;
                    outfit.outfitName = part.outfitName;
                    outfit.outfitTag = part.outfitTag;
                    outfit.players = breakdown.participants.filter(iter => iter.outfitID == outfit.outfitID).length;
                    outfit.total = breakdown.participants.length;

                    breakdown.outfits.push(outfit);
                }

                report.breakdown.push(breakdown);
            }

            for (let i = 0; i < report.breakdown.length; ++i) {
                const cap: CaptureBreakdown = report.breakdown[i];

                for (let b = i - 1; b >= 0; --b) {
                    if (report.breakdown[b].facilityID == cap.facilityID && report.breakdown[b].factionID != cap.factionID) {
                        cap.previousOutfitID = report.breakdown[b].outfitID;
                        cap.previousOutfitName = report.breakdown[b].outfitName;
                        cap.previousOutfitTag = report.breakdown[b].outfitTag;
                        report.breakdown[b].takenBy = cap;
                        break;
                    }
                }
            }

            for (const outfit of data) {
                const caps: OutfitCapture = new OutfitCapture();
                caps.captures = report.captures.filter(iter => iter.outfitID == outfit.ID);
                caps.breakdown = report.breakdown.filter(iter => iter.outfitID == outfit.ID);

                for (const cap of caps.breakdown) {
                    // Facilities // Large = 15 points, 6 per tick
                    // Small // Construction = 5 points, 2 per tick

                    let capScore: number = 0;
                    switch (cap.typeID) {
                        case "1": capScore = 0; break; // Default
                        case "2": capScore = 15; break; // Amp
                        case "3": capScore = 15; break; // Bio
                        case "4": capScore = 15; break; // Tech
                        case "5": capScore = 15; break; // Large outpost
                        case "6": capScore = 5; break; // Small outpost
                        case "7": capScore = 0; break; // Warpgate
                        case "8": capScore = 0; break; // Interlink facility
                        case "9": capScore = 5; break; // Construction outpost
                    }

                    cap.captureScore = capScore;
                    caps.score += cap.captureScore;

                    let tickScore: number = 0;
                    switch (cap.typeID) {
                        case "1": tickScore = 0; break; // Default
                        case "2": tickScore = 6; break; // Amp
                        case "3": tickScore = 6; break; // Bio
                        case "4": tickScore = 6; break; // Tech
                        case "5": tickScore = 6; break; // Large outpost
                        case "6": tickScore = 2; break; // Small outpost
                        case "7": tickScore = 0; break; // Warpgate
                        case "8": tickScore = 0; break; // Interlink facility
                        case "9": tickScore = 2; break; // Construction outpost
                    }

                    if (cap.takenBy != null) {
                        const ticks = Math.floor(cap.takenBy.timeHeld / (5 * 60));
                        //console.log(`Held for ${ticks} ticks`);
                        cap.tickScore = tickScore * ticks;
                    } else {
                        const diff = lastTimestamp - cap.timestamp.getTime();
                        const ticks = Math.abs(Math.floor((diff / 1000) / (5 * 60)));
                        //console.log(`Held for ${diff}, got ${ticks} count`);
                        cap.tickScore = tickScore * ticks;
                    }
                    caps.score += cap.tickScore;
                }

                if (caps.captures.length > 0) {
                    caps.factionID = outfit.faction;
                    caps.name = `${outfit.tag.length > 0 ? `[${outfit.tag}] ` : ``}${outfit.name}`;

                    report.outfitCaptures.push(caps);
                }
            }

            report.outfitCaptures.sort((a, b) => {
                return b.factionID.localeCompare(a.factionID) || b.score - a.score;
            });

            response.resolveOk(report);
        });

        return response;
    }

}