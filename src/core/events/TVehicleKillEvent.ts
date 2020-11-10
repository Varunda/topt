
/**
 * Event when a tracked player kills a vehicle
 */
export type TVehicleKillEvent = {

    /**
     * Type of event
     */
    type: "vehicle";

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
     * ID of the weapon used to kill the vehicle
     */
    weaponID: string;

    /**
     * ID of the vehicle that was killed
     */
    vehicleID: string;

}