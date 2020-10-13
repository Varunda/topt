import { Core } from "core/Core";

import { TKillEvent, TDeathEvent, TExpEvent } from "events/index";
import { PsLoadout, PsLoadouts } from "census/PsLoadout";
import { PsEvent, PsEvents } from "PsEvent";
import { CharacterAPI, Character } from "census/CharacterAPI";

import { Squad } from "./squad/Squad";
import { SquadMember } from "./squad/SquadMember";

declare module "Core" {

    export interface Core {

        squadInit(): void

        /**
         * Get a specific squad 
         * 
         * @param squadName Squad name to get
         */
        getSquad(squadName: string): Squad | null

        /**
         * Get the squad a member is in
         * 
         * @param charID Character ID of the member to get the squad of
         */
        getSquadOfMember(charID: string): Squad | null

        /**
         * Process a kill or death event and update the tracked squads
         * 
         * @param event Event to process
         */
        processKillDeathEvent(event: TKillEvent | TDeathEvent): void

        /**
         * Process an experience event and update the tracked squads
         * 
         * @param event Experience event to process
         */
        processExperienceEvent(event: TExpEvent): void

        /**
         * Merge one squad into another squad, moving all members
         * 
         * @param mergeInto Name of the squad being merged into
         * @param mergeFrom Name of the squad that the members will be moved out of
         */
        mergeSquads(mergeInto: Squad, mergeFrom: Squad): void

        /**
         * Begin tracking a new character in the squad
         * 
         * @param char Character to begin tracking
         */
        addMember(char: { ID: string, name: string }): void;

        /**
         * Create a new squad
         */
        createSquad(): Squad;

        /**
         * Character ID of the member to add to a squad, removing the character
         * from old squads if needed
         * 
         * @param charID Character ID of the member to move into a squad
         * @param squadName Name of the squad to move the member into
         */
        addMemberToSquad(charID: string, squadName: string): void

        /**
         * Remove a member from the squad they are currently in,
         * creating a new squad in the process
         * 
         * @param charID Character ID of the character to move out of the squad
         */
        removeMember(charID: string): void

    }
}

const squadEvents: string[] = [
    PsEvent.squadResupply,
    PsEvent.squadHeal,
    PsEvent.squadMaxRepair,
    //PsEvent.squadMotionDetect,
    //PsEvent.squadRadarDetect,
    PsEvent.squadRevive,
    PsEvent.squadShieldRepair,
    //PsEvent.squadSpawn,
    //PsEvent.squadSpotKill
];

const nonSquadEvents: string[] = [
    PsEvent.heal,
    PsEvent.revive,
    PsEvent.resupply,
    PsEvent.shieldRepair,
    //PsEvent.motionDetect,
    //PsEvent.radarDetect,
    //PsEvent.spotKill,
];

const log = (msg: any): void => {
    console.log(`[CoreSquad] ${msg}`);
}

const warn = (msg: any): void => {
    console.warn(`[CoreSquad] ${msg}`);
}

const debug = (msg: any): void => {
    console.log(`[CoreSquad] ${msg}`);
}

Core.prototype.squadInit = function(): void {
    this.squad.squad1.name = "1";
    this.squad.squad1.guess = false;

    this.squad.squad2.name = "2";
    this.squad.squad2.guess = false;

    this.squad.squad3.name = "3";
    this.squad.squad3.guess = false;

    this.squad.squad4.name = "4";
    this.squad.squad4.guess = false;

    setInterval(() => {
        const time: number = new Date().getTime();
        this.squad.members.forEach((member: SquadMember, charID: string) => {
            if (member.state == "dying" && member.whenDied != null) {
                member.timeDead = (time - member.whenDied) / 1000;

                if (member.timeDead > 29) {
                    member.state = "dead";
                }
            }

            if (member.whenBeacon) {
                member.beaconCooldown = (time - member.whenBeacon) / 1000;

                if (member.beaconCooldown > 299) {
                    member.whenBeacon = null;
                    member.beaconCooldown = 0;
                }
            }
        });

    }, 1000);
}

Core.prototype.addMember = function (char: { ID: string, name: string }): void {
    if (this.squad.members.has(char.ID)) {
        warn(`Not adding duplicate member ${char.name}`);
        return;
    }

    this.squad.members.set(char.ID, {
        name: char.name,
        charID: char.ID,
        class: "",
        state: "alive",
        timeDead: 0,
        whenDied: null,
        whenBeacon: null,
        beaconCooldown: 0
    });

    const member: SquadMember = this.squad.members.get(char.ID)!;

    debug(`Started squad tracking ${char.name}/${char.ID}`);

    const squad: Squad = this.createSquad();
    squad.members.push(member);
}

Core.prototype.processKillDeathEvent = function(event: TKillEvent | TDeathEvent): void {
    if (event.type == "kill") {
        if (this.squad.members.has(event.sourceID)) {
            const member: SquadMember = this.squad.members.get(event.sourceID)!;
            member.state = "alive";
            member.timeDead = 0;
            member.whenDied = null;

            const loadout: PsLoadout = PsLoadouts.get(event.loadoutID) ?? PsLoadout.default;
            switch (loadout.type) {
                case "infil": member.class = "I"; break;
                case "lightAssault": member.class = "L"; break;
                case "medic": member.class = "M"; break;
                case "engineer": member.class = "E"; break;
                case "heavy": member.class = "H"; break;
                case "max": member.class = "W"; break;
                case "unknown": member.class = ""; break;
            }
        }
    } else if (event.type == "death") {
        if (this.squad.members.has(event.sourceID)) {
            const member: SquadMember = this.squad.members.get(event.sourceID)!;
            member.state = "dying";
            member.whenDied = new Date().getTime();
            member.timeDead = 0;

            const loadout: PsLoadout = PsLoadouts.get(event.loadoutID) ?? PsLoadout.default;
            switch (loadout.type) {
                case "infil": member.class = "I"; break;
                case "lightAssault": member.class = "L"; break;
                case "medic": member.class = "M"; break;
                case "engineer": member.class = "E"; break;
                case "heavy": member.class = "H"; break;
                case "max": member.class = "W"; break;
                case "unknown": member.class = ""; break;
            }
        }
    }
}

const validRespawnEvent = (ev: TExpEvent, whenDied: number | null): boolean => {
    // These events can happen whenever and aren't useful for knowing if someone is alive or not
    if (ev.expID == PsEvent.resupply || ev.expID == PsEvent.squadResupply
        || ev.expID == PsEvent.shieldRepair || ev.expID == PsEvent.squadShieldRepair
        || ev.expID == PsEvent.killAssist
        || ev.expID == PsEvent.ribbon
        || ev.expID == PsEvent.motionDetect || ev.expID == PsEvent.squadMotionDetect
        || ev.expID == PsEvent.squadSpawn
        || ev.expID == PsEvent.drawfire
        //|| ev.expID == PsEvent.heal || ev.expID == PsEvent.squadHeal // People rarely run mending field to make this an issue
        ) {
        return false;
    }

    // These events might be useful, depending on how long ago the player died, for example if they get a revive
    //      within 1 second of death it might be a revive nade, but if it's after 8 seconds we know they had to respawn
    //      in some other way as a revive nade takes 2.5 seconds to prime

    /*
    if (whenDied != null) {
        console.log(`It's been ${ev.timestamp - whenDied} ms since death`);
        if (((ev.expID == PsEvent.revive || ev.expID == PsEvent.squadRevive) && (ev.timestamp - whenDied <= 5)) // Revive nades take 2.5 seconds to prime
            || ((ev.expID == PsEvent.heal || ev.expID == PsEvent.squadHeal) && (ev.timestamp - whenDied <= 15)) // Heal nades last for 10? seconds
        ) {
            return false;
        }
    }
    */

    return true;
}

Core.prototype.processExperienceEvent = function(event: TExpEvent): void {

    if (event.expID == PsEvent.revive || event.expID == PsEvent.squadRevive) {
        if (this.squad.members.has(event.targetID)) {
            const member: SquadMember = this.squad.members.get(event.targetID)!;

            member.state = "alive";
            member.timeDead = 0;
            member.whenDied = null;
        }
    }

    if (event.expID == PsEvent.squadSpawn) {
        if (this.squad.members.has(event.sourceID)) {
            const member: SquadMember = this.squad.members.get(event.sourceID)!;
            if (member.whenBeacon == null) {
                console.log(`${member.name} placed a beacon`);

                member.beaconCooldown = 300;
                member.whenBeacon = new Date().getTime();
            }
        }
    }

    if (this.squad.members.has(event.sourceID)) {
        const member: SquadMember = this.squad.members.get(event.sourceID)!;

        if (member.state != "alive") {
            if (validRespawnEvent(event, member.whenDied) == true) {
                member.state = "alive";
                member.whenDied = null;
                member.timeDead = 0;
                debug(`${member.name} was revived from ${event}`);
            } 
        }


        const loadout: PsLoadout = PsLoadouts.get(event.loadoutID) ?? PsLoadout.default;
        switch (loadout.type) {
            case "infil": member.class = "I"; break;
            case "lightAssault": member.class = "L"; break;
            case "medic": member.class = "M"; break;
            case "engineer": member.class = "E"; break;
            case "heavy": member.class = "H"; break;
            case "max": member.class = "W"; break;
            case "unknown":
                warn(`Unknown class from event: ${event}`);
                member.class = ""; 
                break;
        }
    }

    const sourceMember: SquadMember | undefined = this.squad.members.get(event.sourceID);
    const targetMember: SquadMember | undefined = this.squad.members.get(event.targetID);

    if (sourceMember == undefined || targetMember == undefined) {
        return;
    }

    let sourceSquad: Squad | null = this.getSquadOfMember(event.sourceID);
    let targetSquad: Squad | null = this.getSquadOfMember(event.targetID);

    if (sourceSquad == null) {
        sourceSquad = this.createSquad();
        sourceSquad.members.push(sourceMember);
    }

    if (targetSquad == null) {
        targetSquad = this.createSquad();
        targetSquad.members.push(targetMember);
    }

    // Check if the squads need to be merged into one another if this was a squad exp source
    if (squadEvents.indexOf(event.trueExpID) > -1) {
        if (sourceSquad.ID == targetSquad.ID) {
            //console.log(`${sourceMember.name} // ${targetMember.name} are already in a squad`);
        } else {
            const ev: PsEvent | undefined = PsEvents.get(event.expID);

            // 3 cases:
            //      1. Both squads are guesses => Merge squads
            //      2. One squad isn't a guess => Move guess squad into non-guess squad
            //      3. Neither squad is a guess => Move member who performed action into other squad
            if (targetSquad.guess == true && sourceSquad.guess == true) {
                debug(`Both guesses, merging ${sourceMember.name} (${sourceSquad}) into ${targetMember.name} (${targetSquad}) from ${ev?.name}`);

                this.mergeSquads(sourceSquad, targetSquad);
            } else if (targetSquad.guess == false && sourceSquad.guess == true) {
                debug(`Target is not a guess, merging ${sourceMember.name} (${sourceSquad}) into ${targetMember.name} (${targetSquad}) from ${ev?.name}`);

                this.mergeSquads(targetSquad, sourceSquad);
            } else if (targetSquad.guess == true && sourceSquad.guess == false) {
                debug(`Source is not a guess, merging ${targetMember.name} (${targetSquad}) into ${sourceMember.name} (${sourceSquad}) from ${ev?.name}`);

                this.mergeSquads(sourceSquad, targetSquad);
            } else if (targetSquad.guess == false && sourceSquad.guess == false) {
                debug(`Neither squad is a guess, moving ${targetMember.name} into ${sourceMember} (${sourceSquad}) from ${ev?.name}`);
                sourceSquad.members.push(targetMember);
                targetSquad.members = targetSquad.members.filter(iter => iter.charID != targetMember.charID);
            }

        }
    }

    // Check if the squad is no longer valid and needs to be removed, i.e. moved squads
    if (nonSquadEvents.indexOf(event.trueExpID) > -1) {
        //console.log(`Non squad event: ${event.trueExpID}`);
        if (sourceSquad.ID == targetSquad.ID) {
            debug(`${sourceMember.name} was in squad with ${targetMember.name}, but didn't get an expect squad exp event`);

            targetSquad.members = targetSquad.members.filter(iter => iter.charID != sourceMember.charID);

            const squad: Squad = this.createSquad();
            squad.members.push(sourceMember);
        }
    }
}

Core.prototype.getSquad = function(squadName: string): Squad | null {
    const self: Core = this as Core;

    if (squadName == "1") {
        return self.squad.squad1;
    } else if (squadName == "2") {
        return self.squad.squad2;
    } else if (squadName == "3") {
        return self.squad.squad3;
    } else if (squadName == "4") {
        return self.squad.squad4;
    } else {
        return self.squad.guessSquads.find(iter => iter.name == squadName) || null;
    }
}

Core.prototype.addMemberToSquad = function(charID: string, squadName: string): void {
    const member: SquadMember | undefined = this.squad.members.get(charID);
    if (member == undefined) {
        return warn(`Cannot move ${charID} to ${squadName}: ${charID} is not a squad member`);
    }

    const squad: Squad | null = this.getSquad(squadName);
    if (squad == null) {
        return warn(`Cannot move ${charID} to ${squadName}: squad ${squadName} does not exist`);
    }

    if (squad.members.find(iter => iter.charID == charID) != null) {
        return debug(`${charID} is already part of squad ${squadName}, no need to move`);
    }

    const oldSquad: Squad | null = this.getSquadOfMember(charID);
    if (oldSquad != null) {
        debug(`${charID} is currently in ${oldSquad.name}, moving out of it`);
        oldSquad.members = oldSquad.members.filter(iter => iter.charID != charID);

        if (oldSquad.members.length == 0 && oldSquad.guess == true) {
            this.squad.guessSquads = this.squad.guessSquads.filter(iter => iter.name != oldSquad.name);
        }
    }

    squad.members.push(member);
}

Core.prototype.getSquadOfMember = function(charID: string): Squad | null {
    const check = (squad: Squad) => {
        return squad.members.find(iter => iter.charID == charID) != null;
    }

    if (check(this.squad.squad1)) {
        return this.squad.squad1;
    } else if (check(this.squad.squad2)) {
        return this.squad.squad2;
    } else if (check(this.squad.squad3)) {
        return this.squad.squad3;
    } else if (check(this.squad.squad4)) {
        return this.squad.squad4;
    }

    for (const squad of this.squad.guessSquads) {
        if (check(squad)) {
            return squad;
        }
    }

    return null;
}

Core.prototype.mergeSquads = function(into: Squad, from: Squad): void {
    into.members.push(...from.members);
    from.members = [];

    if (from.guess == true) {
        debug(`${from.name} is a guess, removing from list`);
        this.squad.guessSquads = this.squad.guessSquads.filter(iter => iter.name != from.name);
    }
}

let squadNameIndex: number = 0; 
let squadNames: string[] = [
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d",
    "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"
];

Core.prototype.createSquad = function(): Squad {
    const squad: Squad = new Squad();
    squad.name = squadNames[(squadNameIndex++) % 26];

    this.squad.guessSquads.push(squad);

    return squad;
}

Core.prototype.removeMember = function(charID: string): void {
    log(`Removing ${charID} from squads`);

    const squad: Squad | null = this.getSquadOfMember(charID);
    if (squad != null) {
        debug(`${charID} was in squad ${squad.name}, removing`);

        squad.members = squad.members.filter(iter => iter.charID != charID);
        if (squad.members.length == 0 && squad.guess == true) {
            this.squad.guessSquads = this.squad.guessSquads.filter(iter => iter.name != squad.name);
        }
    }

    if (this.squad.members.has(charID)) {
        this.squad.members.delete(charID);
    }
}