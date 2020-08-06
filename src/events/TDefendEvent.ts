import { TZoneEvent } from "./TZoneEvent";

/**
 * Occurs when a player participates in the defense of a base
 */
export interface TDefendEvent extends TZoneEvent {

    /**
     * Type of event
     */
    type: "defend";

    /**
     * ID of the outfit the source is a part of. Is "0" if no outfit
     */
    outfitID: string;

    /**
     * ID of the facility that was defended
     */
    facilityID: string;

}