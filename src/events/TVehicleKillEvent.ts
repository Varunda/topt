import { TLoadoutEvent } from "./TLoadoutEvent";
import { TZoneEvent } from "./TZoneEvent";
import { TTargetEvent } from "./TTargetEvent";

/**
 * Event when a tracked player kills a vehicle
 */
export interface TVehicleKillEvent extends TLoadoutEvent, TZoneEvent, TTargetEvent {

    /**
     * Type of event
     */
    type: "vehicle";

    /**
     * ID of the weapon used to kill the vehicle
     */
    weaponID: string;

    /**
     * ID of the vehicle that was killed
     */
    vehicleID: string;

}