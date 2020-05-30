import CensusAPI from "./CensusAPI";
import { ApiResponse } from "./ApiWrapper";

import * as $ from "jquery";

export class Facility {
    public ID: string = "";
    public zoneID: string = "";
    public name: string = "";
    public typeID: string = "";
    public type: string = "";
}

export class FacilityAPI {

    private static _cache: Map<string, Facility | null> = new Map();

    private static _pending: Map<string, ApiResponse<Facility>> = new Map();

    public static parse(elem: any): Facility {
        return {
            ID: elem.facility_id,
            zoneID: elem.zone_id,
            name: elem.facility_name,
            typeID: elem.facility_type_id,
            type: elem.facility_type
        };
    }

    private static _idList: string[] = [];

    private static _timeoutID: number = -1;

    public static loadJson(): void {
        new ApiResponse(
            $.get("/bases.json"),
            ((data: any) => {
                const bs: any[] = JSON.parse(data);
                for (const datum of bs) {
                    const wep: Facility = FacilityAPI.parse(datum);
                    this._cache.set(wep.ID, wep);
                }
            })
        );
    }

    public static precache(facilityID: string): void {
        clearTimeout(this._timeoutID);

        this._idList.push(facilityID);

        if (this._idList.length > 49) {
            if (this._idList.length > 0) {
                this.getByIDs(this._idList);
                this._idList = [];
            }
        }

        this._timeoutID = setTimeout(() => {
            if (this._idList.length > 0) {
                this.getByIDs(this._idList);
                this._idList = [];
            }
        });
    }

    public static getByID(facilityID: string): ApiResponse<Facility> {
        if (FacilityAPI._pending.has(facilityID)) {
            console.log(`${facilityID} already has a pending request, using that one instead`);
            return FacilityAPI._pending.get(facilityID)!;
        }

        const response: ApiResponse<Facility> = new ApiResponse();

        if (FacilityAPI._cache.has(facilityID)) {
            response.resolveOk(FacilityAPI._cache.get(facilityID)!);
        } else {
            const request: ApiResponse<any> = CensusAPI.get(`/map_region?facility_id=${facilityID}`);

            FacilityAPI._pending.set(facilityID, request);

            request.ok((data: any) => {
                if (data.returned == 0) {
                    FacilityAPI._cache.set(facilityID, null);
                    response.resolve({ code: 204, data: null });
                } else {
                    const facility: Facility = FacilityAPI.parse(data.map_region_list[0]);
                    FacilityAPI._cache.set(facility.ID, facility);
                    response.resolveOk(facility);
                }
                FacilityAPI._pending.delete(facilityID);
            });
        }

        return response;
    }

    public static getByIDs(IDs: string[]): ApiResponse<Facility[]> {
        const response: ApiResponse<Facility[]> = new ApiResponse();

        const facilities: Facility[] = [];
        const requestIDs: string[] = [];

        for (const facID of IDs) {
            if (FacilityAPI._cache.has(facID)) {
                const fac = FacilityAPI._cache.get(facID)!;
                if (fac != null) {
                    facilities.push(fac);
                }
            } else {
                requestIDs.push(facID);
            }
        }

        if (requestIDs.length > 0) {
            const request: ApiResponse<any> = CensusAPI.get(
                `/map_region?facility_id=${requestIDs.join(",")}`
            );

            request.ok((data: any) => {
                if (data.returned == 0) {
                    if (facilities.length == 0) {
                        response.resolve({ code: 404, data: `No facilities returned from ${name}` });
                    } else {
                        response.resolveOk(facilities);
                    }
                } else {

                    const bases: Facility[] = [];
                    for (const datum of data.map_region_list) {
                        const fac: Facility = FacilityAPI.parse(datum);
                        facilities.push(fac);
                        bases.push(fac);
                        FacilityAPI._cache.set(fac.ID, fac);
                    }

                    for (const facID of requestIDs) {
                        const elem = bases.find(iter => iter.ID == facID);
                        if (elem == undefined) {
                            console.log(`Failed to find Facility ID ${facID}, settings cache to null`);
                            FacilityAPI._cache.set(facID, null);
                        }
                    }

                    response.resolveOk(facilities);
                }
            }).internalError((err: string) => {
                for (const wepID of requestIDs) {
                    FacilityAPI._cache.set(wepID, null);
                }
                response.resolveOk([]);
                console.error(err);
            });
        } else {
            response.resolveOk(facilities);
        }

        return response;
    }

}
(window as any).FacilityAPI = FacilityAPI;