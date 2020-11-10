import { TExpEvent } from "./TExpEvent";

/**
 * Occurs when a character that is being tracked is killed by a character on a different faction
 */
export type TDeathEvent = {

    /**
     * Type of event
     */
    type: "death";

    /**
     * Character ID of the character that produced the TEvent
     */
    sourceID: string;

    /**
     * Timestamp in UTC milliseconds of when this TEvent was produced
     */
    timestamp: number;

    /**
     * ID of the zone (continent) the source was on when the event was produced
     */
    zoneID: string;

    /**
     * ID of the loadout that the source was when this event was produced
     */
    loadoutID: string;

    /**
     * ID of the weapon used to kill the source
     */
    weaponID: string;

    /**
     * Entity ID of the target that this event effected. This is usually a character ID,
     * but is not always. For example, it may be an NPC when someone spawns on a router
     */
    targetID: string;

    /**
     * Loadout ID of the character who killed the source
     */
    targetLoadoutID: string;

    /**
     * If this death from a headshot?
     */
    isHeadshot: boolean;

    /**
     * Was the killed player revived?
     */
    revived: boolean;

    /**
     * Event that was the revive of the death
     */
    revivedEvent: TExpEvent | null;

}