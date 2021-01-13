import Vue from "vue";
import { BreakdownTimeslot } from "tcore";

import { Chart } from "chart.js";

// @ts-ignore
import ChartDataLabels from "../node_modules/chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.js";
Chart.plugins.unregister(ChartDataLabels);

Vue.component("breakdown-interval", {
    props: {
        src: { type: Array, required: true },
        MaxHeight: { type: Number, required: false, default: 200 },
        ShowLabels: { type: Boolean, required: false, default: false },
        ShowXAxis: { type: Boolean, required: false, default: false },
        ShowYAxis: { type: Boolean, required: false, default: true },
        YAxisTickStep: { type: Number, required: false, default: 0.5 },
        YAxisMin: { type: Number, required: false, default: 0 }
    },

    template: `
        <canvas :id="'breakdown-interval-' + ID" :style="{ 'max-height': MaxHeight + 'px' }"></canvas>
    `,

    data: function() {
        return {
            ID: Math.round(Math.random() * 100000) as number,

            data: [] as BreakdownTimeslot[],

            darkMode: false as boolean,

            chart: {
                instance: {} as any,
                options: {} as Chart.ChartOptions,
                labels: [] as string[],
                data: [] as any[]
            }
        }
    },

    created: function(): void {
        this.setup();
    },

    mounted: function(): void {
        this.$nextTick(() => {
            this.draw();
        });
    },

    methods: {
        setup: function(): void {

            this.darkMode = window.getComputedStyle(document.body).getPropertyValue("background-color") == "rgb(34, 34, 34)";

            this.data = [...this.src] as BreakdownTimeslot[];
            this.chart.data = this.data.map(iter => { return { t: new Date(iter.startTime), y: iter.value }; });

            this.chart.options = {
                plugins: {
                    datalabels: {
                        textAlign: "center",
                        font: {
                            size: 18,
                            lineHeight: 2,
                        },
                        offset: 10,
                        padding: {
                            bottom: 10
                        },
                        display: false
                    }
                },
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            min: this.YAxisMin,
                            stepSize: this.YAxisTickStep,
                        },
                        gridLines: {
                            display: this.ShowYAxis,
                        },
                    }],
                    xAxes: [{
                        type: "time",
                        distribution: "linear",
                        time: {
                            unit: "minute"
                        },
                        gridLines: {
                            display: this.ShowXAxis,
                        }
                    }],
                },
                elements: {
                    line: {
                        tension: 0
                    }
                },
                legend: {
                    display: false,
                },
            };
        },

        draw: function(): void {
            this.$nextTick(() => {
                if (this.chart.instance != null && this.chart.instance.destroy) {
                    this.chart.instance.destroy();
                }

                this.chart.instance = new Chart(document.getElementById(`breakdown-interval-${this.ID}`)! as HTMLCanvasElement, {
                    type: "line",
                    plugins: this.ShowLabels == true ? [ChartDataLabels] : [],
                    data: {
                        labels: this.chart.labels,
                        datasets: [{
                            data: this.chart.data,
                            backgroundColor: this.darkMode == true ? "#e7e7e7" : "",
                        }]
                    },
                    options: this.chart.options
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
