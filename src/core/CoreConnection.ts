import { Core } from "core/Core";

import { Loading, Loadable } from "Loadable";
import { ApiResponse } from "census/ApiWrapper";

declare module "Core" {

    export interface Core {

        /**
         * Connect to the event stream
         * 
         * @returns Returns a Loading that contains the current state of progress
         */
        connect(): ApiResponse;

        /**
         * Disconnect the sockets that are being used to listen
         */
        disconnect(): void;

        onSocketError(socketName: string, ev: Event): void;

    }
}

(Core as any).prototype.connect = function(): ApiResponse {
    const self: Core = (this as Core);

    const response: ApiResponse = new ApiResponse();

    self.disconnect();

    let opsLeft: number = 
        + 1 // Tracker
        + 1 // Logins
        + 1 // Logistics
        + 1 // Facilities
        + 1 // Debug

    setupTrackerSocket(self).always(() => { if (--opsLeft == 0) { response.resolveOk(); } });
    setupLoginSocket(self).always(() => { if (--opsLeft == 0) { response.resolveOk(); }});
    setupLogisticsSocket(self).always(() => { if (--opsLeft == 0) { response.resolveOk(); }});
    setupFacilitySocket(self).always(() => { if (--opsLeft == 0) { response.resolveOk(); }});
    setupDebugSocket(self).always(() => { if (--opsLeft == 0) { response.resolveOk(); }});

    self.connected = true;

    return response;
};

(Core as any).prototype.disconnect = function(): void {
    const self: Core = (this as Core);

    if (self.sockets.tracked != null) { self.sockets.tracked.close(); self.sockets.tracked = null; }
    if (self.sockets.logins != null) { self.sockets.logins.close(); self.sockets.logins = null; }
    if (self.sockets.logistics != null) { self.sockets.logistics.close(); self.sockets.logistics = null; }
    if (self.sockets.facility != null) { self.sockets.facility.close(); self.sockets.facility = null; }
    if (self.sockets.debug != null) { self.sockets.debug.close(); self.sockets.debug = null; }

    self.connected = false;
};

(Core as any).prototype.onSocketError = function(socketName: string, ev: Event): void {
    console.error(`Error on socket: ${socketName}> ${ev}`);
}

function setupTrackerSocket(core: Core): ApiResponse {
    const response: ApiResponse = new ApiResponse();

    core.sockets.tracked = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${core.serviceID}`);
    core.sockets.tracked.onopen = () => {

    };
    core.sockets.tracked.onerror = () => {
        response.resolve({ code: 500, data: `` });
    };
    core.sockets.tracked.onmessage = () => {
        response.resolveOk();
        core.sockets.tracked!.onmessage = core.onmessage.bind(core);
    };

    return response;
}

function setupDebugSocket(core: Core): ApiResponse {
    const response: ApiResponse = new ApiResponse();

    core.sockets.debug = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${core.serviceID}`);
    core.sockets.debug.onopen = () => {

    };
    core.sockets.debug.onerror = () => {
        response.resolve({ code: 500, data: `` });
    };
    core.sockets.debug.onmessage = () => {
        response.resolveOk();
        core.sockets.debug!.onmessage = (ev: MessageEvent) => {
            core.debugSocketMessages.push(JSON.parse(ev.data));
        };
    };

    return response;
}

function setupLogisticsSocket(core: Core): ApiResponse {
    const response: ApiResponse = new ApiResponse();

    core.sockets.logistics = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${core.serviceID}`);
    core.sockets.logistics.onopen = (ev: any) => {
        if (core.sockets.logistics == null) {
            throw `Expected sockets.logistics to not be null`;
        }

        const msg: object = {
            service: "event",
            action: "subscribe",
            characters: ["all"],
            worlds: [
                core.serverID
            ],
            eventNames: [
                "GainExperience_experience_id_1409",    // Router kill
            ],
            logicalAndCharactersWithWorlds: true
        };

        core.sockets.logistics.send(JSON.stringify(msg));

        response.resolveOk();
    };
    core.sockets.logistics.onerror = (ev: Event) => core.onSocketError("logistics", ev);
    core.sockets.logistics.onmessage = core.onmessage.bind(core);

    return response;
}

function setupLoginSocket(core: Core): ApiResponse {
    const response: ApiResponse = new ApiResponse();

    core.sockets.logins = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${core.serviceID}`);
    core.sockets.logins.onopen = (ev: any) => {
        if (core.sockets.logins == null) {
            throw `Expected sockets.login to not be null`;
        }

        const msg: object = {
            service: "event",
            action: "subscribe",
            characters: ["all"],
            worlds: [
                core.serverID
            ],
            eventNames: [
                "PlayerLogin",
                "PlayerLogout"
            ],
            logicalAndCharactersWithWorlds: true
        };

        core.sockets.logins.send(JSON.stringify(msg));

        response.resolveOk();
    };
    core.sockets.logins.onerror = (ev: Event) => core.onSocketError("login", ev);
    core.sockets.logins.onmessage = core.onmessage.bind(core);

    return response;
}

function setupFacilitySocket(core: Core): ApiResponse {
    const response: ApiResponse = new ApiResponse();

    core.sockets.facility = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${core.serviceID}`);
    core.sockets.facility.onopen = (ev: any) => {
        if (core.sockets.facility == null) {
            throw `sockets.facility is null`;
        }

        const msg: object = {
            service: "event",
            action: "subscribe",
            characters: ["all"],
            worlds: [
                core.serverID
            ],
            eventNames: [
                "PlayerFacilityCapture",
                "PlayerFacilityDefend",
                "FacilityControl"
            ],
            logicalAndCharactersWithWorlds: true
        };

        core.sockets.facility.send(JSON.stringify(msg));

        response.resolveOk();
    };
    core.sockets.facility.onmessage = core.onmessage.bind(core);
    core.sockets.facility.onerror = (ev: Event) => core.onSocketError("facility", ev);

    return response;
}
