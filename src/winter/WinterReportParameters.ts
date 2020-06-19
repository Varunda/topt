import { TrackedPlayer, TimeTracking } from "InvididualGenerator";
import { Event } from "Event";

export class WinterReportParameters {
    public players: TrackedPlayer[] = [];
    public events: Event[] = [];
    public timeTracking: TimeTracking = { startTime: 0, endTime: 0, running: false };
    public settings: WinterReportSettings = new WinterReportSettings();
}

export class WinterReportSettings {
    public useFunNames: boolean = true;
    public topNPlayers: number = 5;
    public funMetricCount: number = 10;
}