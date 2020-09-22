
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

}