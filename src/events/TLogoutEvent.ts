
/**
 * Occurs when a tracked player logs out
 */
export type TLogoutEvent = {

    /**
     * Type of event
     */
    type: "logout";

    /**
     * Character ID of the character that produced the TEvent
     */
    sourceID: string;

    /**
     * Timestamp in UTC milliseconds of when this TEvent was produced
     */
    timestamp: number;
    
}