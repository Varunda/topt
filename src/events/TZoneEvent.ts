import { TEvent } from "./TEvent";

export interface TZoneEvent extends TEvent {

    /**
     * ID of the zone (continent) the source was on when the event was produced
     */
    zoneID: string;

}