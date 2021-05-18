import Vue, { PropType } from "vue";
import { BreakdownArray, Breakdown } from "tcore";

import { Chart } from "chart.js";

Vue.component("breakdown-chart", {
    props: {
        src: { type: Object as PropType<BreakdownArray>, required: true },
        ShowAll: { type: Boolean, required: false, default: false },
        ClippedAmount: { type: Number, required: false, default: 8 },
        ShowPercent: { type: Boolean, required: false, default: false },
        PercentPrecision: { type: Number, required: false, default: 0 },
        ShowTotal: { type: Boolean, required: false, default: false },
        FontFamily: { type: String, required: false }
    },

    template: `
        <canvas :id="'breakdown-chart-' + ID"></canvas>
    `,

    data: function() {
        return {
            ID: Math.round(Math.random() * 100000) as number,

            chart: {
                instance: {} as any,
                elem: {} as any,
                labels: [] as string[],
                data: [] as number[],
                colors: [] as string[]
            }
        }
    },

    created: function(): void {
        this.setup();
    },

    mounted: function(): void {
        this.draw();
    },

    methods: {
        setup: function(): void {
            const shown: Breakdown[] = (this.ShowAll == true)
                ? this.src.data
                : this.src.data.slice(0, this.ClippedAmount);

            const colorHue: number = Math.random();
            let colorLen: number = Math.min(this.src.data.length, this.ClippedAmount);
            if (this.ShowAll == false && this.src.data.length > this.ClippedAmount) {
                ++colorLen;
            }

            let colorsProvided: boolean = false;

            this.chart.labels = shown.map((iter: Breakdown) => iter.display);
            this.chart.data = shown.map((iter: Breakdown) => iter.amount);
            this.chart.colors = shown.map((iter: Breakdown, index: number) => {
                if (iter.color != undefined) {
                    colorsProvided = true;
                    return iter.color;
                }
                return randomColor(colorHue, colorLen, index);
            });

            if (this.ShowAll == false && this.src.data.length > this.ClippedAmount) {
                const hidden = this.src.data.slice(this.ClippedAmount);

                this.chart.labels.push("Other");
                this.chart.data.push(hidden.reduce((acc, val) => acc += val.amount, 0));
                this.chart.colors.push(randomColor(colorHue, colorLen, colorLen - 1));
            }

            if (colorsProvided == false) {
                this.chart.colors = shuffleArray(this.chart.colors);
            }
        },

        draw: function(): void {
            this.$nextTick(() => {
                if (this.chart.instance != null && this.chart.instance.destroy) {
                    this.chart.instance.destroy();
                }

                const ctx = (document.getElementById(`breakdown-chart-${this.ID}`) as any).getContext("2d");
                this.chart.instance = new Chart(ctx, {
                    type: "pie",
                    data: {
                        labels: this.chart.labels,
                        datasets: [{
                            data: this.chart.data,
                            backgroundColor: this.chart.colors
                        }]
                    },
                    options: {
                        animation: {
                            duration: 0
                        },
                        hover: {
                            animationDuration: 0
                        },
                        plugins: {
                            datalabels: {
                                display: false
                            }
                        },
                        maintainAspectRatio: false,
                        responsiveAnimationDuration: 0,
                        legend: {
                            display: true,
                            position: "right",
                            align: "center",
                            labels: {
                                fontFamily: (!!this.FontFamily) ? this.FontFamily : undefined,
                                generateLabels: (chart: Chart): Chart.ChartLegendLabelItem[] => {
                                    const dataset = chart.data.datasets![0];
                                    let sum: number = 0;
                                    for (const datum of dataset.data!) {
                                        if (typeof(datum) == "number") {
                                            sum += datum;
                                        }
                                    }

                                    return chart.data.labels?.map((label, index) => {
                                        const datum = dataset.data![index];
                                        if (typeof(datum) == "number") {
                                            return {
                                                text: `${label.toString()} - ${datum} ${this.ShowPercent == true ? `(${(datum / sum * 100).toFixed(this.PercentPrecision)}%)` : ""}`,
                                                fillStyle: this.chart.colors[index]
                                            }
                                        }
                                        throw `Invalid type of data '${typeof(datum)}': ${datum}`;
                                    }) ?? [];
                                }
                            }
                        }
                    }
                });
            });
        }
    },

    watch: {
        src: function(): void {
            this.setup();
            this.draw();
        },

        "src.data": function(): void {
            this.setup();
            this.draw();
        }
    }

});

export function shuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex = 0;

    let arr: T[] = [...array];

    while (0 != currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
    }

    return arr;
}

export function randomColor(hue: number, total: number, index: number): string {
    const diff: number = 0.618033988749895;
    //let hue: number = Math.random();
    hue += index / total;
    hue += diff;
    hue %= 1;
    let sat: number = 0.5;
    let val: number = 0.95;

    let r: number = 0;
    let g: number = 0;
    let b: number = 0;

    let i = ~~(hue * 6);
    let f = hue * 6 - i;

    let p = val * (1 - sat);
    let q = val * (1 - f * sat);
    let t = val * (1 - (1 - f) * sat);
    switch (i % 6) {
        case 0: r = val; g = t; b = p; break;
        case 1: r = q; g = val; b = p; break;
        case 2: r = p; g = val; b = t; break;
        case 3: r = p; g = q; b = val; break;
        case 4: r = t; g = p; b = val; break;
        case 5: r = val; g = p; b = q; break;
    }

    return `rgba(${~~(r * 256)}, ${~~(g * 256)}, ${~~(b * 256)}, 1)`;
}
(window as any).randomColor = randomColor;
