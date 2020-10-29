import CensusAPI from "./CensusAPI";
import { ApiResponse } from "./ApiWrapper";
import { CharacterAPI, Character } from "./CharacterAPI";

export class Outfit {
    ID: string = "";
    name: string = "";
    tag: string = "";
    faction: string = "";
}

export default class OutfitAPI {

    public static parse(elem: any): Outfit {
        return {
            ID: elem.outfit_id,
            name: elem.name,
            tag: elem.alias,
            faction: elem.leader?.faction_id ?? "-1"
        }
    }

    public static getByID(ID: string): ApiResponse<Outfit | null> {
        const response: ApiResponse<Outfit | null> = new ApiResponse();

        const request: ApiResponse<any> = CensusAPI.get(`/outfit/?outfit_id=${ID}&c:resolve=leader`);

        request.ok((data: any) => {
            if (data.returned != 1) {
                response.resolve({ code: 404, data: `` });
            } else {
                const outfit: Outfit = OutfitAPI.parse(data.outfit_list[0]);
                response.resolveOk(outfit);
            }
        });

        return response;
    }

    public static getByIDs(IDs: string[]): ApiResponse<Outfit[]> {
        const response: ApiResponse<Outfit[]> = new ApiResponse();

        if (IDs.length == 0) {
            response.resolve({ code: 204, data: null });
            return response;
        }

        IDs = IDs.filter(i => i.length > 0 && i != "0");

        const outfits: Outfit[] = [];

        const sliceSize: number = 50;
        let slicesLeft: number = Math.ceil(IDs.length / sliceSize);
        console.log(`Have ${slicesLeft} slices to do. size of ${sliceSize}, data of ${IDs.length}`);

        for (let i = 0; i < IDs.length; i += sliceSize) {
            const slice: string[] = IDs.slice(i, i + sliceSize);

            const request: ApiResponse<any> = CensusAPI.get(`/outfit/?outfit_id=${slice.join(",")}&c:resolve=leader`);

            request.ok((data: any) => {
                if (data.returned == 0) {
                } else {
                    for (const datum of data.outfit_list) {
                        const char: Outfit = OutfitAPI.parse(datum);
                        outfits.push(char);
                    }
                }

                --slicesLeft;
                if (slicesLeft == 0) {
                    console.log(`No more slices left, resolving`);
                    response.resolveOk(outfits);
                } else {
                    console.log(`${slicesLeft} slices left`);
                }
            });
        }

        return response;
    }

    public static getByTag(outfitTag: string): ApiResponse<Outfit | null> {
        const response: ApiResponse<Outfit | null> = new ApiResponse();

        const request: ApiResponse<any> = CensusAPI.get(`/outfit/?alias_lower=${outfitTag.toLocaleLowerCase()}&c:resolve=leader`);

        request.ok((data: any) => {
            if (data.returned != 1) {
                response.resolve({ code: 404, data: `` });
            } else {
                const outfit: Outfit = OutfitAPI.parse(data.outfit_list[0]);
                response.resolveOk(outfit);
            }
        });

        return response;
    }

    public static getCharactersByTag(outfitTag: string): ApiResponse<Character[]> {
        const response: ApiResponse<Character[]> = new ApiResponse();

        const request: ApiResponse<any> = CensusAPI.get(`/outfit/?alias_lower=${outfitTag.toLowerCase()}&c:resolve=member_character,member_online_status`);

        request.ok((data: any) => {
            if (data.returned != 1) {
                response.resolve({ code: 404, data: `${outfitTag} did not return 1 entry` });
            } else {
                // With really big outfits (3k+ members) somehow a character that doesn't exist
                //      shows up in the query. They don't have a name, so filter them out
                const chars: Character[] = data.outfit_list[0].members
                    .filter((elem: any) => elem.name != undefined)
                    .map((elem: any) => {
                        return CharacterAPI.parseCharacter({
                            outfit: {
                                alias: data.outfit_list[0].alias
                            },
                            ...elem
                        });
                    });

                response.resolveOk(chars);
            }
        });

        return response;
    }

}
(window as any).OutfitAPI = OutfitAPI;