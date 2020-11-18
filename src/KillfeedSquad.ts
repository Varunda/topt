
import Vue, { PropType } from "vue";

import { SquadAddon } from "addons/SquadAddon";
import { SquadMember } from "tcore";
import { Squad } from "tcore";

type GroupInfo = {
    total: number;
    dead: number;
    alive: number;
    percentAlive: number;
    aliveColor: string;
};

function getGroupInfo(members: SquadMember[]): GroupInfo {
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
        squad: { type: Object as PropType<Squad>, required: true },
        ShowState: { type: Boolean, required: false, default: false },
        debug: { type: Boolean, required: false, default: false }
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
                SquadAddon.selectedSquadName = squadName;
            }
        },

        squadMouseLeave: function(ev: MouseEvent): void {
            SquadAddon.selectedSquadName = null;
        },

        memberMouseOver: function(ev: MouseEvent): void {
            const elem: HTMLDivElement = (ev as any).currentTarget;

            if (elem) {
                const memberID: string | undefined = elem.dataset["memberId"] ?? "";
                SquadAddon.selectedMemberID = memberID;
            }
        },

        memberMouseLeave: function(ev: MouseEvent): void {
            SquadAddon.selectedMemberID = null;
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
                &nbsp;

                <button class="btn btn-sm btn-warning my-n1 float-right" @click="resetMembers">
                    Reset
                </button>
            </div>
            <div v-if="ShowState" class="list-group-item p-0">
                <div class="pl-1" :style="{
                    width: '100%',
                    color: 'black',
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
                            {{member.name}} {{debug == true ? member.charID : ""}}
                        </td>

                        <td>
                            <span v-if="member.online == true">
                                <span v-if="member.state == 'alive'">
                                    A &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                </span>
                                <span v-else-if="member.state == 'dying'">
                                    R / 0:{{(30 - member.timeDead).toFixed(0).padStart(2, "0")}}
                                </span>
                                <span v-else>
                                    D &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                </span>
                            </span>

                            <span v-else>
                                Offline
                            </span>
                        </td>

                        <td>
                            <span v-if="member.whenBeacon == null">
                                B/0:00
                            </span>

                            <span v-else>
                                U/{{(300 - member.beaconCooldown).toFixed(0)}}
                            </span>
                        </td>
                    </tr>
                </table>
            </div>

            <div v-if="ShowState" class="list-group-item p-0">
                <table class="table table-sm mb-0">
                    <tr>
                        <td><b>Medics</b></td>
                        <td>{{medics.alive}} / {{medics.total}}</td>
                        <td>
                            <span class="border-rounded px-0" :style="{ 'background-color': medics.aliveColor, 'width': '20px' }">&nbsp;&nbsp;</span>
                        </td>
                    </tr>

                    <tr>
                        <td><b>Heavies</b></td>
                        <td>{{heavies.alive}} / {{heavies.total}}</td>
                        <td>
                            <span class="border-rounded px-0" :style="{ 'background-color': heavies.aliveColor, 'width': '20px' }">&nbsp;&nbsp;</span>
                        </td>
                    </tr>

                    <tr>
                        <td><b>Other</b></td>
                        <td>{{notBattle.alive}} / {{notBattle.total}}</td>
                        <td>
                            <span class="border-rounded px-0" :style="{ 'background-color': notBattle.aliveColor, 'width': '20px' }">&nbsp;&nbsp;</span>
                        </td>
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