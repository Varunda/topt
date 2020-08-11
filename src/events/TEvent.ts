export type TEventType = "exp" | "kill" | "death" | "capture" | "defend" | "vehicle" | "teamkill" | "login" | "logout";

/**
 * Base TEvent (TOPT-Event) that all events emitted come from
 */
export interface TEvent {

    /**
     * Type of event this TEvent is
     */
    type: TEventType;

    /**
     * Character ID of the character that produced the TEvent
     */
    sourceID: string;

    /**
     * Timestamp in UTC milliseconds of when this TEvent was produced
     */
    timestamp: number;

}