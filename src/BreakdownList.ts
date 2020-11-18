import Vue, { PropType } from "vue";
import { BreakdownArray } from "tcore";

Vue.component("breakdown", {
    props: {
        LeftTitle: { type: String, required: false, default: "" },
        RightTitle: { type: String, required: false, default: "" },
        data: { type: Object as PropType<BreakdownArray>, required: true },
        ShowAll: { type: Boolean, required: false, default: true },
        ClippedAmount: { type: Number, required: false, default: 5 },
        ShowPercent: { type: Boolean, required: false, default: false },
        ShowTotal: { type: Boolean, required: false, default: false },
        DisplayFunction: { type: Function, required: false, default: null }
    },

    template: `
        <div class="list-group list-group-small">
            <div class="list-group-item list-group-item-secondary">
                <div class="row">
                    <div class="col-8"><b>{{LeftTitle}}</b></div>
                    <div class="col-4"><b>{{RightTitle}}</b></div>
                </div>
            </div>
            <div v-for="datum in entries" class="list-group-item">
                <div class="row">
                    <div class="col-8 text-truncate">{{datum.name}}</div>
                    <div class="col-4">
                        {{datum.display}}
                        <span v-if="ShowPercent == true">
                            ({{(datum.amount / data.total * 100).toFixed(0)}}%)
                        </span>
                    </div>
                </div>
            </div>
            <div v-if="ShowTotal == true" class="list-group-item list-group-item-secondary">
                <div class="row">
                    <div class="col-8 text-truncate"><b>Total: </b></div>
                    <div class="col-4">{{total}}</div>
                </div>
            </div>
        </div>
    `,

    computed: {
        entries: function(): any {
            let data: any[] = this.data.data;
            if (this.ShowAll == false) {
                data = this.data.data.slice(0, this.ClippedAmount);
            }

            data = data.map(iter => {
                return { 
                    name: iter.display,
                    amount: iter.amount,
                    display: (this.data.display == null) ? iter.amount : this.data.display!(iter.amount)
                };
            });

            return data;
        },

        total: function(): number | string {
            let amt: number = 0;
            for (const datum of this.data.data) {
                amt += datum.amount;
            }
            return (this.data.display == null) ? amt : this.data.display(amt);
        }
    }
});