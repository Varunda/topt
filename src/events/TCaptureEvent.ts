import { TZoneEvent } from "./TZoneEvent";

/**
 * Occurs when a character participates in the capture of a base
 */
export interface TCaptureEvent extends TZoneEvent {

    /**
     * What type of event this event is
     */
    type: "capture";

    /**
     * ID of the outfit the source is a part of. Is "0" if no outfit
     */
    outfitID: string;

    /**
     * ID of the facility that was captured
     */
    facilityID: string;

}