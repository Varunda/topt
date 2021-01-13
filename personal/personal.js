import "../src/BreakdownBar.ts";
import "../src/BreakdownBox.ts";
import "../src/BreakdownChart.ts";
import "../src/BreakdownInterval.ts";
import "../src/BreakdownList.ts";
import "../src/MomentFilter.ts";

Chart.plugins.unregister(ChartDataLabels);

setTimeout(() => {
    const vm = new Vue({
        el: "#app",

        data: {
            versusCharID: null,
            versusSelected: null,
            versusSortMethod: "name",
            report: REPORT_HERE_REPLACE_ME
        },

        methods: {
            updateVersus: function() {
                if (this.versusCharID == null) {
                    return console.warn(`Cannot view versus: charID is null`);
                }

                const entry = this.report.playerVersus.find(iter => iter.charID == this.versusCharID)
                if (entry != undefined) {
                    this.versusSelected = entry;
                }
            }
        },

        computed: {
            versusEntries: function() {
                if (this.report == undefined) {
                    return [];
                }

                if (this.report.playerVersus == undefined) {
                    return [];
                }

                let arr = [...this.report.playerVersus];

                if (this.versusSortMethod == "name") {
                    return arr.sort((a, b) => a.name.localeCompare(b.name));
                } else if (this.versusSortMethod == "amount") {
                    return arr.sort((a, b) => b.encounters.length - a.encounters.length);
                } else {
                    throw `Unknown sort method: ${this.versusSortMethod}`;
                }
            }

        },

        watch: {
            versusCharID: function() {
                this.updateVersus();
            }
        }
    });
    window.vm = vm;

    vm.report.stats = new Map(vm.report.stats);
}, 0);