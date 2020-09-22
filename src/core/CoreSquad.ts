import { Core } from "core/Core";

import { TKillEvent, TDeathEvent, TExpEvent } from "events/index";
import { PsLoadout, PsLoadouts } from "census/PsLoadout";
import { PsEvent } from "PsEvent";

import { Squad } from "./squad/Squad";
import { SquadMember } from "./squad/SquadMember";

declare module "Core" {

    export interface Core {

        /**
         * Set the currently selected squad 
         * 
         * @param name Name of the squad to be selected
         */
        setSelectedSquad(name: string): void

        /**
         * Clear the currently selected squad
         */
        clearSelectedSquad(): void

        /**
         * Set the currently selected member
         * 
         * @param charID Character ID of the member to set as the selected member
         */
        setSelectedMember(charID: string): void

        /**
         * Clear the currently selected member
         */
        clearSelectedMember(): void

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
        mergeSquads(mergeInto: string, mergeFrom: string): void

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
        removeMemberFromSquad(charID: string): void

    }
}

const squadEvents: string[] = [
    PsEvent.squadResupply,
    PsEvent.squadHeal,
    PsEvent.squadMaxRepair,
    PsEvent.squadMotionDetect,
    PsEvent.squadRadarDetect,
    PsEvent.squadRevive,
    PsEvent.squadShieldRepair,
    PsEvent.squadSpawn,
    PsEvent.squadSpotKill
];

const nonSquadEvents: string[] = [
    PsEvent.heal,
    PsEvent.revive,
    PsEvent.resupply,
    PsEvent.shieldRepair,
    PsEvent.motionDetect,
    PsEvent.radarDetect,
    PsEvent.spotKill,
];

Core.prototype.setSelectedSquad = function(squadName: string): void {
    const squad: Squad | null = this.getSquad(squadName);
    this.squad.selected = squad;
}

Core.prototype.clearSelectedSquad = function(): void {
    this.squad.selected = null;
}

Core.prototype.processKillDeathEvent = function(event: TKillEvent | TDeathEvent): void {
    if (event.type == "kill") {
        if (this.squad.members.has(event.sourceID)) {
            const member: SquadMember = this.squad.members.get(event.sourceID)!;
            member.state = "alive";

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
            member.state = "dead";

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

Core.prototype.processExperienceEvent = function(event: TExpEvent): void {
    if (event.expID == PsEvent.revive || event.expID == PsEvent.squadRevive) {
        if (this.squad.members.has(event.targetID)) {
            const member: SquadMember = this.squad.members.get(event.targetID)!;

            member.state = "alive";
            member.timeDead = 0;
        }
    }

    if (this.squad.members.has(event.sourceID)) {
        const member: SquadMember = this.squad.members.get(event.sourceID)!;
        member.state = "alive";

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

    const sourceMember: SquadMember | undefined = this.squad.members.get(event.sourceID);
    const targetMember: SquadMember | undefined = this.squad.members.get(event.targetID);

    if (sourceMember == undefined || targetMember == undefined) {
        return;
    }

    let sourceSquad: Squad | null = this.getSquadOfMember(event.sourceID);
    let targetSquad: Squad | null = this.getSquadOfMember(event.targetID);

    if (sourceSquad == null) {
        sourceSquad = new Squad();
        sourceSquad.members.push(sourceMember);
    }

    if (targetSquad == null) {
        targetSquad = new Squad();
        targetSquad.members.push(targetMember);
    }

    // Check if the squads need to be merged into one another if this was a squad exp source
    if (squadEvents.indexOf(event.trueExpID) > -1) {
        if (sourceSquad.ID == targetSquad.ID) {
            //console.log(`${sourceMember.name} // ${targetMember.name} are already in a squad`);
        } else {
            // 3 cases:
            //      1. Both squads are guesses => Merge squads
            //      2. One squad isn't a guess => Move guess squad into non-guess squad
            //      3. Neither squad is a guess => Move member who performed action into other squad
            if (targetSquad.guess == true && sourceSquad.guess == true) {
                console.log(`Both squads are guesses, merging ${sourceMember.name} (${sourceSquad.name}) into ${targetMember.name} (${targetSquad.name})`);

                this.mergeSquads(sourceSquad.name, targetSquad.name);
            } else if (targetSquad.guess == false && sourceSquad.guess == true) {
                console.log(`Target is not a guess, merging ${sourceMember.name} (${sourceSquad.name}) into ${targetMember.name} (${targetSquad.name})`);

                this.mergeSquads(targetSquad.name, sourceSquad.name);
            } else if (targetSquad.guess == true && sourceSquad.guess == false) {
                console.log(`Source is not a guess, merging ${targetMember.name} (${targetSquad.name}) into ${sourceMember.name} (${sourceSquad.name})`);

                this.mergeSquads(sourceSquad.name, targetSquad.name);
            } else if (targetSquad.guess == false && sourceSquad.guess == false) {
                console.log(`Neither squad is a guess, moving ${targetMember.name} into ${sourceMember.name} (${sourceSquad.name})`);
                sourceSquad.members.push(targetMember);
                targetSquad.members = targetSquad.members.filter(iter => iter.charID != targetMember.charID);
            }

        }
    }

    // Check if the squad is no longer valid and needs to be removed, i.e. moved squads
    if (nonSquadEvents.indexOf(event.trueExpID) > -1) {
        //console.log(`Non squad event: ${event.trueExpID}`);
        if (sourceSquad.ID == targetSquad.ID) {
            console.log(`${sourceMember.name} was in squad with ${targetMember.name}, but didn't get an expect squad exp event`);

            targetSquad.members = targetSquad.members.filter(iter => iter.charID != sourceMember.charID);

            const squad: Squad = new Squad();
            squad.members.push(sourceMember);

            this.squad.guessSquads.push(squad);
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
