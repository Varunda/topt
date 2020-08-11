import { TEvent } from "./TEvent";

/**
 * Occurs when a player logs in
 */
export interface TLoginEvent extends TEvent {
    
    /**
     * Type of event
     */
    type: "login";

}