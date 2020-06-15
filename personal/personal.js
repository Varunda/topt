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
            report: REPORT_HERE_REPLACE_ME
        }
    });
    window.vm = vm;

    vm.report.stats = new Map(vm.report.stats);
}, 0);