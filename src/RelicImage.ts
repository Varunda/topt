import Vue from "vue";


Vue.component("relic-image", {
    props: {
        RelicId: { type: String, required: true },
        map: { required: true },
        img: { type: String, required: true }
    },

    template: `
        <span style="position: absolute; top: 0; width: 562px; height: 469px;">
            <img v-if="relic.faction != ''" :src="'./data/relics/' + img + relic.faction + '.png'" style="position: absolute; top: 0">
            <img v-if="relic.faction != '' && relic.cutoff == true" :src="'./data/relics/' + img + 'cutoff.png'" style="position: absolute; top: 0;">
        </span>
    `,

    data: function() {
        return {

        }
    },

    created: function(): void {

    },

    mounted: function(): void {

    },

    computed: {
        relic: function(): any {
            return (this.map as any).get(this.RelicId);
        },

        showImage: function(): boolean {
            return this.relic.faction != '';
        }
    },

    methods: {

    },

    watch: {

    }

});
