
import { SquadMember } from "core/squad/SquadMember";

export class Squad {

    /**
     * Display name of the squad
     */
    public name: string = "";

    /**
     * Alternate display of a squad, such as Alpha/Bravo/etc.
     */
    public display: string | null = null;

    /**
     * Members that are currently in the squad
     */
    public members: SquadMember[] = [];

    /**
     * Members went offline during stats
     */
    public offline: SquadMember[] = [];

    /**
     * If this squad is a guess squad or not, affects how automatic merging is done
     */
    public guess: boolean = true;

    /**
     * Internal ID of the squad, useful for debugging
     */
    readonly ID: number;

    private static _previousID: number = 0;

    public constructor() {
        this.ID = ++Squad._previousID;
    }

    /**
     * Check if a member is within this squad
     * 
     * @param charID Character ID to check membership of
     */
    public isMember(charID: string): boolean {
        return this.members.find(iter => iter.charID == charID) != null;
    }

    public toString(): string {
        return `Squad ${this.name}: [${this.members.map(iter => iter.name).join(", ")}]`;
    }

}