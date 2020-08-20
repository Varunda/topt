import { TLoadoutEvent } from "./TLoadoutEvent";
import { TZoneEvent } from "./TZoneEvent";
import { TTargetEvent } from "./TTargetEvent";

/**
 * Event for when a player gains experience from an event
 */
export type TExpEvent = {

    /**
     * Type of event this event is
     */
    type: "exp";

    /**
     * Character ID of the character that produced the TEvent
     */
    sourceID: string;

    /**
     * Timestamp in UTC milliseconds of when this TEvent was produced
     */
    timestamp: number;

    /**
     * ID of the loadout that the source was when this event was produced
     */
    loadoutID: string;

    /**
     * ID of the zone (continent) the source was on when the event was produced
     */
    zoneID: string;

    /**
     * Entity ID of the target that this event effected. This is usually a character ID,
     * but is not always. For example, it may be an NPC when someone spawns on a router
     */
    targetID: string;

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