import { TEventType } from "./TEvent";
import { TKillEvent } from "./TKillEvent";
import { TDeathEvent } from "./TDeathEvent";
import { TExpEvent } from "./TExpEvent";
import { TCaptureEvent } from "./TCaptureEvent";
import { TDefendEvent } from "./TDefendEvent";
import { TVehicleKillEvent } from "./TVehicleKillEvent";

export type TEventHandler<T extends TEventType>
    = T extends "kill" ? (ev: TKillEvent) => void
    : T extends "death" ? (ev: TDeathEvent) => void
    : T extends "exp" ? (ev: TExpEvent) => void
    : T extends "capture" ? (ev: TCaptureEvent) => void
    : T extends "defend" ? (ev: TDefendEvent) => void
    : T extends "vehicle" ? (ev: TVehicleKillEvent) => void
    : never;