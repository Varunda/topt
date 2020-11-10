import CensusAPI from "./CensusAPI";
import { ApiResponse } from "./ApiWrapper";

export class Achievement {
    public ID: string = "";
    public name: string = "";
    public imageUrl: string = "";
    public description: string = "";
}

export class AchievementAPI {

    private static _cache: Map<string, Achievement | null> = new Map(
        [["0", null]]
    );

    public static unknown: Achievement = {
        ID: "-1",
        name: "Unknown",
        imageUrl: "",
        description: "Unknown achievement"
    };

    public static parseCharacter(elem: any): Achievement {
        return {
            ID: elem.achievement_id,
            name: elem.name.en,
            description: elem.description?.en ?? "",
            imageUrl: elem.image_path
        };
    }

    public static getByID(achivID: string): ApiResponse<Achievement | null> {
        const response: ApiResponse<Achievement | null> = new ApiResponse();

        if (AchievementAPI._cache.has(achivID)) {
            response.resolveOk(AchievementAPI._cache.get(achivID)!);
        } else {
            const request: ApiResponse<any> = CensusAPI.get(
                `achievement?item_id=${achivID}`
            );

            request.ok((data: any) => {
                if (data.returned != 1) {
                    response.resolve({ code: 404, data: `No or multiple weapons returned from ${name}` });
                } else {
                    const wep: Achievement = AchievementAPI.parseCharacter(data.item_list[0]);
                    if (!AchievementAPI._cache.has(wep.ID)) {
                        AchievementAPI._cache.set(wep.ID, wep);
                        console.log(`Cached ${wep.ID}: ${JSON.stringify(wep)}`);
                    }
                    response.resolveOk(wep);
                }
            });
        }

        return response;
    }

    public static getByIDs(weaponIDs: string[]): ApiResponse<Achievement[]> {
        const response: ApiResponse<Achievement[]> = new ApiResponse();

        if (weaponIDs.length == 0) {
            response.resolveOk([]);
            return response;
        }

        const weapons: Achievement[] = [];
        const requestIDs: string[] = [];

        for (const weaponID of weaponIDs) {
            if (AchievementAPI._cache.has(weaponID)) {
                const wep: Achievement = AchievementAPI._cache.get(weaponID)!;
                weapons.push(wep);
            } else {
                requestIDs.push(weaponID);
            }
        }

        if (requestIDs.length > 0) {
            const request: ApiResponse<any> = CensusAPI.get(
                `achievement?achievement_id=${requestIDs.join(",")}`
            );

            request.ok((data: any) => {
                if (data.returned == 0) {
                    if (weapons.length == 0) {
                        response.resolve({ code: 404, data: `No or multiple weapons returned from ${name}` });
                    } else {
                        response.resolveOk(weapons);
                    }
                } else {
                    for (const datum of data.achievement_list) {
                        const wep: Achievement = AchievementAPI.parseCharacter(datum);
                        weapons.push(wep);
                        AchievementAPI._cache.set(wep.ID, wep);
                        console.log(`Cached ${wep.ID}`);
                    }
                    response.resolveOk(weapons);
                }
            });
        } else {
            response.resolveOk(weapons);
        }

        return response;
    }

}
(window as any).AchievementAPI = AchievementAPI;