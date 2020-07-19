
import Vue, { PropType } from "vue";
import { KillfeedGeneration, KillfeedSquad, KillfeedMember } from "Killfeed";

type GroupInfo = {
    total: number;
    dead: number;
    alive: number;
    percentAlive: number;
    aliveColor: string;
};

function getGroupInfo(members: KillfeedMember[]): GroupInfo {
    if (members.length == 0) {
        return defaultGroupInfo();
    }

    const total: number = members.length;
    const alive: number = members.filter(iter => iter.state == "alive").length;
    const dead: number = total - alive;
    const percent: number = alive / total;

    let color: string = "";
    if (percent >= 1.0) {
        color = `rgb(51, 255, 51)`;
    } else if (percent < 1.0 && percent >= 0.75) {
        color = `rgb(117, 255, 51)`;
    } else if (percent < 0.75 && percent >= 0.50) {
        color = `rgb(219, 255, 51)`;
    } else if (percent < 0.50 && percent >= 0.25) {
        color = `rgb(255, 189, 51)`;
    } else {
        color = `rgb(255, 87, 51)`;
    }

    return {
        total: total,
        alive: alive,
        dead: dead,
        percentAlive: percent,
        aliveColor: color
    };
}

function defaultGroupInfo(): GroupInfo {
    return {
        total: 0,
        alive: 0,
        dead: 0,
        percentAlive: 1,
        aliveColor: ``
    };
}

Vue.component("killfeed-squad", {
    props: {
        squad: { type: Object as PropType<KillfeedSquad>, required: true },
        ShowState: { type: Boolean, required: false, default: false },
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
        },

        resetMembers: function(): void {
            for (const member of this.squad.members) {
                member.state = "alive";
            }
        }
    },

    template: `
        <span class="list-group list-group-small" :data-squad-name="squad.name">
            <div class="list-group-item list-group-item-secondary"
                @mouseover="squadMouseOver" @mouseleave="squadMouseLeave"
                :data-squad-name="squad.name">

                {{squad.name}}

                <button class="btn btn-sm btn-warning m-n1 mr-n2 float-right" @click="resetMembers">
                    Reset
                </button>
            </div>
            <div v-if="ShowState" class="list-group-item p-0">
                <div class="pl-1" :style="{
                    width: '100%',
                    background: 'linear-gradient(90deg,' + all.aliveColor + (all.percentAlive * 100) + '%, transparent ' + (all.percentAlive * 100) + '% ' +  ((1 - all.percentAlive) * 100) + '%)'
                }">

                    {{all.alive}} / {{all.total}}

                    &nbsp;
                </div>
            </div>

            <div class="list-group-item p-0">
                <table class="table table-sm mb-0">
                    <tr v-for="member in squad.members" :key="member.charID"
                        @mouseover="memberMouseOver" @mouseleave="memberMouseLeave"
                        :data-member-id="member.charID">

                        <td>
                            {{member.class}}
                        </td>

                        <td>
                            {{member.name}}
                        </td>

                        <td>
                            {{member.state == "alive" ? "A" : "D"}}
                        </td>
                    </tr>
                </table>
            </div>

            <div v-if="ShowState" class="list-group-item p-0">
                <table class="table table-sm mb-0">
                    <tr>
                        <td><b>Medics</b></td>
                        <td>{{medics.alive}} / {{medics.total}}</td>
                        <td><span class="border-rounded px-0" :style="{ 'background-color': medics.aliveColor }">&nbsp;&nbsp;</span></td>
                    </tr>

                    <tr>
                        <td><b>Heavies</b></td>
                        <td>{{heavies.alive}} / {{heavies.total}}</td>
                        <td><span class="border-rounded px-0" :style="{ 'background-color': heavies.aliveColor }">&nbsp;&nbsp;</span></td>
                    </tr>

                    <tr>
                        <td><b>Other</b></td>
                        <td>{{notBattle.alive}} / {{notBattle.total}}</td>
                        <td><span class="border-rounded px-0" :style="{ 'background-color': notBattle.aliveColor }">&nbsp;&nbsp;</span></td>
                    </tr>
                </table>
            </div>
        </span>
    `,

    computed: {
        all: function(): GroupInfo {
            return getGroupInfo(this.squad.members);
        },

        notBattle: function(): GroupInfo {
            const members = this.squad.members.filter(iter => iter.class != "M" && iter.class != "H");
            return getGroupInfo(members);
        },

        infils: function(): GroupInfo {
            const members = this.squad.members.filter(iter => iter.class == "I");
            return getGroupInfo(members);
        },

        lightAssaults: function(): GroupInfo {
            const members = this.squad.members.filter(iter => iter.class == "L");
            return getGroupInfo(members);
        },

        medics: function(): GroupInfo {
            const members = this.squad.members.filter(iter => iter.class == "M");
            return getGroupInfo(members);
        },

        engineers: function(): GroupInfo {
            const members = this.squad.members.filter(iter => iter.class == "E");
            return getGroupInfo(members);
        },

        heavies: function(): GroupInfo {
            const members = this.squad.members.filter(iter => iter.class == "H");
            return getGroupInfo(members);
        },
    }
});