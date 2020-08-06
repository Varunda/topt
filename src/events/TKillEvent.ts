import { TLoadoutEvent } from "./TLoadoutEvent";
import { TZoneEvent } from "./TZoneEvent";
import { TTargetEvent } from "./TTargetEvent";

/**
 * Occurs when a player tracked kills another player who is on a different faction
 */
export interface TKillEvent extends TLoadoutEvent, TZoneEvent, TTargetEvent {
    
    /**
     * Type of event
     */
    type: "kill";

    /**
     * Loadout ID of the character who was killed by the source
     */
    targetLoadoutID: string;

    /**
     * ID of the weapon used to kill the target
     */
    weaponID: string;

    /**
     * If this kill was a headshot kill
     */
    isHeadshot: boolean;

}