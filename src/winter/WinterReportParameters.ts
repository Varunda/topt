import { TrackedPlayer, TimeTracking } from "InvididualGenerator";

import { TEvent } from "events/index";

export class WinterReportParameters {
    public players: TrackedPlayer[] = [];
    public events: TEvent[] = [];
    public timeTracking: TimeTracking = { startTime: 0, endTime: 0, running: false };
    public settings: WinterReportSettings = new WinterReportSettings();
}

export class WinterReportSettings {
    /**
     * If the fun names will be used instead of descriptive names
     */
    public useFunNames: boolean = false;

    /**
     * How many players to show for each card
     */
    public topNPlayers: number = 5;

    /**
     * How many fun metrics to show. Fun being like unique revives, -1 to show all
     */
    public funMetricCount: number = -1;

    /**
     * Char IDs of players to ignore and skip if they are in the top
     */
    public ignoredPlayers: string[] = [];

}