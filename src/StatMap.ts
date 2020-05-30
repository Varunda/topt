export default class StatMap {
    private _stats: Map<string, number> = new Map();

    public get(statName: string, fallback: number = 0): number {
        return this._stats.get(statName) || fallback;
    }

    public increment(statName: string, amount: number = 1): void {
        this._stats.set(statName, (this._stats.get(statName) || 0) + amount);
    }

    public decrement(statName: string, amount: number = 1): void {
        const cur: number = this.get(statName);
        if (cur < amount) {
            this.set(statName, 0);
        } else {
            this.set(statName, cur - amount);
        }
    }

    public set(statName: string, amount: number): void {
        this._stats.set(statName, amount);
    }

    public size(): number { return this._stats.size; }

    public getMap(): Map<string, number> { return this._stats; }

    public clear(): void { this._stats.clear(); }

}