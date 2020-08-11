import { TEvent } from "./TEvent";

/**
 * Occurs when a tracked player logs out
 */
export interface TLogoutEvent extends TEvent {

    /**
     * Type of event
     */
    type: "logout";
    
}