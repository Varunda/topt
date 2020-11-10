
/**
 * Occurs when a player logs in
 */
export type TLoginEvent = {
    
    /**
     * Type of event
     */
    type: "login";

    /**
     * Character ID of the character that produced the TEvent
     */
    sourceID: string;

    /**
     * Timestamp in UTC milliseconds of when this TEvent was produced
     */
    timestamp: number;

}