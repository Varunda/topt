import Vue, { PropType } from "vue";
import * as moment from "moment";

function vueMoment(input: any, format: string = "YYYY-MM-DD hh:mmA"): string {
    // Who knew that you could assign properties to a function
    if (typeof (vueMoment as any).tz == "undefined") {
        (vueMoment as any).tz = new Date().getTimezoneOffset();
    }
    if (input == null || input == undefined || input == "") {
        return "";
    }

    if (typeof input == "string") {
        // Date strings ending with Z mean this ISO8601 date string is formatted in UTC time
        //      without the Z, it means local time, and since all dates as passed as UTC, just force it
        if (input.endsWith("Z") == false) {
            input += "Z";
        }
        return moment(input).format(format);
    } else if (input instanceof Date) {
        return moment(input).format(format);
    } else if (typeof input == "number") {
        return moment(new Date(input)).format(format);
    } else {
        throw `Unknown type of input: ${input} (${typeof input})`;
    }
}
Vue.filter("moment", vueMoment);

function timeBetween(input: any, until: any): string {
    if (typeof (vueMoment as any).tz == "undefined") {
        (vueMoment as any).tz = new Date().getTimezoneOffset();
    }
    if (input == null || input == undefined || input == "") {
        return "";
    }

    let start: moment.Moment;
    if (typeof input == "string") {
        start = moment(input);
    } else if (typeof input == "number") {
        start = moment(new Date(input));
    } else if (input instanceof Date) {
        start = moment(input);
    } else {
        throw `Unchecked type of input: ${typeof input}`;
    }

    let end: moment.Moment;
    if (typeof until == "string") {
        end = moment(until);
    } else if (typeof until == "number") {
        end = moment(new Date(until));
    } else if (until instanceof Date) {
        end = moment(until);
    } else {
        throw `Unchecked type of until: ${typeof until}`;
    }

    const diff: number = end.diff(start, "milliseconds");
    const sec: number = end.diff(start, "second");
    const min: number = end.diff(start, "minute");
    const hour: number = end.diff(start, "hour");

    if (diff == 0) {
        return `Instant`;
    }
    if (diff == 1) {
        return `1 millisecond`;
    }
    if (diff < 1000) {
        return `${diff} milliseconds`;
    }
    if (diff == 1000) {
        return `1 second`;
    }
    if (diff < (1000 * 60)) {
        return `${end.diff(start, "second")} seconds`;
    }
    if (diff == (1000 * 60)) {
        return `1 minute`;
    }
    if (diff < (1000 * 60 * 60)) {
        return `${min} minute${min == 1 ? "" : "s"} ${sec % 60} second${(sec % 60) == 1 ? "" : "s"}`;
    }

    return `${hour} hour${hour == 1 ? "" : "s"} ${min % 60} minute${(min % 60) == 1 ? "" : "s"}`;
}
Vue.filter("between", timeBetween);

Vue.filter("faction", (input: string): string => {
    switch (input) {
        case "": return "";
        case "1": return "VS";
        case "2": return "NC";
        case "3": return "TR";
        case "4": return "NS";
        default: return `${input}`;
    }
});

Vue.filter("duration", (input: string | number, format: string): string => {
    const val = (typeof(input) == "string") ? Number.parseInt(input) : input;
    if (Number.isNaN(val)) {
        return `NaN ${val}`;
    }

    if (val == 0) {
        return "Never";
    }

    const parts = {
        seconds: 0 as number,
        minutes: 0 as number,
        hour: 0 as number
    };

    if (val == 1) {
        parts.seconds = 1;
        return "1 second";
    }

    if (val < 60) {
        parts.seconds = val % 60;
        return `${val % 60} seconds`;
    }

    if (val == 0) {
        parts.minutes = 1;
        return `1 minute`;
    }

    if (val < (60 * 60)) {
        parts.minutes = Math.round(val / 60);
        parts.seconds = val % 60;
        return `${Math.round(val / 60)} minutes ${(val % 60).toFixed(0)} seconds`;
    }

    if (val == 60 * 60) {
        parts.hour = 1;
        return `1 hour`;
    }

    const hours = Math.floor(val / 3600);
    const mins = Math.floor((val - (3600 * hours)) / 60);
    const secs = val % 60;

    parts.hour = hours;
    parts.minutes = mins;
    parts.seconds = secs;

    return `${hours} hours ${mins} minutes ${val % 60} seconds`;
});

Vue.filter("duration_short", (input: string | number) => {
    const val = (typeof(input) == "string") ? Number.parseInt(input) : input;
    if (Number.isNaN(val)) {
        return `NaN ${val}`;
    }

    const hours = Math.floor(val / 3600);
    const mins = Math.floor((val - (3600 * hours)) / 60);
    const secs = val % 60;

    const parts = {
        hours: hours as number,
        minutes: mins,
        seconds: secs
    };

    if (hours > 0) {
        return `${hours.toFixed(0)}:${mins.toFixed(0)}:${mins.toFixed(0)}`;
    }

    return `${mins.toFixed(0)}:${secs.toFixed(0)}`;
});

Vue.filter("minutes", (input: string | number): string => {
    const val = (typeof(input) == "string") ? Number.parseInt(input) : input;
    if (Number.isNaN(val)) {
        return `NaN ${val}`;
    }

    if (val == 0) {
        return "0 minutes";
    }

    return `${(val / 60).toFixed(0)} minutes`;
});

Vue.filter("server", (input: string | number): string => {
    const val: number = (typeof(input) == "string") ? Number.parseInt(input) : input;
    if (Number.isNaN(val)) {
        return `Bad value ${input}`;
    }

    switch (val) {
        case 1: return "Connery";
        case 17: return "Emerald";
        case 10: return "Miller";
        case 13: return "Cobalt";
        case 19: return "Jaeger";
        case 40: return "SolTech";
    }

    return `Unknown ${val}`;
});

Vue.filter("secondsAgo", (input: string | number): string => {
    if (typeof(input) == "string" && input == "") {
        return "";
    }

    const val: number = (typeof(input) == "string") ? Number.parseInt(input) : input;
    if (Number.isNaN(val)) {
        return `Bad value ${input}`;
    }

    const now: number = new Date().getTime();

    return `0:${((now - val) / 1000).toFixed(2)}`;
});