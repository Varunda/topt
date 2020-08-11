
export default abstract class App {
    readonly name: string;

    public constructor(name: string) {
        this.name = name;
    }

    public abstract onStart(): void;

    public abstract onResume(): void;

    public abstract updateDisplay(): void;

    public abstract onSuspend(): void;

    public abstract onStop(): void;

}