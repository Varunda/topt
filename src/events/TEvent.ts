import {
    TKillEvent, TDeathEvent, TTeamkillEvent,
    TCaptureEvent, TDefendEvent,
    TLoginEvent, TLogoutEvent,
    TExpEvent, TVehicleKillEvent
} from "./index";

export type TEventType = "exp" | "kill" | "death" | "capture" | "defend" | "vehicle" | "teamkill" | "login" | "logout";

export type TEvent = TKillEvent | TDefendEvent | TDeathEvent | TTeamkillEvent | TLoginEvent | TLogoutEvent | TCaptureEvent | TExpEvent | TVehicleKillEvent;

export type TLoadoutEvent = TKillEvent | TDeathEvent | TTeamkillEvent | TExpEvent | TVehicleKillEvent;