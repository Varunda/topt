import CensusAPI from "./CensusAPI";
import { ApiResponse } from "./ApiWrapper";

export class Character {
    public ID: string = "";
    public name: string = "";
    public faction: string = "";
    public outfitID: string = "";
    public outfitTag: string = "";
    public outfitName: string = "";
    public online: boolean = false;
    public joinTime: number = 0;
    public secondsPlayed: number = 0;
}

export class CharacterAPI {

    private static _cache: Map<string, Character | null> = new Map();

    private static _pending: Map<string, ApiResponse<Character | null>> = new Map();

    public static parseCharacter(elem: any): Character {
        return {
            ID: elem.character_id,
            name: elem.name.first,
            faction: elem.faction_id,
            outfitID: (elem.outfit != undefined) ? elem.outfit.outfit_id : "",
            outfitTag: (elem.outfit != undefined) ? elem.outfit.alias : "",
            outfitName: (elem.outfit != undefined) ? elem.outfit.name : "",
            online: elem.online_status != "0",
            joinTime: (new Date()).getTime(),
            secondsPlayed: 0
        };
    }

    public static getByID(charID: string): ApiResponse<Character | null> {
        if (CharacterAPI._pending.has(charID)) {
            return CharacterAPI._pending.get(charID)!;
        }

        const response: ApiResponse<Character | null> = new ApiResponse();

        CharacterAPI._pending.set(charID, response);

        if (CharacterAPI._cache.has(charID)) {
            response.resolveOk(CharacterAPI._cache.get(charID)!);
        } else {
            const request: ApiResponse<any> = CensusAPI.get(
                `/character/?character_id=${charID}&c:resolve=outfit,online_status`
            );

            request.ok((data: any) => {
                if (data.returned != 1) {
                    response.resolve({ code: 404, data: `No or multiple characters returned from ${name}` });
                } else {
                    response.resolveOk(CharacterAPI.parseCharacter(data.character_list[0]));
                }
            }).always(() => {
                CharacterAPI._pending.delete(charID);
            });
        }

        return response;
    }

    private static _pendingIDs: string[] = [];

    private static _pendingResolveID: number = 0;

    public static cache(charID: string): void {
        if (CharacterAPI._cache.has(charID)) {
            return;
        }

        clearTimeout(CharacterAPI._pendingResolveID);
        CharacterAPI._pendingIDs.push(charID);

        if (CharacterAPI._pendingIDs.length > 9) {
            CharacterAPI.getByIDs(CharacterAPI._pendingIDs).ok(() => {});

            CharacterAPI._pendingIDs = [];
        } else {
            CharacterAPI._pendingResolveID = setTimeout(() => {
                CharacterAPI.getByIDs(CharacterAPI._pendingIDs).ok(() => {});
            }, 5000) as unknown as number;
        }
    }

    public static getByIDs(charIDs: string[]): ApiResponse<Character[]> {
        const response: ApiResponse<Character[]> = new ApiResponse();

        if (charIDs.length == 0) {
            response.resolveOk([]);
            return response;
        }

        const chars: Character[] = [];
        const requestIDs: string[] = [];

        for (const charID of charIDs) {
            if (CharacterAPI._cache.has(charID)) {
                const char: Character | null = CharacterAPI._cache.get(charID)!;
                if (char != null) {
                    chars.push(char);
                }
            } else {
                requestIDs.push(charID);
            }
        }

        if (requestIDs.length > 0) {
            const sliceSize: number = 50;
            let slicesLeft: number = Math.ceil(requestIDs.length / sliceSize);
            //console.log(`Have ${slicesLeft} slices to do. size of ${sliceSize}, data of ${requestIDs.length}`);

            for (let i = 0; i < requestIDs.length; i += sliceSize) {
                const slice: string[] = requestIDs.slice(i, i + sliceSize);
                //console.log(`Slice ${i}: ${i} - ${i + sliceSize - 1}: [${slice.join(",")}]`);

                const request: ApiResponse<any> = CensusAPI.get(
                    `/character/?character_id=${slice.join(",")}&c:resolve=outfit,online_status`
                );

                request.ok((data: any) => {
                    if (data.returned == 0) {
                        if (chars.length == 0) {
                            response.resolve({ code: 404, data: `Missing characters: ${charIDs.join(",")}` });
                        } else {
                            response.resolveOk(chars);
                        }
                    } else {
                        for (const datum of data.character_list) {
                            const char: Character = CharacterAPI.parseCharacter(datum);
                            chars.push(char);

                            CharacterAPI._cache.set(char.ID, char);
                        }
                    }

                    --slicesLeft;
                    if (slicesLeft == 0) {
                        //console.log(`No more slices left, resolving`);
                        response.resolveOk(chars);
                    } else {
                        //console.log(`${slicesLeft} slices left`);
                    }
                });
            }
        } else {
            response.resolveOk(chars);
        }

        return response;
    }

    public static getByName(name: string): ApiResponse<Character | null> {
        const response: ApiResponse<Character | null> = new ApiResponse();

        const request: ApiResponse<any> = CensusAPI.get(
            `/character/?name.first_lower=${name.toLowerCase()}&c:resolve=outfit,online_status`
        );

        request.ok((data: any) => {
            if (data.returned != 1) {
                response.resolve({ code: 404, data: `No or multiple characters returned from ${name}` });
            } else {
                response.resolveOk(CharacterAPI.parseCharacter(data.character_list[0]));
            }
        });

        return response;
    }

}
(window as any).CharacterAPI = CharacterAPI;