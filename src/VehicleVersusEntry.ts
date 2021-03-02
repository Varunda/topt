import Vue from "vue";

Vue.component("vehicle-versus-entry", {
    props: {
        name: { type: String, required: true },
        entry: { type: Object, required: true },
    },

    template: `
        <tr>
            <td>{{name}}</td>
            <td v-for="(value, name) in entry">
                {{entry[name].kills}} /
                {{entry[name].deaths}}
            </td>
        </tr>
    `,

    data: function() {
        return {

        }
    },

    created: function(): void {

    },

    mounted: function(): void {

    },

    methods: {

    },

    watch: {

    }

});
