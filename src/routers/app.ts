import Vue from "vue";

import Core from "../core/index";

const vm = new Vue({
    el: "app",

    data: {
        core: new Core("cikserviceid80") as Core

    },

    created: function(): void {
        this.core.connect().ok(() => {
            this.core.start();

            this.core.sockets.logistics?.send(JSON.stringify({
                service: "event",
                action: "subscribe",
                characters: ["all"],
                worlds: ["1"],
                eventNames: ["GainExperience_experience_id_1410"],
                logicalAndCharctersWithWorlds: true
            }));
        });
    },

    methods: {

    }
});
(window as any).vm = vm;