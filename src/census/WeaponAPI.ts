import CensusAPI from "./CensusAPI";
import { ApiResponse } from "./ApiWrapper";

import * as $ from "jquery";

export class Weapon {
    public ID: string = "";
    public name: string = "";
    public type: string = "";
}

export class WeaponAPI {

    private static _cache: Map<string, Weapon | null> = new Map(
        [["0", null]]
    );

    public static maxTypeFixer(name: string): string {
        if (name == "AI MAX (Left)" || name == "AI MAX (Right)") {
            return "AI MAX";
        }
        if (name == "AV MAX (Left)" || name == "AV MAX (Right)") {
            return "AV MAX";
        }
        if (name == "AA MAX (Left)" || name == "AA MAX (Right)") {
            return "AA MAX";
        }
        return name;
    }

    private static _pendingCaches: string[] = [];

    private static _pendingTimerID: number = -1;

    public static parseCharacter(elem: any): Weapon {
        return {
            ID: elem.item_id,
            name: elem.name?.en ?? `Unnamed ${elem.item_id}`,
            type: this.maxTypeFixer(elem.category?.name.en ?? "Unknown")
        };
    }

    public static loadJson(): void {
        const response = new ApiResponse(
            $.get("/weapons.json"),
            ((data: any) => {
                const weapons: any[] = Array.isArray(data) ? data : JSON.parse(data);
                for (const datum of weapons) {
                    const wep: Weapon = WeaponAPI.parseCharacter(datum);
                    this._cache.set(wep.ID, wep);
                }
            })
        )
    }

    public static precache(weaponID: string): void {
        clearTimeout(this._pendingTimerID);

        if (this._pendingCaches.indexOf(weaponID) == -1) {
            this._pendingCaches.push(weaponID);
        }

        this._pendingTimerID = setTimeout(() => {
            this.getByIDs(this._pendingCaches);
        }, 100) as unknown as number;
    }

    public static getByID(weaponID: string): ApiResponse<Weapon | null> {
        const response: ApiResponse<Weapon | null> = new ApiResponse();

        if (WeaponAPI._cache.has(weaponID)) {
            response.resolveOk(WeaponAPI._cache.get(weaponID)!);
        } else {
            const request: ApiResponse<any> = CensusAPI.get(
                `item?item_id=${weaponID}&c:hide=description,max_stack_size,image_set_id,image_id,image_path&c:lang=en&c:join=item_category^inject_at:category`
            );

            request.ok((data: any) => {
                if (data.returned != 1) {
                    response.resolve({ code: 404, data: `No or multiple weapons returned from ${name}` });
                } else {
                    const wep: Weapon = WeaponAPI.parseCharacter(data.item_list[0]);
                    if (!WeaponAPI._cache.has(wep.ID)) {
                        WeaponAPI._cache.set(wep.ID, wep);
                    }
                    response.resolveOk(wep);
                }
            }).internalError((err: string) => {
                console.error(err);
            });
        }

        return response;
    }

    public static getByIDs(weaponIDs: string[]): ApiResponse<Weapon[]> {
        const response: ApiResponse<Weapon[]> = new ApiResponse();

        const weapons: Weapon[] = [];
        const requestIDs: string[] = [];

        for (const weaponID of weaponIDs) {
            if (WeaponAPI._cache.has(weaponID)) {
                const wep: Weapon | null = WeaponAPI._cache.get(weaponID)!;
                if (wep != null) {
                    weapons.push(wep);
                }
            } else {
                requestIDs.push(weaponID);
            }
        }

        if (requestIDs.length > 0) {
            const request: ApiResponse<any> = CensusAPI.get(
                `item?item_id=${requestIDs.join(",")}&c:hide=description,max_stack_size,image_set_id,image_id,image_path&c:lang=en&c:join=item_category^inject_at:category`
            );

            request.ok((data: any) => {
                if (data.returned == 0) {
                    if (weapons.length == 0) {
                        response.resolve({ code: 404, data: `No or multiple weapons returned from ${name}` });
                    } else {
                        response.resolveOk(weapons);
                    }
                } else {
                    for (const datum of data.item_list) {
                        const wep: Weapon = WeaponAPI.parseCharacter(datum);
                        weapons.push(wep);
                        WeaponAPI._cache.set(wep.ID, wep);
                    }
                    response.resolveOk(weapons);
                }
            }).internalError((err: string) => {
                for (const wepID of requestIDs) {
                    WeaponAPI._cache.set(wepID, null);
                }
                response.resolveOk([]);
                console.error(err);
            });
        } else {
            response.resolveOk(weapons);
        }

        return response;
    }

}
(window as any).WeaponAPI = WeaponAPI;