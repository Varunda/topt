import { Core } from "core/Core";

declare module "Core" {

    export interface Core {

        /**
         * Debug method to print the exp events of a specific exp ID
         * 
         * @param expID Experience event ID to print as debug
         */
        printExpEvent(expID: string): void;

        /**
         * Debug method to subscribe to all exp events on the current server
         * 
         * @param expID Rest parameter of the exp IDs to listen to
         */
        subscribeToEvent(...expID: string[]): void;

        subscribeToAllEvent(...expID: string[]): void;

        /**
         * Debug method to subscribe to all ItemAdded events on the current server
         */
        subscribeToItemAdded(): void;

    }
}

(Core as any).prototype.printExpEvent = function(expID: string): void {
    const self: Core = this as Core;

    const events = Array.from(self.stats.values())
        .map(iter => iter.events)
        .reduce((acc, cur) => { acc.push(...cur); return acc; }, [])
        .filter(iter => iter.type == "exp" && iter.expID == expID);

    console.log(events);
}

Core.prototype.subscribeToEvent = function(...expID: string[]): void {
    if (this.sockets.debug == null) {
        return console.error(`Cannot globally subscribe to ${expID}: debug socket is null`);
    }

    const msg: object = {
        service: "event",
        action: "subscribe",
        characters: ["all"],
        worlds: [
            this.serverID
        ],
        eventNames: [
            ...expID.map(iter => `GainExperience_experience_id_${iter}`)
        ],
        logicalAndCharactersWithWorlds: true
    };

    this.sockets.debug.send(JSON.stringify(msg));
}

Core.prototype.subscribeToAllEvent = function(...expID: string[]): void {
    if (this.sockets.debug == null) {
        return console.error(`Cannot globally subscribe to ${expID}: debug socket is null`);
    }

    const msg: object = {
        service: "event",
        action: "subscribe",
        characters: ["all"],
        worlds: ["all"],
        eventNames: [
            ...expID.map(iter => `GainExperience_experience_id_${iter}`)
        ]
    };

    this.sockets.debug.send(JSON.stringify(msg));
}

Core.prototype.subscribeToItemAdded = function(): void {
    if (this.sockets.debug == null) {
        return console.error(`Cannot subscribe to ItemAdded events: debug socket is null`);
    }

    const msg: object = { 
        service: "event",
        action: "subscribe",
        characters: ["all"],
        worlds: [
            this.serverID
        ],
        eventNames: [
            "ItemAdded"
        ],
        logicalAndCharactersWithWorlds: true
    }

    this.sockets.debug.send(JSON.stringify(msg));
}