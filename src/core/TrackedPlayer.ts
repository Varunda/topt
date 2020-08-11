import StatMap from "StatMap";
import { TEvent, TDeathEvent } from "events/index";

export class TrackedPlayer {
    public characterID: string = "";
    public outfitTag: string = "";
    public name: string = "";
    public faction: string = "";
    public score: number = 0;

    public online: boolean = true;
    public joinTime: number = 0;
    public secondsOnline: number = 0;

    public stats: StatMap = new StatMap();
    public ribbons: StatMap = new StatMap();

    public recentDeath: TDeathEvent | null = null;

    public events: TEvent[] = [];
}