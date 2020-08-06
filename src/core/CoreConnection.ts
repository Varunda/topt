import { Core } from "core/Core";

import { Loading, Loadable } from "Loadable";

declare module "Core" {

    export interface Core {

        /**
         * Connect to the event stream
         * 
         * @returns Returns a Loading that contains the current state of progress
         */
        connect(): Loading<string>;

        /**
         * Disconnect the sockets that are being used to listen
         */
        disconnect(): void;

    }
}

(Core as any).prototype.connect = function(): Loading<string> {
    const self: Core = (this as Core);

    const response: Loading<string> = Loadable.saving("connecting");

    self.disconnect();

    self.sockets.tracked = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${self.serviceID}`);
    self.sockets.tracked.onopen = () => {
        response.state = "saving";
        if (response.state != "saving") { throw ``; }
        response.data = "Connecting...";
    };
    self.sockets.tracked.onerror = () => {
        response.state = "error";
        if (response.state != "error") { throw ``; }
        response.message = "Failed to connect to stream. Bad service ID?";
    };
    self.sockets.tracked.onmessage = () => {
        console.log(`Connected to event stream`);
        response.state = "loaded";
        if (response.state != "loaded") { throw ``; }
        response.data = "Connected";

        self.sockets.tracked!.onmessage = self.onmessage;
    };

    self.sockets.logistics = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${self.serviceID}`);
    self.sockets.logistics.onopen = self.onRouterOpen;
    self.sockets.logistics.onerror = self.onRouterError;
    self.sockets.logistics.onmessage = self.onRouterMessage;

    self.sockets.logins = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${self.serviceID}`);
    self.sockets.logins.onopen = (ev: any) => {
        if (self.sockets.logins == null) {
            throw `Expected sockets.login to not be null`;
        }

        const msg: object = {
            service: "event",
            action: "subscribe",
            characters: ["all"],
            worlds: [
                //self.settings.serverID
                "1"
            ],
            eventNames: [
                "PlayerLogin",
                "PlayerLogout"
            ],
            logicalAndCharactersWithWorlds: true
        };

        self.sockets.logins.send(JSON.stringify(msg));
    };
    self.sockets.logins.onerror = self.onLoginError;
    self.sockets.logins.onmessage = self.onLoginMessage;

    self.sockets.facility = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${self.serviceID}`);
    self.sockets.facility.onopen = self.onFacilityOpen;
    self.sockets.facility.onmessage = self.onFacilityMessage;
    self.sockets.facility.onerror = self.onFacilityError;

    return response;

};

(Core as any).prototype.disconnect = function(): void {
    const self: Core = (this as Core);

    if (self.sockets.tracked != null) { self.sockets.tracked.close(); }
    if (self.sockets.logins != null) { self.sockets.logins.close(); }
    if (self.sockets.logistics != null) { self.sockets.logistics.close(); }
    if (self.sockets.facility != null) { self.sockets.facility.close(); }
};