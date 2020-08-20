
/**
 * Occurs when a player tracked kills another player who is on a different faction
 */
export type TKillEvent = {
    
    /**
     * Type of event
     */
    type: "kill";

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
     * Entity ID of the target that this event effected. This is usually a character ID,
     * but is not always. For example, it may be an NPC when someone spawns on a router
     */
    targetID: string;

    /**
     * Loadout ID of the character who was killed by the source
     */
    targetLoadoutID: string;

    /**
     * ID of the weapon used to kill the target
     */
    weaponID: string;

    /**
     * If this kill was a headshot kill
     */
    isHeadshot: boolean;

}