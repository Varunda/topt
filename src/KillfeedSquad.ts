
import Vue, { PropType } from "vue";
import { KillfeedGeneration, KillfeedSquad } from "Killfeed";

Vue.component("killfeed-squad", {
    props: {
        squad: { type: Object as PropType<KillfeedSquad>, required: true }
    },

    data: function() {
        return {

        }
    },

    methods: {
        squadMouseOver: function(ev: MouseEvent): void {
            const elem: HTMLDivElement = (ev as any).currentTarget;

            if (elem) {
                const squadName: string | undefined = elem.dataset["squadName"] ?? "";
                KillfeedGeneration.setHoveredSquad(squadName);
            }
        },

        squadMouseLeave: function(ev: MouseEvent): void {
            KillfeedGeneration.clearHoveredSquad();
        },

        memberMouseOver: function(ev: MouseEvent): void {
            const elem: HTMLDivElement = (ev as any).currentTarget;

            if (elem) {
                const memberID: string | undefined = elem.dataset["memberId"] ?? "";
                KillfeedGeneration.setHoveredMember(memberID);
            }
        },

        memberMouseLeave: function(ev: MouseEvent): void {
            KillfeedGeneration.clearHoveredMember();
        }
    },

    template: `
        <span class="list-group list-group-small" :data-squad-name="squad.name">
            <div class="list-group-item list-group-item-secondary"
                @mouseover="squadMouseOver" @mouseleave="squadMouseLeave"
                :data-squad-name="squad.name">

                {{squad.name}}
            </div>
            <div v-for="member in squad.members" :key="member.charID"
                @mouseover="memberMouseOver" @mouseleave="memberMouseLeave"
                class="list-group-item" :data-member-id="member.charID">

                {{member.name}} / {{member.state == "alive" ? 'A' : 'D'}}
            </div>
        </span>
    `
});