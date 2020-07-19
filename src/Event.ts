export type Event = EventExp | EventKill | EventDeath | EventTeamkill | EventVehicleKill | EventCapture | EventDefend;

export type EventExp = {
    type: "exp";
    sourceID: string;
    targetID: string;
    timestamp: number;
    loadoutID: string;
    zoneID: string;

    expID: string;
    trueExpID: string;
    amount: number;
}

export type EventKill = {
    type: "kill";
    sourceID: string;
    targetID: string;
    timestamp: number;
    loadoutID: string;
    zoneID: string;

    targetLoadoutID: string;
    weaponID: string;
    isHeadshot: boolean;
}

export type EventDeath = {
    /**
     * Union type
     */
    type: "death";

    /**
     * ID of the character who was killed
     */
    sourceID: string;

    /**
     * ID of the character who killed the character
     */
    targetID: string;

    /**
     * Timestamp of when the character died
     */
    timestamp: number;

    /**
     * ID of the loadout of the character who was killed
     */
    loadoutID: string;

    /**
     * ID of the loadout the killer
     */
    targetLoadoutID: string;

    /**
     * Weapon used to kill the killed
     */
    weaponID: string;

    /**
     * If this death came from a headshot
     */
    isHeadshot: boolean;

    /**
     * Was the killed player revived?
     */
    revived: boolean;

    /**
     * Event that was the revive of the death
     */
    revivedEvent: EventExp | null;

    /**
     * Zone (Continent) this event occurred on
     */
    zoneID: string;
}

export type EventTeamkill = {
    type: "teamkill";

    sourceID: string;
    loadoutID: string;
    targetID: string;
    targetLoadoutID: string;

    zoneID: string;
    weaponID: string;
    timestamp: number;
}

export type EventCapture = {

    /**
     * Type of event
     */
    type: "capture";

    /**
     * ID of the character who did the cap
     */
    sourceID: string;

    /**
     * ID of the zone the capture was in
     */
    zoneID: string;

    /**
     * ID of the outfit the player is a part of
     */
    outfitID: string;

    /**
     * Timestamp, ms
     */
    timestamp: number;

    /**
     * ID of the facility that was captured
     */
    facilityID: string;
}

export type EventDefend = {

    /**
     * This event will occur when a player gets a facility defense
     */
    type: "defend";

    /**
     * ID of the character who did the defense
     */
    sourceID: string;

    /**
     * ID of the zone the defense was in
     */
    zoneID: string;

    /**
     * ID of the outfit the player is a part of
     */
    outfitID: string;

    /**
     * Timestamp, ms
     */
    timestamp: number;

    /**
     * ID of the facility that was defended
     */
    facilityID: string;

}

export type EventVehicleKill = {
    /**
     * Type of event
     */
    type: "vehicle";

    /**
     * ID of the character who killed the vehicle
     */
    sourceID: string;

    /**
     * Zone the vehicle was killed in
     */
    zoneID: string;

    /**
     * ID of the character who was driving in the vehicle, not always filled out
     */
    targetID: string;

    /**
     * Timestamp of when the event occured, ms
     */
    timestamp: number;

    /**
     * Loadout of the character who killed the vehicle
     */
    loadoutID: string;

    /**
     * What type of vehicle was destroyed
     */
    vehicleID: string;

    /**
     * Weapon used to kill the vehicle, not always filled out
     */
    weaponID: string;
}