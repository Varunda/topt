import Vue, { PropType } from "vue";
import { BreakdownArray, Breakdown, BreakdownTrend } from "core/EventReporter";

import { Chart } from "chart.js";

import * as moment from "moment";
import { Quartile } from "Quartile";

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
