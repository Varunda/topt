
export class Quartile {
    public min: number = 0;
    public q1: number = 0;
    public median: number = 0;
    public q3: number = 0;
    public max: number = 0;

    public static get(data: number[]): Quartile {
        const quart: Quartile = new Quartile();

        const sorted: number[] = data.sort((a, b) => a - b);

        quart.q1 = this.quartile(data, 0.25);
        quart.median = this.quartile(data, 0.5);
        quart.q3 = this.quartile(data, 0.75);

        const stdDev: number = this.standardDeviation(data);

        return quart;

    }

    private static sum(data: number[]): number {
        return data.reduce((a, b) => a + b, 0);
    }

    private static standardDeviation(data: number[]): number {
        const mean: number = this.sum(data) / data.length;
        const diff = data.map(a => (a - mean) ** 2);
        return Math.sqrt(this.sum(diff) / (data.length - 1));
    }

    private static quartile(data: number[], q: number): number {
        const sorted: number[] = data.sort((a, b) => a - b);
        const pos: number = (sorted.length - 1) * q;
        const base: number = Math.floor(pos);
        const rest: number = pos - base;
        if (sorted[base + 1] !== undefined) {
            return sorted[base] + rest * (sorted[base - 1] - sorted[base]);
        } else {
            return sorted[base];
        }
    }

}
