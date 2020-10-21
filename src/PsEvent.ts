// What type of event is currently being looked at
export type PsEventType = "general" | "versus" | "recon" | "logistics" | "medic" | "engineer" | "objective";

export class PsEvent {

    // Display friendly name
    public name: string = "";

    // What type of event is this?
    public types: PsEventType[] = [];

    // Is this an event that will be kept track of in the map?
    public track: boolean = true;

    public alsoIncrement?: string = undefined;

    public static default: PsEvent = {
        name: "Default",
        types: [],
        track: false
    };

    public static other: PsEvent = {
        name: "Other",
        types: [],
        track: false
    };

    // General events
    public static kill: string = "1";
    public static killAssist: string = "2";
    public static headshot: string = "37";
    public static teamkill: string = "-2";
    public static teamkilled: string = "-7";
    public static death: string = "-1";
    public static revived: string = "-6";
    public static baseCapture: string = "-3";
    public static baseDefense: string = "-4";
    public static squadSpawn: string = "56";
    public static capturePoint: string = "272";

    // Medic events
    public static heal: string = "4";
    public static healAssist: string = "5";
    public static revive: string = "7";
    public static squadRevive: string = "53";
    public static squadHeal: string = "51";
    public static shieldRepair: string = "438";
    public static squadShieldRepair: string = "439";

    // Engineer events
    public static maxRepair: string = "6";
    public static vehicleRepair: string = "90";
    public static resupply: string = "34";
    public static squadResupply: string = "55";
    public static squadMaxRepair: string = "142";
    public static drawfire: string = "1393";

    // Recon events
    public static spotKill: string = "36";
    public static squadSpotKill: string = "54";
    public static motionDetect: string = "293";
    public static squadMotionDetect: string = "294";
    public static radarDetect: string = "353";
    public static squadRadarDetect: string = "354";

    public static roadkill: string = "26";
    public static transportAssists: string = "30";

    public static concAssist: string = "550";
    public static squadConcAssist: string = "551";
    public static empAssist: string = "552";
    public static squadEmpAssist: string = "553";
    public static flashAssist: string = "554";
    public static squadFlashAssist: string = "555";
    public static savior: string = "335";
    public static ribbon: string = "291";
    public static routerKill: string = "1409";
    public static beaconKill: string = "270";

}

const remap: ((expID: string, toID: string) => [string, PsEvent]) = (expID, toID) => {
    return [expID, { name: "", types: [], track: true, alsoIncrement: toID }];
}

// All of the events to be tracked, updating this will change what events are subscribed as well
export const PsEvents: Map<string, PsEvent> = new Map<string, PsEvent>([
    [PsEvent.baseCapture, {
        name: "Base capture",
        types: ["general", "objective"],
        track: false
    }],
    [PsEvent.baseDefense, {
        name: "Base defense",
        types: ["general", "objective"],
        track: false
    }],
    [PsEvent.teamkill, {
        name: "Teamkill",
        types: ["versus"],
        track: false
    }],
    [PsEvent.teamkilled, {
        name: "Teamkilled",
        types: ["versus"],
        track: false
    }],
    [PsEvent.death, {
        name: "Death",
        types: ["general", "versus"],
        track: false
    }],
    [PsEvent.revived, {
        name: "Revived",
        types: [],
        track: false
    }],
    [PsEvent.kill, { // 1
        name: "Kill",
        types: ["general", "versus"],
        track: false
    }],
    [PsEvent.killAssist, { // 2
        name: "Kill assist",
        types: ["versus"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.heal, { // 4
        name: "Heal",
        types: ["medic"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.healAssist, { // 5
        name: "Heal assist",
        types: [],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.maxRepair, { // 6
        name: "MAX repair",
        types: ["engineer"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.revive, { // 7
        name: "Revive",
        types: ["medic"],
        track: true,
        alsoIncrement: undefined
    }],
    ["15", {
        name: "Control point defend",
        types: ["objective"],
        track: true,
        alsoIncrement: undefined
    }],
    ["16", {
        name: "Control point attack",
        types: ["objective"],
        track: true,
        alsoIncrement: undefined
    }],
    ["19", {
        name: "Base capture",
        types: ["objective"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.roadkill, { // 26
        name: "Roadkill",
        types: [],
        track: true,
        alsoIncrement: undefined
    }],
    ["29", {
        name: "MAX kill",
        types: ["versus"],
        track: true,
        alsoIncrement: PsEvent.kill
    }],
    [PsEvent.transportAssists, { // 30
        name: "Transport assist",
        types: ["logistics"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.resupply, {
        name: "Resupply",
        types: ["engineer"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.spotKill, {
        name: "Spot kill",
        types: ["recon"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.squadHeal, {
        name: "Squad heal",
        types: ["medic"],
        track: true,
        alsoIncrement: PsEvent.heal
    }],
    [PsEvent.squadRevive, {
        name: "Squad revive",
        types: ["medic"],
        track: true,
        alsoIncrement: PsEvent.revive
    }],
    [PsEvent.squadSpotKill, {
        name: "Squad spot kill",
        types: ["recon"],
        track: true,
        alsoIncrement: PsEvent.spotKill
    }],
    [PsEvent.squadResupply, {
        name: "Squad resupply",
        types: ["engineer"],
        track: true,
        alsoIncrement: PsEvent.resupply
    }],
    ["99", {
        name: "Sundy repair",
        types: ["engineer"],
        track: true,
        alsoIncrement: undefined
    }],
    remap("140", "99"), // Squad sundy repair

    [PsEvent.vehicleRepair, {
        name: "Vehicle repair",
        types: ["engineer"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.headshot, {
        name: "Headshot",
        types: ["versus"],
        track: false,
        alsoIncrement: undefined
    }],
    [PsEvent.squadSpawn, { // 56
        name: "Squad spawn",
        types: ["logistics"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.squadMaxRepair, {
        name: "Squad MAX repair",
        types: ["engineer"],
        track: true,
        alsoIncrement: PsEvent.maxRepair
    }],
    ["201", {
        name: "Galaxy spawn bonus",
        types: ["logistics"],
        track: true,
        alsoIncrement: PsEvent.squadSpawn
    }],
    ["233", {
        name: "Sundy spawn",
        types: ["logistics"],
        track: true,
        alsoIncrement: undefined
    }],
    ["236", {
        name: "Facility terminal hack",
        types: [],
        track: true,
        alsoIncrement: undefined
    }],
    ["270", {
        name: "Beacon kill",
        types: ["logistics"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.capturePoint, {
        name: "Capture point",
        types: ["objective"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.ribbon, { // Ribbon gained
        name: "Ribbon",
        types: [],
        track: false,
        alsoIncrement: undefined
    }],
    [PsEvent.motionDetect, {
        name: "Motion detect",
        types: ["recon"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.squadMotionDetect, {
        name: "Squad motion detect",
        types: ["recon"],
        track: true,
        alsoIncrement: PsEvent.motionDetect
    }],
    [PsEvent.radarDetect, {
        name: "Radar detect",
        types: ["recon"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.squadRadarDetect, {
        name: "Squad radar detect",
        types: ["recon"],
        track: true,
        alsoIncrement: PsEvent.radarDetect
    }],
    [PsEvent.savior, {
        name: "Savior kill",
        types: [],
        track: true,
        alsoIncrement: undefined
    }],
    ["355", {
        name: "Squad vehicle spawn",
        types: ["logistics"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.shieldRepair, {
        name: "Shield repair",
        types: ["medic"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.squadShieldRepair, {
        name: "Squad shield repair",
        types: ["medic"],
        track: true,
        alsoIncrement: PsEvent.shieldRepair
    }],
    [PsEvent.concAssist, {
        name: "Conc assist",
        types: ["versus"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.squadConcAssist, {
        name: "Squad conc assist",
        types: ["versus"],
        track: true,
        alsoIncrement: "550" // Conc assist
    }],
    [PsEvent.empAssist, {
        name: "EMP assist",
        types: ["versus"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.squadEmpAssist, {
        name: "Squad EMP assist",
        types: ["versus"],
        track: true,
        alsoIncrement: "552" // EMP assist
    }],
    [PsEvent.flashAssist, {
        name: "Flash assist",
        types: ["versus"],
        track: true,
        alsoIncrement: undefined
    }],
    [PsEvent.squadFlashAssist, {
        name: "Squad flash assist",
        types: ["versus"],
        track: true,
        alsoIncrement: "554" // Flash assist
    }],
    ["556", {
        name: "Defend point pulse",
        types: [],
        track: true,
        alsoIncrement: PsEvent.capturePoint
    }],
    ["557", {
        name: "Capture point pulse",
        types: [],
        track: true,
        alsoIncrement: PsEvent.capturePoint
    }],
    ["674", {
        name: "Cortium harvest",
        types: ["logistics"],
        track: true
    }],
    ["675", {
        name: "Cortium deposit",
        types: ["logistics"],
        track: true
    }],
    ["1393", {
        name: "Hardlight cover",
        types: ["engineer"],
        track: true,
        alsoIncrement: undefined
    }],
    ["1394", {
        name: "Draw fire",
        types: ["engineer"],
        track: true,
        alsoIncrement: "1393"
    }],
    ["1409", {
        name: "Router kill",
        types: ["logistics"],
        track: true,
        alsoIncrement: undefined
    }],
    ["1410", {
        name: "Router spawn",
        types: ["logistics"],
        track: true,
        alsoIncrement: undefined
    }],

    // Remap kills
    remap("8", PsEvent.kill),       // Kill streak => Kill
    remap("10", PsEvent.kill),      // Domination kill => Kill
    remap("11", PsEvent.kill),      // Revenge kill => Kill
    remap("25", PsEvent.kill),      // Multiple kill => Kill
    remap("32", PsEvent.kill),      // Nemesis kill => Kill
    remap("38", PsEvent.kill),      // Stop kill streak => Kill
    remap("277", PsEvent.kill),     // Spawn kill => Kill
    remap("278", PsEvent.kill),     // Priority kill => Kill
    remap("279", PsEvent.kill),     // High priority kill => Kill
    remap("335", PsEvent.kill),     // Savior kill (non MAX) => Kill
    remap("592", PsEvent.kill),     // Savior kill (max) => Kill
    remap("593", PsEvent.kill),     // Bounty kill bonus => Kill
    remap("593", PsEvent.kill),     // Bounty kill cashed in => Kill
    remap("595", PsEvent.kill),     // Bounty kill streak => Kill
    remap("673", PsEvent.kill),     // Bounty kill cashed in => Kill

    ...[
        "3", "371", "372"
    ].map((expID: string) => remap(expID, PsEvent.killAssist)),

    // Remap vehicle repairs
    ...[
        "88", "89", "91", "92", "93", "94", "95", "96", "97", "98", "100", "303", "503", "581", "653", "1375", // Normal
        "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "141", "302", "505", "584", "656", "1378" // Squad
    ].map((expID: string) => remap(expID, PsEvent.vehicleRepair))
]);