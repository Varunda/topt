import { ApiResponse } from "./ApiWrapper";

import * as $ from "jquery";

export default class CensusAPI {

    public static serviceID: string = "";

    public static requestCount: number = 0;

    public static baseUrl(): string {
        return `https://census.daybreakgames.com/s:${CensusAPI.serviceID}/get/ps2:v2`;
    }

    public static init(serviceID: string): void {
        CensusAPI.serviceID = serviceID;
    }

    public static getType<T>(url: string, reader: ((elem: any) => T)): ApiResponse<T> {
        if (url.charAt(0) != "/") {
            url = `/${url}`;
        }

        if (CensusAPI.serviceID.length == 0) {
            throw `serviceID not given`;
        }

        return new ApiResponse<T>(
            $.get(`https://census.daybreakgames.com/s:${CensusAPI.serviceID}/get/ps2:v2${url}`),
            reader
        );
    }

    public static get(url: string): ApiResponse<any> {
        if (url.charAt(0) != "/") {
            url = `/${url}`;
        }

        if (CensusAPI.serviceID.length == 0) {
            throw `serviceID not given`;
        }

        return new ApiResponse(
            $.get(`https://census.daybreakgames.com/s:${CensusAPI.serviceID}/get/ps2:v2${url}`),
            ((elem: any) => elem)
        );
    }

}
(window as any).CensusAPI = CensusAPI;
