
/**
 * Occurs when a character participates in the capture of a base
 */
export type TCaptureEvent = {

    /**
     * Type of event this TEvent is
     */
    type: "capture";

    /**
     * Character ID of the character that produced the TEvent
     */
    sourceID: string;

    /**
     * ID of the zone (continent) the source was on when the event was produced
     */
    zoneID: string;

    /**
     * Timestamp in UTC milliseconds of when this TEvent was produced
     */
    timestamp: number;

    /**
     * ID of the outfit the source is a part of. Is "0" if no outfit
     */
    outfitID: string;

    /**
     * ID of the facility that was captured
     */
    facilityID: string;

}