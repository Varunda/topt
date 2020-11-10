import StatMap from "core/StatMap";
import { TEvent, TDeathEvent } from "core/events/index";

/**
 * Represents a character that is being tracked
 */
export class TrackedPlayer {

    /**
     * Unique character ID of the tracked player
     */
    public characterID: string = "";

    /**
     * Tag of the outfit, if the character is in one
     */
    public outfitTag: string = "";

    /**
     * Name of the character
     */
    public name: string = "";

    /**
     * What faction the character is a part of
     */
    public faction: string = "";

    /**
     * How much accumulated score a character has gotten during tracking
     */
    public score: number = 0;

    /**
     * If this character is currently online
     */
    public online: boolean = true;

    /**
     * What time (in MS) the character more recently joined, to a minimum of when the tracker started
     */
    public joinTime: number = 0;

    /**
     * How many seconds the character has been online for
     */
    public secondsOnline: number = 0;

    /**
     * How many times a character has gotten each experience event
     */
    public stats: StatMap = new StatMap();

    /**
     * How many times a character has gotten each ribbon
     */
    public ribbons: StatMap = new StatMap();

    /**
     * Reference to the most recent death event, used for tracking revives
     */
    public recentDeath: TDeathEvent | null = null;

    /**
     * The events that have occured because of a player
     */
    public events: TEvent[] = [];

}