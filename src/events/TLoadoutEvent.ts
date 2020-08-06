import { TEvent } from "./TEvent";

/**
 * TEvent that includes the loadoutID of the source
 */
export interface TLoadoutEvent extends TEvent {

    /**
     * ID of the loadout that the source was when this event was produced
     */
    loadoutID: string;

}