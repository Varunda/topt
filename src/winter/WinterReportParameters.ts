import { TrackedPlayer, TimeTracking } from "InvididualGenerator";

import { TEvent } from "events/index";

export class WinterReportParameters {
    public players: TrackedPlayer[] = [];
    public events: TEvent[] = [];
    public timeTracking: TimeTracking = { startTime: 0, endTime: 0, running: false };
    public settings: WinterReportSettings = new WinterReportSettings();
}

export class WinterReportSettings {
    public useFunNames: boolean = false;
    public topNPlayers: number = 5;
    public funMetricCount: number = -1;
}