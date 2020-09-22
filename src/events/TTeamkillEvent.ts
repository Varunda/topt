
/**
 * Occurs when a tracked character kills another character on the same faction as themselves
 */
export type TTeamkillEvent = {
    
    /**
     * Type of event
     */
    type: "teamkill";

    /**
     * Character ID of the character that produced the TEvent
     */
    sourceID: string;

    /**
     * Timestamp in UTC milliseconds of when this TEvent was produced
     */
    timestamp: number;

    /**
     * ID of the loadout that the source was when this event was produced
     */
    loadoutID: string;

    /**
     * ID of the zone (continent) the source was on when the event was produced
     */
    zoneID: string;

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

}