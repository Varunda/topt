import { WinterMetric } from "./WinterMetric";

export class WinterReport {
    public start: Date = new Date();
    public end: Date = new Date();

    public essential: WinterMetric[] = [];
    public fun: WinterMetric[] = [];
}