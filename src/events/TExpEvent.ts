import { TLoadoutEvent } from "./TLoadoutEvent";
import { TZoneEvent } from "./TZoneEvent";
import { TTargetEvent } from "./TTargetEvent";

/**
 * Event for when a player gains experience from an event
 */
export interface TExpEvent extends TLoadoutEvent, TZoneEvent, TTargetEvent {

    /**
     * Type of event this event is
     */
    type: "exp";

    /**
     * ID of the experience this event produced. If this event was generated from an aliased event,
     * use trueExpID to see what streaming event exp ID was actually produced. For example, squad revives are
     * aliased to the revive event
     */
    expID: string;

    /**
     * Contains the exp ID from the streaming API. This may differ from the expID if the event is aliased
     * to another event, such as a squad revive becoming a revive exp ID
     */
    trueExpID: string;

    /**
     * How much score (not experience) was given to the player for this event being performed
     */
    amount: number;

}