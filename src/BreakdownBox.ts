import Vue, { PropType } from "vue";
import { BreakdownArray, Breakdown, BreakdownTrend } from "EventReporter";

import { Chart } from "chart.js";

import * as moment from "moment";

Vue.component("breakdown-box", {
    props: {
        src: { type: Array, required: true },
        ShowLabel: { type: Boolean, required: false, default: false }
    },

    template: `
        <div :id="'breakdown-box-' + ID + '-parent'">
            <canvas :id="'breakdown-box-' + ID"></canvas>
        </div>
    `,

    data: function() {
        return {
            ID: Math.round(Math.random() * 100000) as number,

            array: [] as BreakdownTrend[],

            chart: {
                instance: {} as any,
                elem: {} as any,
                labels: [] as string[],
                data: [] as number[][],
                colors: [] as string[]
            }
        }
    },

    created: function(): void {
        this.array = this.src as BreakdownTrend[];
        this.setup();
    },

    mounted: function(): void {
        this.draw();
    },

    methods: {
        setup: function(): void {
            this.chart.labels = this.array.map(iter => moment(iter.timestamp).format("YYYY-MM-DD"));

            this.chart.data = this.array.map(iter => iter.values);
        },

        draw: function(): void {
            this.$nextTick(() => {
                (document.getElementById(`breakdown-box-${this.ID}-parent`) as HTMLDivElement)
                    .style.height = `${(this.src as number[][]).length * 40 + 20}px`;

                const ctx = (document.getElementById(`breakdown-box-${this.ID}`) as any).getContext("2d");
                new Chart(ctx, {
                    type: "horizontalBoxplot",
                    data: {
                        labels: (this.ShowLabel == true) ? this.chart.labels : this.chart.data.map(iter => ""),
                        datasets: [{
                            backgroundColor: "#6c6c6c55",
                            borderColor: "#111111",
                            borderWidth: 2,
                            //padding: 10,
                            //itemRadius: 0,
                            data: (this.chart.data as unknown as number[]) // Force is safe I promise
                        //}]
                        } as any]
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
        },

        "src.data": function(): void {
            this.setup();
            this.draw();
        }
    }

});
