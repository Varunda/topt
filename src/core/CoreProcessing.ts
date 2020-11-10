import { Core } from "core/Core";

import { PsLoadout, PsLoadouts } from "core/census/PsLoadout";
import { PsEventType, PsEvent, PsEvents } from "core/PsEvent";

import { Weapon, WeaponAPI } from "core/census/WeaponAPI";
import { FacilityAPI, Facility } from "core/census/FacilityAPI";
import { CharacterAPI, Character } from "core/census/CharacterAPI";

import { FacilityCapture, TrackedRouter } from "core/InvididualGenerator";

import { TrackedPlayer } from "core/TrackedPlayer";

import {
    TEvent, TEventType,
    TExpEvent, TKillEvent, TDeathEvent, TTeamkillEvent,
    TCaptureEvent, TDefendEvent,
    TVehicleKillEvent, TLoginEvent, TLogoutEvent,
    TEventHandler
} from "core/events/index";

declare module "Core" {

    export interface Core {

        /**
         * Process a JSON message into an Event that's emitted
         * 
         * @param input     JSON string input to be processed into an Event
         * @param override  Will this message always be processed, even if it's not running?
         */
        processMessage(input: string, override: boolean): void;

    }
}

(Core as any).prototype.processMessage = function(input: string, override: boolean = false): void {
    const self: Core = this as Core;

    if (self.tracking.running == false && override == false) {
        return;
    }

    let save: boolean = false;

    const msg = JSON.parse(input);

    if (msg.type == "serviceMessage") {
        const event: string = msg.payload.event_name;
        const timestamp: number = Number.parseInt(msg.payload.timestamp) * 1000;

        const zoneID: string = msg.payload.zone_id;

        if (event == "GainExperience") {
            const eventID: string = msg.payload.experience_id;
            const charID: string = msg.payload.character_id;
            const targetID: string = msg.payload.other_id;
            const amount: number = Number.parseInt(msg.payload.amount);
            const event: PsEvent | undefined = PsEvents.get(eventID);

            if (eventID == "1410") {
                if (self.stats.get(charID) != undefined) {
                    if (self.routerTracking.routerNpcs.has(charID)) {
                        //console.log(`${charID} router npc check for ${targetID}`);
                        const router: TrackedRouter = self.routerTracking.routerNpcs.get(charID)!;
                        if (router.ID != targetID) {
                            //console.warn(`New router placed by ${charID}, missed ItemAdded event: removing old one and replacing with ${targetID}`);
                            router.destroyed = timestamp;

                            self.routerTracking.routers.push({...router});

                            self.routerTracking.routerNpcs.set(charID, {
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

                        self.routerTracking.routerNpcs.set(charID, {
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
                const trackedNpcs: TrackedRouter[] = Array.from(self.routerTracking.routerNpcs.values());
                const ids: string[] = trackedNpcs.map(iter => iter.ID);
                if (ids.indexOf(targetID) > -1) {
                    const router: TrackedRouter = trackedNpcs.find(iter => iter.ID == targetID)!;
                    //console.log(`Router ${router.ID} placed by ${router.owner} destroyed, saving`);

                    router.destroyed = timestamp;
                    self.routerTracking.routers.push({...router});

                    self.routerTracking.routerNpcs.delete(router.owner);

                    save = true;
                }
            }

            const ev: TExpEvent = {
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
            const player = self.stats.get(charID);
            if (player != undefined) {
                if (Number.isNaN(amount)) {
                    console.warn(`NaN amount from event: ${JSON.stringify(msg)}`);
                } else {
                    player.score += amount;
                }

                if (event != undefined) {
                    if (event.track == true) {
                        player.stats.increment(eventID);

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
                self.miscEvents.push(ev);
            }

            self.processExperienceEvent(ev);
            self.emit(ev);

            if (eventID == PsEvent.revive || eventID == PsEvent.squadRevive) {
                const target = self.stats.get(targetID);
                if (target != undefined) {
                    if (target.recentDeath != null) {
                        target.recentDeath.revived = true;
                        target.recentDeath.revivedEvent = ev;
                        //console.log(`${targetID} died but was revived by ${charID}`);
                    }

                    target.stats.decrement(PsEvent.death);
                    target.stats.increment(PsEvent.revived);
                }
            }

            save = true;
        } else if (event == "Death") {
            const targetID: string = msg.payload.character_id;
            const sourceID: string = msg.payload.attacker_character_id;
            const isHeadshot: boolean = msg.payload.is_headshot == "1";
            const targetLoadoutID: string = msg.payload.character_loadout_id;
            const sourceLoadoutID: string = msg.payload.attacker_loadout_id;

            if (self.tracking.running == true) {
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

            let targetTicks = self.stats.get(targetID);
            if (targetTicks != undefined && targetLoadout.faction != sourceLoadout.faction) {
                targetTicks.stats.increment(PsEvent.death);

                const ev: TDeathEvent = {
                    type: "death",
                    isHeadshot: isHeadshot,
                    sourceID: targetID, // Swap the target and source to keep the events consistent
                    targetID: sourceID,
                    loadoutID: targetLoadoutID,
                    targetLoadoutID: sourceLoadoutID,
                    weaponID: msg.payload.attacker_weapon_id,
                    revived: false,
                    revivedEvent: null,
                    timestamp: timestamp,
                    zoneID: zoneID
                };

                targetTicks.events.push(ev);
                targetTicks.recentDeath = ev;

                WeaponAPI.precache(ev.weaponID);

                self.emit(ev);
                self.processKillDeathEvent(ev);

                save = true;
            }

            let sourceTicks = self.stats.get(sourceID);
            if (sourceTicks != undefined) {
                if (targetLoadout.faction == sourceLoadout.faction) {
                    sourceTicks.stats.increment(PsEvent.teamkill);
                    targetTicks?.stats.increment(PsEvent.teamkilled);

                    const ev: TTeamkillEvent = {
                        type: "teamkill",
                        sourceID: sourceID,
                        loadoutID: sourceLoadoutID,
                        targetID: targetID,
                        targetLoadoutID: targetLoadoutID,
                        weaponID: msg.payload.attacker_weapon_id,
                        zoneID: zoneID,
                        timestamp: timestamp
                    }

                    sourceTicks.events.push(ev);

                    self.emit(ev);
                } else {
                    sourceTicks.stats.increment(PsEvent.kill);

                    if (isHeadshot == true) {
                        sourceTicks.stats.increment(PsEvent.headshot);
                    }

                    const ev: TKillEvent = {
                        type: "kill",
                        isHeadshot: isHeadshot,
                        sourceID: sourceID,
                        targetID: targetID,
                        loadoutID: sourceLoadoutID,
                        targetLoadoutID: targetLoadoutID,
                        weaponID: msg.payload.attacker_weapon_id,
                        timestamp: timestamp,
                        zoneID: zoneID
                    };
                    sourceTicks.events.push(ev);

                    WeaponAPI.precache(ev.weaponID);
                    self.emit(ev);

                    self.processKillDeathEvent(ev);
                }

                save = true;

            }
        } else if (event == "PlayerFacilityCapture") {
            const playerID: string = msg.payload.character_id;
            const outfitID: string = msg.payload.outfit_id;
            const facilityID: string = msg.payload.facility_id;

            const ev: TCaptureEvent = {
                type: "capture",
                sourceID: playerID,
                outfitID: outfitID,
                facilityID: facilityID,
                timestamp: timestamp,
                zoneID: zoneID
            };

            self.playerCaptures.push(ev);

            let player = self.stats.get(playerID);
            if (player != undefined) {
                player.stats.increment(PsEvent.baseCapture);
                player.events.push(ev);
            }

            self.emit(ev);

            save = true;
        } else if (event == "PlayerFacilityDefend") {
            const playerID: string = msg.payload.character_id;
            const outfitID: string = msg.payload.outfit_id;
            const facilityID: string = msg.payload.facility_id;

            const ev: TDefendEvent = {
                type: "defend",
                sourceID: playerID,
                outfitID: outfitID,
                facilityID: facilityID,
                timestamp: timestamp,
                zoneID: zoneID,
            }

            self.playerCaptures.push(ev);

            self.emit(ev);

            let player = self.stats.get(playerID);
            if (player != undefined) {
                player.stats.increment(PsEvent.baseDefense);
            }
            save = true;
        } else if (event == "AchievementEarned") {
            const charID: string = msg.payload.character_id;
            const achivID: string = msg.payload.achievement_id;

            const char = self.stats.get(charID);
            if (char != undefined) {
                char.ribbons.increment(achivID);
                save = true;
            }
        } else if (event == "FacilityControl") {
            const outfitID: string = msg.payload.outfit_id;
            const facilityID: string = msg.payload.facility_id;

            FacilityAPI.getByID(facilityID).ok((data: Facility) => {
                console.log(`New facility capture: ${data.name}`);

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

                self.facilityCaptures.push(capture);
            }).noContent(() => {
                console.error(`Failed to find facility ID ${facilityID}`);
            });
            save = true;
        } else if (event == "ItemAdded") {
            const itemID: string = msg.payload.item_id;
            const charID: string = msg.payload.character_id;

            if (itemID == "6003551") {
                if (self.stats.get(charID) != undefined) {
                    //console.log(`${charID} pulled a new router`);

                    if (self.routerTracking.routerNpcs.has(charID)) {
                        const router: TrackedRouter = self.routerTracking.routerNpcs.get(charID)!;
                        //console.log(`${charID} pulled a new router, saving old one`);
                        router.destroyed = timestamp;

                        self.routerTracking.routers.push({...router});
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

                    self.routerTracking.routerNpcs.set(charID, router);

                    save = true;
                }
            }
        } else if (event == "VehicleDestroy") {
            const killerID: string = msg.payload.attacker_character_id;
            const killerLoadoutID: string = msg.payload.attacker_loadout_id;
            const killerWeaponID: string = msg.payload.attacker_weapon_id;
            const vehicleID: string = msg.payload.vehicle_id;

            const player = self.stats.get(killerID);
            if (player != undefined) {
                const ev: TVehicleKillEvent = {
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

                self.emit(ev);
            }
        } else if (event == "PlayerLogin") {
            const charID: string = msg.payload.character_id;
            if (this.stats.has(charID)) {
                const char: TrackedPlayer = this.stats.get(charID)!;
                char.online = true;
                if (this.tracking.running == true) {
                    char.joinTime = new Date().getTime();
                }

                const ev: TLoginEvent = {
                    type: "login",
                    sourceID: charID,
                    timestamp: timestamp
                }

                char.events.push(ev);

                self.emit(ev);

                self.addMember({
                    ID: char.characterID,
                    name: char.name,
                    outfitTag: char.outfitTag 
                });
            }
        } else if (event == "PlayerLogout") {
            const charID: string = msg.payload.character_id;
            if (this.stats.has(charID)) {
                const char: TrackedPlayer = this.stats.get(charID)!;
                char.online = false;

                if (this.tracking.running == true) {
                    const diff: number = new Date().getTime() - char.joinTime;
                    char.secondsOnline += (diff / 1000);
                }

                const ev: TLogoutEvent = {
                    type: "logout",
                    sourceID: charID,
                    timestamp: timestamp
                };

                char.events.push(ev);

                self.emit(ev);

                self.removeMember(charID);
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
    } else if (msg.type == undefined) {
        // Occurs in response to subscribing to new events
    } else {
        console.warn(`Unchecked message type: '${msg.type}'`);
    }

    if (save == true) {
        self.rawData.push(JSON.stringify(msg));
    }
}