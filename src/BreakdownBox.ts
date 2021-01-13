import Vue, { PropType } from "vue";

import { Chart } from "chart.js";

//import { Quartile } from "Quartile";

class Quartile {
    public min: number = 0;
    public q1: number = 0;
    public median: number = 0;
    public q3: number = 0;
    public max: number = 0;

    public static get(data: number[]): Quartile {
        const quart: Quartile = new Quartile();

        if (data.length == 0) {
            return quart;
        }
        if (data.length == 1) {
            quart.min = data[0];
            quart.q1 = data[0];
            quart.median = data[0];
            quart.q3 = data[0];
            quart.max = data[0];
            return quart;
        }

        quart.q1 = this.quartile(data, 0.25);
        quart.median = this.quartile(data, 0.5);
        quart.q3 = this.quartile(data, 0.75);

        /*
        const stdDev: number = this.standardDeviation(data);
        for (let i = data.length - 1; i >= 0; --i) {
            if (data[i] <= quart.q3 + stdDev) {
                quart.max = data[i];
                break;
            }
        }
        for (let i = 0; i < data.length; ++i) {
            if (data[i] >= quart.q1 - stdDev) {
                quart.min = data[i];
                break;
            }
        }
        */

        quart.max = quart.max == 0 ? data[data.length - 1] : quart.max;
        quart.min = quart.min == 0 ? data[0] : quart.min;

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
            return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
        } else {
            return sorted[base];
        }
    }

}

Vue.component("breakdown-box", {
    props: {
        src: { type: Array, required: true },
        ShowLabel: { type: Boolean, required: false, default: false }
    },

    template: `
        <div :id="'breakdown-box-' + ID + '-parent'">
            <canvas :id="'breakdown-box-' + ID"></canvas>

            <table class="table table-sm border-right" :id="'breakdown-box-' + ID + '-quartile'">
                <tr>
                    <th>Min</th>
                    <th>Q1</th>
                    <th>Avg</th>
                    <th>Q3</th>
                    <th>Max</th>
                </tr>
                <tr>
                    <td>{{quartiles.current.min.toFixed(2)}}</td>
                    <td>{{quartiles.current.q1.toFixed(2)}}</td>
                    <td>{{quartiles.current.median.toFixed(2)}}</td>
                    <td>{{quartiles.current.q3.toFixed(2)}}</td>
                    <td>{{quartiles.current.max.toFixed(2)}}</td>
                </tr>
            </table>
        </div>
    `,

    data: function() {
        return {
            ID: Math.round(Math.random() * 100000) as number,

            array: [] as number[],
            quartile: new Quartile() as Quartile,

            quartiles: {
                current: new Quartile() as Quartile,
                recent: new Quartile() as Quartile,
                allTime: new Quartile() as Quartile,
            },

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
            this.array = this.src as number[];
            this.chart.data = this.array;

            this.quartiles.current = Quartile.get(this.array);
        },

        draw: function(): void {
            this.$nextTick(() => {
                const quartileHeight: number = (document.getElementById(`breakdown-box-${this.ID}-quartile`)as HTMLTableElement).clientHeight;

                (document.getElementById(`breakdown-box-${this.ID}-parent`) as HTMLDivElement)
                    .style.height = `${1 * 40 + 20 + quartileHeight}px`;
                (document.getElementById(`breakdown-box-${this.ID}`) as HTMLDivElement)
                    .style.height = `${1 * 40 + 20}px`;
                (document.getElementById(`breakdown-box-${this.ID}`) as HTMLDivElement)
                    .style.maxHeight = `${1 * 40 + 20}px`;

                const ctx = (document.getElementById(`breakdown-box-${this.ID}`) as any).getContext("2d");
                new Chart(ctx, {
                    type: "horizontalBoxplot",
                    data: {
                        labels: [],
                        datasets: [{
                            backgroundColor: "#6c6c6c55",
                            borderColor: "#111111",
                            borderWidth: 2,
                            data: [this.chart.data] as any
                        }]
                        //} as any]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            datalabels: {
                                display: false
                            }
                        },
                        title: {
                            display: false
                        },
                        legend: {
                            display: false
                        },
                        scales: {
                            xAxes: [{
                                // Options added by the boxplot plugin which aren't added to the interface correctly
                                ticks: {
                                    minStats: "whiskerMin",
                                    maxStats: "whiskerMax"
                                } as any
                            }],
                            yAxes: [{
                                gridLines: {
                                    display: false
                                }
                            }]
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
        }
    }

});
