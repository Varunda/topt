import { TLoadoutEvent } from "./TLoadoutEvent";
import { TZoneEvent } from "./TZoneEvent";
import { TTargetEvent } from "./TTargetEvent";

/**
 * Occurs when a tracked character kills another character on the same faction as themselves
 */
export interface TTeamkillEvent extends TLoadoutEvent, TZoneEvent, TTargetEvent {
    
    /**
     * Type of event
     */
    type: "teamkill";

    /**
     * Loadout ID of the character who was killed by the source
     */
    targetLoadoutID: string;

    /**
     * ID of the weapon used to kill the target
     */
    weaponID: string;

}