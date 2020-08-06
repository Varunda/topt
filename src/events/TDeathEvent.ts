import { TLoadoutEvent } from "./TLoadoutEvent";
import { TExpEvent } from "./TExpEvent";
import { TZoneEvent } from "./TZoneEvent";
import { TTargetEvent } from "./TTargetEvent";

/**
 * Occurs when a character that is being tracked is killed by a character on a different faction
 */
export interface TDeathEvent extends TLoadoutEvent, TZoneEvent, TTargetEvent {
    
    /**
     * Type of event
     */
    type: "death";

    /**
     * Loadout ID of the character who killed the source
     */
    targetLoadoutID: string;

    /**
     * ID of the weapon used to kill the source
     */
    weaponID: string;

    /**
     * If this death from a headshot?
     */
    isHeadshot: boolean;

    /**
     * Was the killed player revived?
     */
    revived: boolean;

    /**
     * Event that was the revive of the death
     */
    revivedEvent: TExpEvent | null;

}