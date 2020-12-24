import Vue from "vue";

Vue.component("fight-report-top", {
    props: {
        name: { type: String, required: true },
        total: { type: Number, required: true },
        duration: { type: Number, required: true},
        entry: { required: true }
    },

    data: function() {
        return {

        }
    },

    methods: {

    },

    template: `
        <tr>
            <td>{{name}}</td>
            <td>{{player}}</td>
            <td>
                {{amount}}
                ({{(amount / (duration / 60)).toFixed(2)}})
            </td>
            <td>
                {{(amount / total * 100).toFixed(2)}}%
                ({{total}} total)
            </td>
        </tr>
    `,

    computed: {
        player: function(): void {
            return (this.entry as any)[1];
        },

        amount: function(): number {
            return (this.entry as any)[0];
        }

    }
});