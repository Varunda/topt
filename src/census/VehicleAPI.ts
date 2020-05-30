import CensusAPI from "./CensusAPI";
import { ApiResponse } from "./ApiWrapper";

export class Vehicle {
    public ID: string = "";
    public name: string = "";
    public typeID: string = "";
}

export class VehicleTypes {

    public static tracked: string[] = ["2033", "2010", "15", "14", "13", "12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1"];

    public static ground: string = "5";

    public static magrider: string = "2";

    public static turret: string = "7";

    public static air: string = "1";

    public static spawn: string = "8";

}

export class VehicleAPI {

    private static _cache: ApiResponse<Vehicle[]> | null = null;

    public static parse(elem: any): Vehicle {
        return {
            ID: elem.vehicle_id,
            typeID: elem.type_id,
            name: elem.name.en,
        };
    }

    public static getByID(vehicleID: string): ApiResponse<Vehicle | null> {
        const response: ApiResponse<Vehicle | null> = new ApiResponse();

        VehicleAPI.getAll().ok((data: Vehicle[]) => {
            let found:boolean = false;
            for (const veh of data) {
                if (veh.ID == vehicleID) {
                    response.resolveOk(veh);
                    found = true;
                    break;
                }
            }
            if (found == false) {
                response.resolve({ code: 204, data: null });
            }
        });

        return response;
    }

    public static getAll(ids: string[] = []): ApiResponse<Vehicle[]> {
        if (VehicleAPI._cache == null) {
            VehicleAPI._cache = new ApiResponse();
            
            const vehicles: Vehicle[] = [];
            const response = CensusAPI.get(`vehicle?c:limit=100`);
            response.ok((data: any) => {
                for (const datum of data.vehicle_list) {
                    vehicles.push(VehicleAPI.parse(datum));
                }
                VehicleAPI._cache!.resolveOk(vehicles);
                console.log(`Cached ${vehicles.length} vehicles: [${vehicles.map(iter => iter.name).join(",")}]`);
            });
        }

        return VehicleAPI._cache;
    }
}
(window as any).VehicleAPI = VehicleAPI;