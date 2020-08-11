import Vue, { PropType } from "vue";
import { BreakdownArray, Breakdown, BreakdownTrend } from "EventReporter";

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
                    <th>Session</th>
                    <th>Min</th>
                    <th>Q1</th>
                    <th>Avg</th>
                    <th>Q3</th>
                    <th>Max</th>
                </tr>
                <tr>
                    <td>Latest</td>
                    <td>{{quartiles.current.min.toFixed(2)}}</td>
                    <td>{{quartiles.current.q1.toFixed(2)}}</td>
                    <td>{{quartiles.current.median.toFixed(2)}}</td>
                    <td>{{quartiles.current.q3.toFixed(2)}}</td>
                    <td>{{quartiles.current.max.toFixed(2)}}</td>
                </tr>
                <tr>
                    <td>Last 5</td>
                    <td>{{quartiles.recent.min.toFixed(2)}}</td>
                    <td>{{quartiles.recent.q1.toFixed(2)}}</td>
                    <td>{{quartiles.recent.median.toFixed(2)}}</td>
                    <td>{{quartiles.recent.q3.toFixed(2)}}</td>
                    <td>{{quartiles.recent.max.toFixed(2)}}</td>
                </tr>
                <tr>
                    <td>All time</td>
                    <td>{{quartiles.allTime.min.toFixed(2)}}</td>
                    <td>{{quartiles.allTime.q1.toFixed(2)}}</td>
                    <td>{{quartiles.allTime.median.toFixed(2)}}</td>
                    <td>{{quartiles.allTime.q3.toFixed(2)}}</td>
                    <td>{{quartiles.allTime.max.toFixed(2)}}</td>
                </tr>
            </table>
        </div>
    `,

    data: function() {
        return {
            ID: Math.round(Math.random() * 100000) as number,

            array: [] as BreakdownTrend[],
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

            if (this.array.length > 5) {
                const recent = this.array.slice(0, 5);
                this.chart.data = recent.map(iter => iter.values);
                this.chart.data.push(this.array.slice(5).reduce((acc, cur) => { acc.push(...cur.values); return acc; }, [] as number[]));
                this.chart.data.push(this.array.reduce((acc, cur) => { acc.push(...cur.values); return acc; }, [] as number[]));

                this.chart.labels = this.chart.labels.slice(0, 5);
                this.chart.labels.push(`Recent`);
                this.chart.labels.push(`All time`);
            }

            this.quartiles.current = Quartile.get(this.array[0].values);
            this.quartiles.recent = Quartile.get(this.array.slice(0, 5).reduce((acc, cur) => { acc.push(...cur.values); return acc; }, [] as number[]));
            this.quartiles.allTime = Quartile.get(this.array.reduce((acc, cur) => { acc.push(...cur.values); return acc }, [] as number[]));
        },

        draw: function(): void {
            this.$nextTick(() => {
                const quartileHeight: number = (document.getElementById(`breakdown-box-${this.ID}-quartile`)as HTMLTableElement).clientHeight;

                (document.getElementById(`breakdown-box-${this.ID}-parent`) as HTMLDivElement)
                    .style.height = `${this.chart.data.length * 40 + 20 + quartileHeight}px`;
                (document.getElementById(`breakdown-box-${this.ID}`) as HTMLDivElement)
                    .style.height = `${this.chart.data.length * 40 + 20}px`;
                (document.getElementById(`breakdown-box-${this.ID}`) as HTMLDivElement)
                    .style.maxHeight = `${this.chart.data.length * 40 + 20}px`;

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
                            data: (this.chart.data as unknown as number[][]) // Force is safe I promise
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
