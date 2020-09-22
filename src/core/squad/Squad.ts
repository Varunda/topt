
import { SquadMember } from "core/squad/SquadMember";

export class Squad {

    /**
     * Display name of the squad
     */
    public name: string = "";

    /**
     * Members that are currently in the squad
     */
    public members: SquadMember[] = [];

    /**
     * If this squad is a guess squad or not, affects how automatic merging is done
     */
    public guess: boolean = true;

    /**
     * Internal ID of the squad, useful for debugging
     */
    readonly ID: number;

    private static _previousID: number = 0;

    private static squadNameIndex: number = 0; 
    private static squadNames: string[] = [
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d",
        "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"
    ];

    public constructor() {
        this.ID = ++Squad._previousID;
        this.name = Squad.squadNames[(Squad.squadNameIndex++) % 26];
    }

    /**
     * Check if a member is within this squad
     * 
     * @param charID Character ID to check membership of
     */
    public isMember(charID: string): boolean {
        return this.members.find(iter => iter.charID == charID) != null;
    }

}