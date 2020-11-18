import Vue from "vue";

import { Chart } from "chart.js";

Vue.component("breakdown-bar", {
    props: {
        src: { type: Array, required: true },
        MaxHeight: { type: Number, required: false, default: 200 },
        ShowXAxis: { type: Boolean, required: false, default: false }
    },

    template: `
        <canvas :id="'breakdown-bar-' + ID" :style="{ 'max-height': MaxHeight + 'px' }"></canvas>
    `,

    data: function() {
        return {
            ID: Math.round(Math.random() * 100000) as number,

            data: [] as number[],

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
            this.chart.data = this.src as number[];

            this.chart.options = {
                legend: {
                    display: false
                },
                plugins: {
                    datalabels: {
                        display: false
                    } as any
                },
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 0
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: this.ShowXAxis,
                        }
                    }]
                }
            };
        },

        draw: function(): void {
            this.$nextTick(() => {
                if (this.chart.instance != null && this.chart.instance.destroy) {
                    this.chart.instance.destroy();
                }

                this.chart.instance = new Chart(document.getElementById(`breakdown-bar-${this.ID}`)! as HTMLCanvasElement, {
                    type: "line",
                    data: {
                        labels: this.chart.data.map((iter, index: number) => ""),
                        datasets: [{
                            steppedLine: true,
                            data: this.chart.data,
                            pointStyle: "line"
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
