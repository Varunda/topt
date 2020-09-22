import { ApiResponse } from "census/ApiWrapper";
import { Loadable, Loading } from "Loadable";

import { CharacterAPI, Character } from "census/CharacterAPI";
import { WeaponAPI, Weapon } from "census/WeaponAPI";
import { PsLoadout, PsLoadouts } from "census/PsLoadout";

import { PsEvent } from "PsEvent";
import { TKillEvent, TDeathEvent, TExpEvent } from "events/index";

export class KillfeedEntry {
    public name: string = "";
    public type: "kill" | "death" | "revived" | "unknown" = "unknown";
    public loadout: PsLoadout = PsLoadout.default;
    public timestamp: number = 0;
    public weapon: Loading<Weapon> = Loadable.idle();
}

export class Killfeed {
    public entries: KillfeedEntry[] = [];

    public squad1: KillfeedSquad = new KillfeedSquad();
    public squad2: KillfeedSquad = new KillfeedSquad();
    public squad3: KillfeedSquad = new KillfeedSquad();
    public squad4: KillfeedSquad = new KillfeedSquad();

    public otherSquads: KillfeedSquad[] = [];
}

export class KillfeedOptions {
    public max: number = 25;
    public viewKills: boolean = true;
    public viewDeaths: boolean = true;
}

export class KillfeedMember {
    public name: string = "";
    public charID: string = "";
    public class: string = "";
    public state: "alive" | "dying" | "dead" = "alive";
    public timeDead: number = 0;
    public weapon: string = "";
}

export class KillfeedSquad {
    public name: string = "";
    public members: KillfeedMember[] = [];
    public guess: boolean = true;
    public hovered: boolean = false;

    readonly ID: number;

    private static _previousID: number = 0;

    private static squadNameIndex: number = 0; 
    private static squadNames: string[] = [
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d",
        "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"
    ];

    public constructor() {
        this.ID = ++KillfeedSquad._previousID;
        this.name = KillfeedSquad.squadNames[(KillfeedSquad.squadNameIndex++) % 26];
    }

    public isMember(charID: string): boolean {
        return this.members.find(iter => iter.charID == charID) != null;
    }
}

export class KillfeedGeneration {

    /**
     * All entries that exist in the killfeed system
     */
    private static _entries: KillfeedEntry[] = [];

    /**
     * List of squads that are being tracked and guessed on
     */
    private static _squads: KillfeedSquad[] = [];

    private static _squad1: KillfeedSquad = new KillfeedSquad();
    private static _squad2: KillfeedSquad = new KillfeedSquad();
    private static _squad3: KillfeedSquad = new KillfeedSquad();
    private static _squad4: KillfeedSquad = new KillfeedSquad();

    private static _members: Map<string, KillfeedMember> = new Map();

    private static _hoveredSquad: KillfeedSquad | null = null;
    private static _hoveredMember: KillfeedMember | null = null;

    private static squadEvents: string[] = [
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

    private static nonSquadEvents: string[] = [
        PsEvent.heal,
        PsEvent.revive,
        PsEvent.resupply,
        PsEvent.shieldRepair,
        PsEvent.motionDetect,
        PsEvent.radarDetect,
        PsEvent.spotKill,
    ];

    public static generate(options: KillfeedOptions): Killfeed {
        let src: KillfeedEntry[] = this._entries;

        if (options.viewKills == false) {
            src = src.filter(iter => iter.type != "kill");
        }
        if (options.viewDeaths == false) {
            src = src.filter(iter => iter.type != "death");
        }

        return {
            entries: src.slice(0, options.max),
            squad1: this._squad1,
            squad2: this._squad2,
            squad3: this._squad3,
            squad4: this._squad4,
            otherSquads: this._squads
        };
    }

    public static setHoveredSquad(name: string): void {
        if (this._squad1.name == name) {
            this._hoveredSquad = this._squad1;
        } else if (this._squad2.name == name) {
            this._hoveredSquad = this._squad2;
        } else if (this._squad3.name == name) {
            this._hoveredSquad = this._squad3;
        } else if (this._squad4.name == name) {
            this._hoveredSquad = this._squad4;
        } else {
            let found: boolean = false;
            for (const squad of this._squads) {
                if (squad.name == name) {
                    this._hoveredSquad = squad;
                    found = true;
                    break;
                }
            }

            if (found == false) {
                console.error(`Failed to find squad named ${name}`);
            }
        }

        if (this._hoveredSquad != null) {
            this._hoveredSquad.hovered = true;
        }
    }

    public static clearHoveredSquad(): void {
        if (this._hoveredSquad != null) {
            this._hoveredSquad.hovered = false;
        }
        this._hoveredSquad = null;
    }

    public static setHoveredMember(memberID: string): void {
        if (this._members.has(memberID)) {
            const member: KillfeedMember = this._members.get(memberID)!;
            this._hoveredMember = member;
        }
    }

    public static clearHoveredMember(): void {
        this._hoveredMember = null;
    }

    public static add(event: TKillEvent | TDeathEvent): void {
        const entry: KillfeedEntry = new KillfeedEntry();

        entry.timestamp = event.timestamp;

        CharacterAPI.getByID(event.sourceID).ok((data: Character) => {
            entry.name = data.name;
        });

        if (event.weaponID != "0") {
            entry.weapon = Loadable.loading();
            WeaponAPI.getByID(event.weaponID).ok((data: Weapon) => {
                entry.weapon = Loadable.loaded(data);
            });
        }

        if (event.type == "kill") {
            entry.type = "kill";

            if (this._members.has(event.sourceID)) {
                const member: KillfeedMember = this._members.get(event.sourceID)!;
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
            entry.type = "death";

            if (this._members.has(event.sourceID)) {
                const member: KillfeedMember = this._members.get(event.sourceID)!;
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

        this._entries.unshift(entry);
    }

    public static exp(event: TExpEvent): void {
        if (event.expID == PsEvent.revive || event.expID == PsEvent.squadRevive) {
            if (this._members.has(event.targetID)) {
                const member: KillfeedMember = this._members.get(event.targetID)!;

                member.state = "alive";
                member.timeDead = 0;
                member.weapon = "";
            }
        }

        if (this._members.has(event.sourceID)) {
            const member: KillfeedMember = this._members.get(event.sourceID)!;
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

        const sourceMember: KillfeedMember | undefined = this._members.get(event.sourceID);
        const targetMember: KillfeedMember | undefined = this._members.get(event.targetID);

        if (sourceMember == undefined || targetMember == undefined) {
            return;
        }

        let sourceSquad: KillfeedSquad | null = this.getSquadOfMember(event.sourceID);
        let targetSquad: KillfeedSquad | null = this.getSquadOfMember(event.targetID);

        if (sourceSquad == null) {
            sourceSquad = new KillfeedSquad();
            sourceSquad.members.push(sourceMember);
        }

        if (targetSquad == null) {
            targetSquad = new KillfeedSquad();
            targetSquad.members.push(targetMember);
        }

        // Check if the squads need to be merged into one another if this was a squad exp source
        if (this.squadEvents.indexOf(event.trueExpID) > -1) {
            if (sourceSquad.ID == targetSquad.ID) {
                //console.log(`${sourceMember.name} // ${targetMember.name} are already in a squad`);
            } else {
                // 3 cases:
                //      1. Both squads are guesses => Merge squads
                //      2. One squad isn't a guess => Move guess squad into non-guess squad
                //      3. Neither squad is a guess => Move member who performed action into other squad
                if (targetSquad.guess == true && sourceSquad.guess == true) {
                    console.log(`Both squads are guesses, merging ${sourceMember.name} (${sourceSquad.name}) into ${targetMember.name} (${targetSquad.name})`);

                    for (const member of sourceSquad.members) {
                        targetSquad.members.push(member);
                    }

                    // Remove any references in or to the removed squad so it can be garbage collected
                    sourceSquad.members = [];
                    this._squads = this._squads.filter(iter => iter.ID != sourceSquad!.ID); 
                } else if (targetSquad.guess == false && sourceSquad.guess == true) {
                    console.log(`Target is not a guess, merging ${sourceMember.name} (${sourceSquad.name}) into ${targetMember.name} (${targetSquad.name})`);
                    for (const member of sourceSquad.members) {
                        targetSquad.members.push(member);
                    }

                    // Remove any references in or to the removed squad so it can be garbage collected
                    sourceSquad.members = [];
                    this._squads = this._squads.filter(iter => iter.ID != sourceSquad!.ID); 
                } else if (targetSquad.guess == true && sourceSquad.guess == false) {
                    console.log(`Source is not a guess, merging ${targetMember.name} (${targetSquad.name}) into ${sourceMember.name} (${sourceSquad.name})`);
                    for (const member of targetSquad.members) {
                        sourceSquad.members.push(member);
                    }

                    // Remove any references in or to the removed squad so it can be garbage collected
                    targetSquad.members = [];
                    this._squads = this._squads.filter(iter => iter.ID != targetSquad!.ID); 
                } else if (targetSquad.guess == false && sourceSquad.guess == false) {
                    console.log(`Neither squad is a guess, moving ${targetMember.name} into ${sourceMember.name} (${sourceSquad.name})`);
                    sourceSquad.members.push(targetMember);
                    targetSquad.members = targetSquad.members.filter(iter => iter.charID != targetMember.charID);
                }

            }
        }

        // Check if the squad is no longer valid and needs to be removed, i.e. moved squads
        if (this.nonSquadEvents.indexOf(event.trueExpID) > -1) {
            //console.log(`Non squad event: ${event.trueExpID}`);
            if (sourceSquad.ID == targetSquad.ID) {
                console.log(`${sourceMember.name} was in squad with ${targetMember.name}, but didn't get an expect squad exp event`);

                targetSquad.members = targetSquad.members.filter(iter => iter.charID != sourceMember.charID);

                const squad: KillfeedSquad = new KillfeedSquad();
                squad.members.push(sourceMember);

                this._squads.push(squad);
            }
        }
    }

    public static moveMember(squadName: string): void {
        if (this._hoveredMember == null) { return; }

        let currentSquad: KillfeedSquad | null = null;

        const memberID: string = this._hoveredMember.charID;

        if (this._squad1.isMember(memberID)) {
            currentSquad = this._squad1;
        } else if (this._squad2.isMember(memberID)) {
            currentSquad = this._squad2;
        } else if (this._squad3.isMember(memberID)) {
            currentSquad = this._squad3;
        } else if (this._squad4.isMember(memberID)) {
            currentSquad = this._squad4;
        } else {
            for (const iter of this._squads) {
                if (iter.isMember(memberID)) {
                    currentSquad = iter;
                    break;
                }
            }
        }

        if (currentSquad == null) {
            return console.error(`Failed to find the squad ${this._hoveredMember.name} was in`);
        }

        const squad: KillfeedSquad | null = this.getSquad(squadName);
        if (squad == null) {
            return console.error(`Cannot move ${this._hoveredMember.name} into ${squadName}: Does not exist`);
        }

        currentSquad.members = currentSquad.members.filter(iter => iter.charID != memberID);
        if (currentSquad.members.length == 0) {
            this._squads = this._squads.filter(iter => iter.ID != currentSquad!.ID);
        }

        squad.members.push(this._hoveredMember);
    }

    public static mergeSquads(squadName: string): void {
        if (this._hoveredSquad == null) { return; }
        if (this._hoveredSquad.name == squadName) { return; }

        const squad: KillfeedSquad | null = this.getSquad(squadName);

        if (squad == null) {
            return;
        }

        for (const member of this._hoveredSquad.members) {
            squad.members.push(member);
        }

        this._hoveredSquad.members = [];
        this._squads = this._squads.filter(iter => iter.ID != this._hoveredSquad!.ID);
    }

    public static removeMember(charID: string): void {
        const squad: KillfeedSquad | null = this.getSquadOfMember(charID);

        console.log(`Remove ${charID} from tracking ${squad?.name}`);

        if (squad != null) {
            squad.members = squad.members.filter(iter => iter.charID != charID);
            console.log(`${squad.members.length} members after removing ${charID}`);
            if (squad.members.length == 0) {
                this._squads = this._squads.filter(iter => iter.ID != squad.ID);
            }
        }

        if (this._members.has(charID)) {
            this._members.delete(charID);
        }
    }

    public static addMember(charID: string): void {
        if (this._members.has(charID)) {
            return;
        }

        console.log(`Adding ${charID} to the killfeed`);

        CharacterAPI.getByID(charID).ok((character: Character) => {
            const member: KillfeedMember = this.toMember(character);

            this._members.set(character.ID, member);

            if (character.online == true) {
                const squad: KillfeedSquad = new KillfeedSquad();
                squad.members.push(member);

                this._squads.push(squad);
            }

            console.log(`Added ${character.name}`);
        });
    }

    public static addCharacters(characters: Character[]): void {
        for (const char of characters) {
            const member: KillfeedMember = this.toMember(char);

            this._members.set(char.ID, member);

            if (char.online == true) {
                const squad: KillfeedSquad = new KillfeedSquad();
                squad.members.push(member);

                this._squads.push(squad);
            }
        }
    }

    public static getHovered(): "squad" | "member" | null {
        if (this._hoveredSquad != null) {
            return "squad";
        }
        if (this._hoveredMember != null) {
            return "member";
        }
        return null;
    }

    public static init(): void {
        this._squad1.name = "1";
        this._squad1.guess = false;

        this._squad2.name = "2";
        this._squad2.guess = false;

        this._squad3.name = "3";
        this._squad3.guess = false;

        this._squad4.name = "4";
        this._squad4.guess = false;
    }

    private static getSquadOfMember(charID: string): KillfeedSquad | null {
        if (this._squad1.isMember(charID)) {
            return this._squad1;
        }
        if (this._squad2.isMember(charID)) {
            return this._squad2;
        }
        if (this._squad3.isMember(charID)) {
            return this._squad3;
        }
        if (this._squad4.isMember(charID)) {
            return this._squad4;
        }

        return this._squads.find((iter: KillfeedSquad) => {
            return iter.members.find(elem => elem.charID == charID) != null;
        }) || null;
    }

    private static toMember(char: Character): KillfeedMember {
        return {
            name: char.name,
            charID: char.ID,
            class: "",
            state: "alive",
            timeDead: 0,
            weapon: ""
        }
    }

    private static getSquad(squadName: string): KillfeedSquad | null {
        if (squadName == "1") {
            return this._squad1;
        } else if (squadName == "2") {
            return this._squad2;
        } else if (squadName == "3") {
            return this._squad3;
        } else if (squadName == "4") {
            return this._squad4;
        } else {
            return this._squads.find(iter => iter.name == squadName) || null;
        }
    }

}
(window as any).KillfeedGeneration = KillfeedGeneration;
KillfeedGeneration.init();