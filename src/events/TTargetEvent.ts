import { TEvent } from "./TEvent";

/**
 * For events that contain a target ID field
 */
export interface TTargetEvent extends TEvent {

    /**
     * Entity ID of the target that this event effected. This is usually a character ID,
     * but is not always. For example, it may be an NPC when someone spawns on a router
     */
    targetID: string;

}