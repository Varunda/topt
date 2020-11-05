
export class SquadMember {

    /**
     * Display name of the squad member
     */
    public name: string = "";

    /**
     * Character ID of the squad member
     */
    public charID: string = "";

    /**
     * What class the squad member currently is
     */
    public class: string = "";

    /**
     * The current state of the squad member
     */
    public state: "alive" | "dying" | "dead" = "alive";

    /**
     * How many seconds the squad member has been dead for
     */
    public timeDead: number = 0;

    /**
     * Timestamp (in MS) of when this character died
     */
    public whenDied: number | null = null;

    /**
     * How many seconds until they can place a beacon again
     */
    public beaconCooldown: number = 0;

    /**
     * Timestamp (in MS) of when this character last put a beacon down
     */
    public whenBeacon: number | null = null;

    /**
     * Is this squad member online or not
     */
    public online: boolean = true;

}