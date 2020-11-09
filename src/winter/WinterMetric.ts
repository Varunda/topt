export class WinterMetric {
    public name: string = "";
    public funName: string = "";
    public description: string = "";
    public entries: WinterMetricEntry[] = [];
}

export class WinterMetricEntry {
    public name: string = "";
    public outfitTag: string = "";
    public value: number = 0;
    public display: string | null = null;
}