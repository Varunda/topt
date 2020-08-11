/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../EventReporter.ts":
/*!***************************!*\
  !*** ../EventReporter.ts ***!
  \***************************/
/*! exports provided: BreakdownArray, Breakdown, BreakdownTimeslot, BreakdownTrend, OutfitVersusBreakdown, BreakdownWeaponType, classCollectionNumber, BaseCaptureOutfit, BaseCapture, statMapToBreakdown, defaultCharacterMapper, defaultCharacterSortField, defaultWeaponMapper, defaultVehicleMapper, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BreakdownArray", function() { return BreakdownArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Breakdown", function() { return Breakdown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BreakdownTimeslot", function() { return BreakdownTimeslot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BreakdownTrend", function() { return BreakdownTrend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutfitVersusBreakdown", function() { return OutfitVersusBreakdown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BreakdownWeaponType", function() { return BreakdownWeaponType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "classCollectionNumber", function() { return classCollectionNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseCaptureOutfit", function() { return BaseCaptureOutfit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseCapture", function() { return BaseCapture; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "statMapToBreakdown", function() { return statMapToBreakdown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultCharacterMapper", function() { return defaultCharacterMapper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultCharacterSortField", function() { return defaultCharacterSortField; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultWeaponMapper", function() { return defaultWeaponMapper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultVehicleMapper", function() { return defaultVehicleMapper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EventReporter; });
/* harmony import */ var census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! census/ApiWrapper */ "../census/ApiWrapper.ts");
/* harmony import */ var census_CharacterAPI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! census/CharacterAPI */ "../census/CharacterAPI.ts");
/* harmony import */ var census_WeaponAPI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! census/WeaponAPI */ "../census/WeaponAPI.ts");
/* harmony import */ var StatMap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! StatMap */ "../StatMap.ts");
/* harmony import */ var census_PsLoadout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! census/PsLoadout */ "../census/PsLoadout.ts");
/* harmony import */ var census_VehicleAPI__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! census/VehicleAPI */ "../census/VehicleAPI.ts");
/* harmony import */ var PsEvent__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! PsEvent */ "../PsEvent.ts");
/* harmony import */ var InvididualGenerator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! InvididualGenerator */ "../InvididualGenerator.ts");
/* harmony import */ var census_OutfitAPI__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! census/OutfitAPI */ "../census/OutfitAPI.ts");









class BreakdownArray {
    constructor() {
        this.data = [];
        this.total = 0;
    }
}
class Breakdown {
    constructor() {
        this.display = "";
        this.sortField = "";
        this.amount = 0;
        this.color = undefined;
    }
}
class BreakdownTimeslot {
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
        this.value = 0;
    }
}
class BreakdownTrend {
    constructor() {
        this.timestamp = new Date();
        this.values = [];
    }
}
;
class OutfitVersusBreakdown {
    constructor() {
        this.tag = "";
        this.name = "";
        this.faction = "";
        this.kills = 0;
        this.deaths = 0;
        this.revived = 0;
        this.players = 0;
        this.classKills = classCollectionNumber();
        this.classDeaths = classCollectionNumber();
        this.classRevived = classCollectionNumber();
    }
}
class BreakdownWeaponType {
    constructor() {
        this.type = "";
        this.deaths = 0;
        this.revived = 0;
        this.unrevived = 0;
        this.headshots = 0;
        this.mostUsed = "";
        this.mostUsedDeaths = 0;
    }
}
function classCollectionNumber() {
    return {
        total: 0,
        infil: 0,
        lightAssault: 0,
        medic: 0,
        engineer: 0,
        heavy: 0,
        max: 0
    };
}
class BaseCaptureOutfit {
    constructor() {
        this.ID = "";
        this.name = "";
        this.tag = "";
        this.amount = 0;
    }
}
class BaseCapture {
    constructor() {
        this.name = "";
        this.faction = "";
        this.timestamp = 0;
        this.outfits = new BreakdownArray();
    }
}
function statMapToBreakdown(map, source, matcher, mapper, sortField = undefined) {
    const breakdown = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
    const arr = new BreakdownArray();
    if (map.size() > 0) {
        const IDs = Array.from(map.getMap().keys());
        source(IDs).ok((data) => {
            map.getMap().forEach((amount, ID) => {
                const datum = data.find(elem => matcher(elem, ID));
                const breakdown = {
                    display: mapper(datum, ID),
                    sortField: (sortField != undefined) ? sortField(datum, ID) : mapper(datum, ID),
                    amount: amount,
                    color: undefined
                };
                arr.total += amount;
                arr.data.push(breakdown);
            });
            arr.data.sort((a, b) => {
                const diff = b.amount - a.amount;
                return diff || b.sortField.localeCompare(a.sortField);
            });
            breakdown.resolveOk(arr);
        });
    }
    else {
        breakdown.resolveOk(arr);
    }
    return breakdown;
}
function defaultCharacterMapper(elem, ID) {
    var _a;
    return `${((_a = elem) === null || _a === void 0 ? void 0 : _a.outfitTag) ? `[${elem.outfitTag}] ` : ``}${(elem) ? elem.name : `Unknown ${ID}`}`;
}
function defaultCharacterSortField(elem, ID) {
    var _a, _b;
    return _b = (_a = elem) === null || _a === void 0 ? void 0 : _a.name, (_b !== null && _b !== void 0 ? _b : `Unknown ${ID}}`);
}
function defaultWeaponMapper(elem, ID) {
    var _a, _b;
    return _b = (_a = elem) === null || _a === void 0 ? void 0 : _a.name, (_b !== null && _b !== void 0 ? _b : `Unknown ${ID}`);
}
function defaultVehicleMapper(elem, ID) {
    var _a, _b;
    return _b = (_a = elem) === null || _a === void 0 ? void 0 : _a.name, (_b !== null && _b !== void 0 ? _b : `Unknown ${ID}`);
}
class EventReporter {
    static facilityCaptures(data) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const baseCaptures = [];
        const captures = data.captures;
        const players = data.players;
        const outfitIDs = players
            .map(iter => iter.outfitID)
            .filter((value, index, arr) => arr.indexOf(value) == index);
        census_OutfitAPI__WEBPACK_IMPORTED_MODULE_8__["default"].getByIDs(outfitIDs).ok((data) => {
            var _a, _b, _c, _d;
            for (const capture of captures) {
                // Same faction caps are boring
                if (capture.factionID == capture.previousFaction) {
                    continue;
                }
                const entry = new BaseCapture();
                entry.timestamp = capture.timestamp.getTime();
                entry.name = capture.name;
                entry.faction = capture.previousFaction;
                const facilityID = capture.facilityID;
                const name = capture.name;
                const outfitID = capture.outfitID;
                const outfit = data.find(iter => iter.ID == outfitID);
                if (outfit == undefined) {
                    console.warn(`Missing outfit ${outfitID}`);
                    continue;
                }
                const helpers = players.filter(iter => iter.timestamp == capture.timestamp.getTime());
                const outfits = [{ name: "No outfit", ID: "-1", amount: 0, tag: "" }];
                for (const helper of helpers) {
                    let outfitEntry = undefined;
                    if (helper.outfitID == "0" || helper.outfitID.length == 0) {
                        outfitEntry = outfits[0];
                    }
                    else {
                        outfitEntry = outfits.find(iter => iter.ID == helper.outfitID);
                        if (outfitEntry == undefined) {
                            const outfitDatum = data.find(iter => iter.ID == helper.outfitID);
                            outfitEntry = {
                                ID: helper.outfitID,
                                name: (_b = (_a = outfitDatum) === null || _a === void 0 ? void 0 : _a.name, (_b !== null && _b !== void 0 ? _b : `Unknown ${helper.outfitID}`)),
                                amount: 0,
                                tag: (_d = (_c = outfitDatum) === null || _c === void 0 ? void 0 : _c.tag, (_d !== null && _d !== void 0 ? _d : ``)),
                            };
                            outfits.push(outfitEntry);
                        }
                    }
                    ++outfitEntry.amount;
                }
                const breakdown = {
                    data: outfits.sort((a, b) => b.amount - a.amount).map(iter => {
                        return {
                            display: iter.name,
                            amount: iter.amount,
                            color: undefined,
                            sortField: `${iter.amount}`
                        };
                    }),
                    total: outfits.reduce(((acc, iter) => acc += iter.amount), 0)
                };
                entry.outfits = breakdown;
                baseCaptures.push(entry);
            }
            response.resolveOk(baseCaptures);
        });
        return response;
    }
    static experience(expID, events) {
        const exp = new StatMap__WEBPACK_IMPORTED_MODULE_3__["default"]();
        for (const event of events) {
            if (event.type == "exp" && (event.expID == expID || event.trueExpID == expID)) {
                exp.increment(event.targetID);
            }
        }
        return statMapToBreakdown(exp, census_CharacterAPI__WEBPACK_IMPORTED_MODULE_1__["CharacterAPI"].getByIDs, (elem, charID) => elem.ID == charID, defaultCharacterMapper, defaultCharacterSortField);
    }
    static experienceSource(ids, targetID, events) {
        const exp = new StatMap__WEBPACK_IMPORTED_MODULE_3__["default"]();
        for (const event of events) {
            if (event.type == "exp" && event.targetID == targetID && ids.indexOf(event.expID) > -1) {
                exp.increment(event.sourceID);
            }
        }
        if (exp.size() == 0) {
            return census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"].resolve({ code: 204, data: null });
        }
        console.log(`charIDs: [${Array.from(exp.getMap().keys()).join(", ")}]`);
        return statMapToBreakdown(exp, census_CharacterAPI__WEBPACK_IMPORTED_MODULE_1__["CharacterAPI"].getByIDs, (elem, charID) => elem.ID == charID, defaultCharacterMapper, defaultCharacterSortField);
    }
    static outfitVersusBreakdown(events) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const outfitBreakdowns = new Map();
        const outfitPlayers = new Map();
        const killCount = events.filter(iter => iter.type == "kill").length;
        const deathCount = events.filter(iter => iter.type == "death" && iter.revived == false).length;
        const charIDs = events.filter((iter) => iter.type == "kill" || (iter.type == "death" && iter.revived == false))
            .map((iter) => {
            if (iter.type == "kill") {
                return iter.targetID;
            }
            else if (iter.type == "death" && iter.revived == false) {
                return iter.targetID;
            }
            throw `Invalid event type '${iter.type}'`;
        });
        census_CharacterAPI__WEBPACK_IMPORTED_MODULE_1__["CharacterAPI"].getByIDs(charIDs).ok((data) => {
            for (const ev of events) {
                if (ev.type == "kill" || ev.type == "death") {
                    const killedChar = data.find(iter => iter.ID == ev.targetID);
                    if (killedChar == undefined) {
                        console.warn(`Missing ${ev.type} targetID ${ev.targetID}`);
                    }
                    else {
                        const outfitID = killedChar.outfitID;
                        if (outfitBreakdowns.has(outfitID) == false) {
                            const breakdown = new OutfitVersusBreakdown();
                            breakdown.tag = killedChar.outfitTag;
                            breakdown.name = killedChar.outfitName || "<No outfit>";
                            breakdown.faction = killedChar.faction;
                            outfitBreakdowns.set(outfitID, breakdown);
                            outfitPlayers.set(outfitID, []);
                        }
                        const breakdown = outfitBreakdowns.get(outfitID);
                        if (ev.type == "kill") {
                            ++breakdown.kills;
                        }
                        else if (ev.type == "death") {
                            if (ev.revived == true) {
                                ++breakdown.revived;
                            }
                            else {
                                ++breakdown.deaths;
                            }
                        }
                        const loadout = census_PsLoadout__WEBPACK_IMPORTED_MODULE_4__["PsLoadouts"].get(ev.loadoutID);
                        const coll = ev.type == "kill" ? breakdown.classKills
                            : ev.type == "death" && ev.revived == false ? breakdown.classDeaths
                                : breakdown.classRevived;
                        if (loadout != undefined) {
                            if (loadout.type == "infil") {
                                ++coll.infil;
                            }
                            else if (loadout.type == "lightAssault") {
                                ++coll.lightAssault;
                            }
                            else if (loadout.type == "medic") {
                                ++coll.medic;
                            }
                            else if (loadout.type == "engineer") {
                                ++coll.engineer;
                            }
                            else if (loadout.type == "heavy") {
                                ++coll.heavy;
                            }
                            else if (loadout.type == "max") {
                                ++coll.max;
                            }
                        }
                        const players = outfitPlayers.get(outfitID);
                        if (players.indexOf(ev.targetID) == -1) {
                            ++breakdown.players;
                            players.push(ev.targetID);
                        }
                    }
                }
            }
            // Only include the outfit if they were > 1% of the kills or deaths
            const breakdowns = Array.from(outfitBreakdowns.values())
                .filter(iter => iter.kills > (killCount / 100) || iter.deaths > (deathCount / 100));
            breakdowns.sort((a, b) => {
                return b.deaths - a.deaths
                    || b.kills - a.kills
                    || b.revived - a.revived
                    || b.tag.localeCompare(a.tag);
            });
            response.resolveOk(breakdowns);
        });
        return response;
    }
    static kpmBoxplot(players, tracking, loadout) {
        let kpms = [];
        for (const player of players) {
            if (player.secondsOnline <= 0) {
                continue;
            }
            let secondsOnline = player.secondsOnline;
            if (loadout != undefined) {
                const playtime = InvididualGenerator__WEBPACK_IMPORTED_MODULE_7__["IndividualReporter"].classUsage({ player: player, tracking: tracking, routers: [], events: [] });
                if (loadout == "infil") {
                    secondsOnline = playtime.infil.secondsAs;
                }
                else if (loadout == "lightAssault") {
                    secondsOnline = playtime.lightAssault.secondsAs;
                }
                else if (loadout == "medic") {
                    secondsOnline = playtime.medic.secondsAs;
                }
                else if (loadout == "engineer") {
                    secondsOnline = playtime.engineer.secondsAs;
                }
                else if (loadout == "heavy") {
                    secondsOnline = playtime.heavy.secondsAs;
                }
                else if (loadout == "max") {
                    secondsOnline = playtime.max.secondsAs;
                }
                if (secondsOnline == 0) {
                    continue;
                }
            }
            let count = 0;
            const kills = player.events.filter(iter => iter.type == "kill");
            for (const kill of kills) {
                const psloadout = census_PsLoadout__WEBPACK_IMPORTED_MODULE_4__["PsLoadouts"].get(kill.loadoutID);
                if (loadout == undefined || (psloadout != undefined && psloadout.type == loadout)) {
                    ++count;
                }
            }
            if (count == 0) {
                continue;
            }
            const minutesOnline = secondsOnline / 60;
            const kpm = Number.parseFloat((count / minutesOnline).toFixed(2));
            //console.log(`${player.name} got ${count} kills on ${loadout} in ${minutesOnline} minutes (${kpm})`);
            kpms.push(kpm);
        }
        kpms.sort((a, b) => b - a);
        return kpms;
    }
    static kdBoxplot(players, tracking, loadout) {
        let kds = [];
        for (const player of players) {
            if (player.secondsOnline <= 0) {
                continue;
            }
            let killCount = 0;
            const kills = player.events.filter(iter => iter.type == "kill");
            for (const kill of kills) {
                const psloadout = census_PsLoadout__WEBPACK_IMPORTED_MODULE_4__["PsLoadouts"].get(kill.loadoutID);
                if (loadout == undefined || (psloadout != undefined && psloadout.type == loadout)) {
                    ++killCount;
                }
            }
            let deathCount = 0;
            const deaths = player.events.filter(iter => iter.type == "death" && iter.revived == false);
            for (const death of deaths) {
                const psloadout = census_PsLoadout__WEBPACK_IMPORTED_MODULE_4__["PsLoadouts"].get(death.loadoutID);
                if (loadout == undefined || (psloadout != undefined && psloadout.type == loadout)) {
                    ++deathCount;
                }
            }
            if (killCount == 0 || deathCount == 0) {
                continue;
            }
            //console.log(`${player.name} went ${killCount} / ${deathCount} on ${loadout}`);
            const kd = Number.parseFloat((killCount / deathCount).toFixed(2));
            kds.push(kd);
        }
        kds.sort((a, b) => b - a);
        return kds;
    }
    static weaponDeathBreakdown(events) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const weapons = events.filter((ev) => ev.type == "death")
            .map((ev) => ev.weaponID)
            .filter((ID, index, arr) => arr.indexOf(ID) == index);
        let types = [];
        // <weapon type, <weapon, count>>
        const used = new Map();
        const missingWeapons = new Set();
        census_WeaponAPI__WEBPACK_IMPORTED_MODULE_2__["WeaponAPI"].getByIDs(weapons).ok((data) => {
            var _a, _b, _c;
            const deaths = events.filter(ev => ev.type == "death");
            for (const death of deaths) {
                const weapon = data.find(iter => iter.ID == death.weaponID);
                if (weapon == undefined) {
                    missingWeapons.add(death.weaponID);
                }
                const typeName = (_b = (_a = weapon) === null || _a === void 0 ? void 0 : _a.type, (_b !== null && _b !== void 0 ? _b : "Other"));
                let type = types.find(iter => iter.type == typeName);
                if (type == undefined) {
                    type = {
                        type: typeName,
                        deaths: 0,
                        headshots: 0,
                        revived: 0,
                        unrevived: 0,
                        mostUsed: "",
                        mostUsedDeaths: 0
                    };
                    types.push(type);
                }
                if (weapon != undefined) {
                    if (!used.has(weapon.type)) {
                        used.set(weapon.type, new Map());
                    }
                    const set = used.get(weapon.type);
                    set.set(weapon.name, (_c = set.get(weapon.name), (_c !== null && _c !== void 0 ? _c : 0)) + 1);
                    used.set(weapon.type, set);
                }
                ++type.deaths;
                if (death.revived == false) {
                    ++type.unrevived;
                }
                else {
                    ++type.revived;
                }
                if (death.isHeadshot == true) {
                    ++type.headshots;
                }
            }
            used.forEach((weapons, type) => {
                const breakdown = types.find(iter => iter.type == type);
                weapons.forEach((deaths, weapon) => {
                    if (deaths > breakdown.mostUsedDeaths) {
                        breakdown.mostUsedDeaths = deaths;
                        breakdown.mostUsed = weapon;
                    }
                });
            });
            types = types.filter((iter) => {
                return iter.deaths / deaths.length > 0.0025;
            });
            types.sort((a, b) => {
                return b.deaths - a.deaths
                    || b.headshots - a.headshots
                    || b.type.localeCompare(a.type);
            });
            console.log(`Missing weapons:`, missingWeapons);
            response.resolveOk(types);
        });
        return response;
    }
    static vehicleKills(events) {
        const vehKills = new StatMap__WEBPACK_IMPORTED_MODULE_3__["default"]();
        for (const event of events) {
            if (event.type == "vehicle" && census_VehicleAPI__WEBPACK_IMPORTED_MODULE_5__["VehicleTypes"].tracked.indexOf(event.vehicleID) > -1) {
                vehKills.increment(event.vehicleID);
            }
        }
        return statMapToBreakdown(vehKills, census_VehicleAPI__WEBPACK_IMPORTED_MODULE_5__["VehicleAPI"].getAll, (elem, ID) => elem.ID == ID, defaultVehicleMapper);
    }
    static vehicleWeaponKills(events) {
        const vehKills = new StatMap__WEBPACK_IMPORTED_MODULE_3__["default"]();
        for (const event of events) {
            if (event.type == "vehicle" && event.weaponID != "0") {
                vehKills.increment(event.weaponID);
            }
        }
        return statMapToBreakdown(vehKills, census_WeaponAPI__WEBPACK_IMPORTED_MODULE_2__["WeaponAPI"].getByIDs, (elem, ID) => elem.ID == ID, defaultWeaponMapper);
    }
    static weaponKills(events) {
        const wepKills = new StatMap__WEBPACK_IMPORTED_MODULE_3__["default"]();
        for (const event of events) {
            if (event.type == "kill") {
                wepKills.increment(event.weaponID);
            }
        }
        return statMapToBreakdown(wepKills, census_WeaponAPI__WEBPACK_IMPORTED_MODULE_2__["WeaponAPI"].getByIDs, (elem, ID) => elem.ID == ID, defaultWeaponMapper);
    }
    static weaponDeaths(events, revived = undefined) {
        const amounts = new StatMap__WEBPACK_IMPORTED_MODULE_3__["default"]();
        for (const event of events) {
            if (event.type == "death" && (revived == undefined || revived == event.revived)) {
                amounts.increment(event.weaponID);
            }
        }
        return statMapToBreakdown(amounts, census_WeaponAPI__WEBPACK_IMPORTED_MODULE_2__["WeaponAPI"].getByIDs, (elem, ID) => elem.ID == ID, defaultWeaponMapper);
    }
    static weaponTypeKills(events) {
        const amounts = new StatMap__WEBPACK_IMPORTED_MODULE_3__["default"]();
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const weaponIDs = [];
        for (const event of events) {
            if (event.type == "kill") {
                weaponIDs.push(event.weaponID);
            }
        }
        const arr = new BreakdownArray();
        census_WeaponAPI__WEBPACK_IMPORTED_MODULE_2__["WeaponAPI"].getByIDs(weaponIDs).ok((data) => {
            for (const event of events) {
                if (event.type == "kill") {
                    const weapon = data.find(iter => iter.ID == event.weaponID);
                    if (weapon == undefined) {
                        amounts.increment("Unknown");
                    }
                    else {
                        amounts.increment(weapon.type);
                    }
                    ++arr.total;
                }
            }
            amounts.getMap().forEach((count, wepType) => {
                arr.data.push({
                    display: wepType,
                    amount: count,
                    sortField: wepType,
                    color: undefined
                });
            });
            arr.data.sort((a, b) => {
                const diff = b.amount - a.amount;
                if (diff == 0) {
                    return b.display.localeCompare(a.display);
                }
                return diff;
            });
            response.resolveOk(arr);
        });
        return response;
    }
    static weaponTypeDeaths(events, revived = undefined) {
        const amounts = new StatMap__WEBPACK_IMPORTED_MODULE_3__["default"]();
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const weaponIDs = [];
        for (const event of events) {
            if (event.type == "death" && (revived == undefined || event.revived == revived)) {
                weaponIDs.push(event.weaponID);
            }
        }
        const arr = new BreakdownArray();
        census_WeaponAPI__WEBPACK_IMPORTED_MODULE_2__["WeaponAPI"].getByIDs(weaponIDs).ok((data) => {
            for (const event of events) {
                if (event.type == "death" && (revived == undefined || event.revived == revived)) {
                    const weapon = data.find(iter => iter.ID == event.weaponID);
                    if (weapon == undefined) {
                        amounts.increment("Unknown");
                    }
                    else {
                        amounts.increment(weapon.type);
                    }
                    ++arr.total;
                }
            }
            amounts.getMap().forEach((count, wepType) => {
                arr.data.push({
                    display: wepType,
                    amount: count,
                    sortField: wepType,
                    color: undefined
                });
            });
            arr.data.sort((a, b) => {
                const diff = b.amount - a.amount;
                if (diff == 0) {
                    return b.display.localeCompare(a.display);
                }
                return diff;
            });
            response.resolveOk(arr);
        });
        return response;
    }
    static factionKills(events) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const arr = new BreakdownArray();
        const countKills = function (ev, faction) {
            if (ev.type != "kill") {
                return false;
            }
            const loadout = census_PsLoadout__WEBPACK_IMPORTED_MODULE_4__["PsLoadouts"].get(ev.targetLoadoutID);
            return loadout != undefined && loadout.faction == faction;
        };
        arr.data.push({
            amount: events.filter(iter => countKills(iter, "VS")).length,
            color: "#AE06B3",
            display: "VS",
            sortField: "VS"
        });
        arr.data.push({
            amount: events.filter(iter => countKills(iter, "NC")).length,
            color: "#1A39F9",
            display: "NC",
            sortField: "NC"
        });
        arr.data.push({
            amount: events.filter(iter => countKills(iter, "TR")).length,
            color: "#CE2304",
            display: "TR",
            sortField: "TR"
        });
        arr.data.push({
            amount: events.filter(iter => countKills(iter, "NS")).length,
            color: "#6A6A6A",
            display: "NS",
            sortField: "NS"
        });
        arr.total = events.filter(iter => iter.type == "kill").length;
        response.resolveOk(arr);
        return response;
    }
    static factionDeaths(events) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const countDeaths = function (ev, faction) {
            if (ev.type != "death" || ev.revived == true) {
                return false;
            }
            const loadout = census_PsLoadout__WEBPACK_IMPORTED_MODULE_4__["PsLoadouts"].get(ev.targetLoadoutID);
            return loadout != undefined && loadout.faction == faction;
        };
        const arr = new BreakdownArray();
        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "VS")).length,
            color: "#AE06B3",
            display: "VS",
            sortField: "VS"
        });
        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "NC")).length,
            color: "#1A39F9",
            display: "NC",
            sortField: "NC"
        });
        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "TR")).length,
            color: "#CE2304",
            display: "TR",
            sortField: "TR"
        });
        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "NS")).length,
            color: "#6A6A6A",
            display: "NS",
            sortField: "NS"
        });
        arr.total = events.filter(iter => iter.type == "death" && iter.revived == false).length;
        response.resolveOk(arr);
        return response;
    }
    static continentKills(events) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const countKills = function (ev, zoneID) {
            return ev.type == "kill" && ev.zoneID == zoneID;
        };
        const arr = new BreakdownArray();
        arr.data.push({
            amount: events.filter(iter => countKills(iter, "2")).length,
            color: "#F4E11D",
            display: "Indar",
            sortField: "Indar"
        });
        arr.data.push({
            amount: events.filter(iter => countKills(iter, "4")).length,
            color: "#09B118",
            display: "Hossin",
            sortField: "Hossin"
        });
        arr.data.push({
            amount: events.filter(iter => countKills(iter, "6")).length,
            color: "#2DE53E",
            display: "Amerish",
            sortField: "Amerish"
        });
        arr.data.push({
            amount: events.filter(iter => countKills(iter, "8")).length,
            color: "#D8E9EC",
            display: "Esamir",
            sortField: "Esamir"
        });
        arr.total = events.filter(iter => iter.type == "kill").length;
        response.resolveOk(arr);
        return response;
    }
    static continentDeaths(events) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const countDeaths = function (ev, zoneID) {
            return ev.type == "death" && ev.revived == false && ev.zoneID == zoneID;
        };
        const arr = new BreakdownArray();
        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "2")).length,
            color: "#F4E11D",
            display: "Indar",
            sortField: "Indar"
        });
        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "4")).length,
            color: "#09B118",
            display: "Hossin",
            sortField: "Hossin"
        });
        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "6")).length,
            color: "#2DE53E",
            display: "Amerish",
            sortField: "Amerish"
        });
        arr.data.push({
            amount: events.filter(iter => countDeaths(iter, "8")).length,
            color: "#D8E9EC",
            display: "Esamir",
            sortField: "Esamir"
        });
        arr.total = events.filter(iter => iter.type == "death" && iter.revived == false).length;
        response.resolveOk(arr);
        return response;
    }
    static characterKills(events) {
        const amounts = new StatMap__WEBPACK_IMPORTED_MODULE_3__["default"]();
        for (const event of events) {
            if (event.type == "kill") {
                amounts.increment(event.targetID);
            }
        }
        return statMapToBreakdown(amounts, census_CharacterAPI__WEBPACK_IMPORTED_MODULE_1__["CharacterAPI"].getByIDs, (elem, ID) => elem.ID == ID, defaultCharacterMapper);
    }
    static characterDeaths(events) {
        const amounts = new StatMap__WEBPACK_IMPORTED_MODULE_3__["default"]();
        for (const event of events) {
            if (event.type == "death" && event.revived == false) {
                amounts.increment(event.targetID);
            }
        }
        return statMapToBreakdown(amounts, census_CharacterAPI__WEBPACK_IMPORTED_MODULE_1__["CharacterAPI"].getByIDs, (elem, ID) => elem.ID == ID, defaultCharacterMapper);
    }
    static kpmOverTime(events, timeWidth = 300000) {
        const kills = events.filter(iter => iter.type == "kill")
            .sort((a, b) => a.timestamp - b.timestamp);
        const players = new Set();
        if (kills.length == 0) {
            return [];
        }
        const slots = [];
        const minutes = timeWidth / 60000;
        const stop = kills[kills.length - 1].timestamp;
        let start = events[0].timestamp;
        let count = 0;
        while (true) {
            const end = start + timeWidth;
            const section = kills.filter(iter => iter.timestamp >= start && iter.timestamp < end);
            for (const ev of section) {
                players.add(ev.sourceID);
                ++count;
            }
            slots.push({
                startTime: start,
                endTime: end,
                value: Number.parseFloat((count / (players.size || 1) / minutes).toFixed(2))
            });
            count = 0;
            players.clear();
            start += timeWidth;
            if (start > stop) {
                break;
            }
        }
        return slots;
    }
    static kdOverTime(events, timeWidth = 300000) {
        const evs = events.filter(iter => iter.type == "kill" || (iter.type == "death" && iter.revived == false));
        if (evs.length == 0) {
            return [];
        }
        const slots = [];
        const stop = evs[evs.length - 1].timestamp;
        let start = events[0].timestamp;
        while (true) {
            const end = start + timeWidth;
            const section = evs.filter(iter => iter.timestamp >= start && iter.timestamp < end);
            const kills = section.filter(iter => iter.type == "kill");
            const deaths = section.filter(iter => iter.type == "death" && iter.revived == false);
            slots.push({
                startTime: start,
                endTime: end,
                value: Number.parseFloat((kills.length / (deaths.length || 1)).toFixed(2))
            });
            start += timeWidth;
            if (start > stop) {
                break;
            }
        }
        return slots;
    }
    static kdPerUpdate(allEvents) {
        const events = allEvents.filter(iter => iter.type == "kill" || (iter.type == "death" && iter.revived == false));
        if (events.length == 0) {
            return [];
        }
        let kills = 0;
        let deaths = 0;
        const slots = [];
        for (let i = events[0].timestamp; i < events[events.length - 1].timestamp; i += 1000) {
            const evs = events.filter(iter => iter.timestamp == i);
            if (evs.length == 0) {
                continue;
            }
            for (const ev of evs) {
                if (ev.type == "kill") {
                    ++kills;
                }
                else if (ev.type == "death") {
                    ++deaths;
                }
            }
            slots.push({
                value: Number.parseFloat((kills / (deaths || 1)).toFixed(2)),
                startTime: i,
                endTime: i
            });
        }
        return slots;
    }
    static revivesOverTime(events, timeWidth = 300000) {
        const revives = events.filter(iter => iter.type == "exp" && (iter.expID == PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].revive || iter.expID == PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].squadRevive));
        if (revives.length == 0) {
            return [];
        }
        const slots = [];
        const stop = revives[revives.length - 1].timestamp;
        let start = events[0].timestamp;
        while (true) {
            const end = start + timeWidth;
            const section = revives.filter(iter => iter.timestamp >= start && iter.timestamp < end);
            const players = section.map(iter => iter.sourceID)
                .filter((value, index, arr) => arr.indexOf(value) == index).length;
            slots.push({
                startTime: start,
                endTime: end,
                value: Number.parseFloat((section.length / (players || 1) / 5).toFixed(2))
            });
            start += timeWidth;
            if (start > stop) {
                break;
            }
        }
        return slots;
    }
}
window.EventReporter = EventReporter;


/***/ }),

/***/ "../InvididualGenerator.ts":
/*!*********************************!*\
  !*** ../InvididualGenerator.ts ***!
  \*********************************/
/*! exports provided: ClassBreakdown, FacilityCapture, ExpBreakdown, classKdCollection, classCollectionBreakdownTrend, OutfitReport, TrackedRouter, Playtime, ClassUsage, Report, PlayerVersusEntry, PlayerVersus, BreakdownSpawn, TrackedPlayer, BreakdownCollection, BreakdownSection, BreakdownMeta, BreakdownSingle, EventFeedEntry, ReportParameters, IndividualReporter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClassBreakdown", function() { return ClassBreakdown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FacilityCapture", function() { return FacilityCapture; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExpBreakdown", function() { return ExpBreakdown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "classKdCollection", function() { return classKdCollection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "classCollectionBreakdownTrend", function() { return classCollectionBreakdownTrend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutfitReport", function() { return OutfitReport; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrackedRouter", function() { return TrackedRouter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Playtime", function() { return Playtime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClassUsage", function() { return ClassUsage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Report", function() { return Report; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PlayerVersusEntry", function() { return PlayerVersusEntry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PlayerVersus", function() { return PlayerVersus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BreakdownSpawn", function() { return BreakdownSpawn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrackedPlayer", function() { return TrackedPlayer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BreakdownCollection", function() { return BreakdownCollection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BreakdownSection", function() { return BreakdownSection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BreakdownMeta", function() { return BreakdownMeta; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BreakdownSingle", function() { return BreakdownSingle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventFeedEntry", function() { return EventFeedEntry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportParameters", function() { return ReportParameters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndividualReporter", function() { return IndividualReporter; });
/* harmony import */ var census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! census/ApiWrapper */ "../census/ApiWrapper.ts");
/* harmony import */ var census_CharacterAPI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! census/CharacterAPI */ "../census/CharacterAPI.ts");
/* harmony import */ var census_WeaponAPI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! census/WeaponAPI */ "../census/WeaponAPI.ts");
/* harmony import */ var census_EventAPI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! census/EventAPI */ "../census/EventAPI.ts");
/* harmony import */ var census_AchievementAPI__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! census/AchievementAPI */ "../census/AchievementAPI.ts");
/* harmony import */ var census_PsLoadout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! census/PsLoadout */ "../census/PsLoadout.ts");
/* harmony import */ var PsEvent__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! PsEvent */ "../PsEvent.ts");
/* harmony import */ var StatMap__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! StatMap */ "../StatMap.ts");
/* harmony import */ var EventReporter__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! EventReporter */ "../EventReporter.ts");









class ClassBreakdown {
    constructor() {
        this.secondsAs = 0;
        this.score = 0;
        this.kills = 0;
        this.deaths = 0;
    }
}
class FacilityCapture {
    constructor() {
        this.facilityID = "";
        this.name = "";
        this.type = "";
        this.typeID = "";
        this.zoneID = "";
        this.timestamp = new Date();
        this.timeHeld = 0;
        this.factionID = "";
        this.outfitID = "";
        this.previousFaction = "";
    }
}
class ExpBreakdown {
    constructor() {
        this.name = "";
        this.score = 0;
        this.amount = 0;
    }
}
function classKdCollection() {
    return {
        infil: new ClassBreakdown(),
        lightAssault: new ClassBreakdown(),
        medic: new ClassBreakdown(),
        engineer: new ClassBreakdown(),
        heavy: new ClassBreakdown(),
        max: new ClassBreakdown(),
        total: new ClassBreakdown()
    };
}
;
function classCollectionBreakdownTrend() {
    return {
        total: [],
        infil: [],
        lightAssault: [],
        medic: [],
        engineer: [],
        heavy: [],
        max: []
    };
}
class OutfitReport {
    constructor() {
        this.stats = new Map();
        this.score = 0;
        this.players = [];
        this.events = [];
        this.facilityCaptures = [];
        this.continent = "Unknown";
        this.classStats = new Map();
        this.scoreBreakdown = [];
        this.overtimePer5 = {
            kpm: [],
            kd: [],
            rpm: [],
        };
        this.overtimePer1 = {
            kpm: [],
            kd: [],
            rpm: [],
        };
        this.perUpdate = {
            kpm: [],
            kd: [],
            rpm: []
        };
        this.trends = {
            kpm: classCollectionBreakdownTrend(),
            kd: classCollectionBreakdownTrend()
        };
        this.weaponKillBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.weaponTypeKillBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.deathAllBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.deathAllTypeBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.deathRevivedBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.deathRevivedTypeBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.deathKilledBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.deathKilledTypeBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.outfitVersusBreakdown = [];
        this.weaponTypeDeathBreakdown = [];
        this.vehicleKillBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.vehicleKillWeaponBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.timeUnrevived = [];
        this.revivedLifeExpectance = [];
        this.kmLifeExpectance = [];
        this.kmTimeDead = [];
        this.factionKillBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.factionDeathBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.continentKillBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.continentDeathBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.baseCaptures = [];
        this.classKds = {
            infil: classKdCollection(),
            lightAssault: classKdCollection(),
            medic: classKdCollection(),
            engineer: classKdCollection(),
            heavy: classKdCollection(),
            max: classKdCollection(),
            total: classKdCollection()
        };
        this.classTypeKills = {
            infil: new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"](),
            lightAssault: new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"](),
            medic: new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"](),
            engineer: new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"](),
            heavy: new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"](),
            max: new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"](),
        };
        this.classTypeDeaths = {
            infil: new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"](),
            lightAssault: new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"](),
            medic: new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"](),
            engineer: new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"](),
            heavy: new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"](),
            max: new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"](),
        };
    }
}
class TrackedRouter {
    constructor() {
        this.ID = "";
        this.type = "router";
        this.owner = "";
        this.pulledAt = 0;
        this.firstSpawn = undefined;
        this.destroyed = undefined;
        this.count = 0;
    }
}
class Playtime {
    constructor() {
        this.characterID = "";
        this.secondsOnline = 0;
        this.infil = new ClassBreakdown();
        this.lightAssault = new ClassBreakdown();
        this.medic = new ClassBreakdown();
        this.engineer = new ClassBreakdown();
        this.heavy = new ClassBreakdown();
        this.max = new ClassBreakdown();
        this.mostPlayed = {
            name: "",
            secondsAs: 0,
        };
    }
}
class ClassUsage {
    constructor() {
        this.mostPlayed = {
            name: "",
            secondsAs: 0
        };
        this.infil = new ClassBreakdown();
        this.lightAssault = new ClassBreakdown();
        this.medic = new ClassBreakdown();
        this.engineer = new ClassBreakdown();
        this.heavy = new ClassBreakdown();
        this.max = new ClassBreakdown();
    }
}
class Report {
    constructor() {
        this.opened = false;
        this.player = null;
        this.stats = new Map();
        this.classBreakdown = new ClassUsage();
        this.classKd = classKdCollection();
        this.logistics = {
            show: false,
            routers: [],
            metas: []
        };
        this.overtime = {
            kpm: [],
            kd: [],
            rpm: []
        };
        this.perUpdate = {
            kpm: [],
            kd: [],
            rpm: []
        };
        this.collections = [];
        this.vehicleBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.scoreBreakdown = [];
        this.ribbons = [];
        this.ribbonCount = 0;
        this.breakdowns = [];
        this.weaponKillBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.weaponKillTypeBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.weaponDeathBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.weaponDeathTypeBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.playerVersus = [];
    }
}
class PlayerVersusEntry {
    constructor() {
        this.timestamp = 0;
        this.type = "unknown";
        this.weaponName = "";
        this.headshot = false;
    }
}
class PlayerVersus {
    constructor() {
        this.charID = "";
        this.name = "";
        this.kills = 0;
        this.deaths = 0;
        this.revives = 0;
        this.weaponKills = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.weaponDeaths = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.encounters = [];
    }
}
class BreakdownSpawn {
    constructor() {
        this.npcID = "";
        this.count = 0;
        this.firstSeen = new Date();
    }
}
class TrackedPlayer {
    constructor() {
        this.characterID = "";
        this.outfitTag = "";
        this.name = "";
        this.faction = "";
        this.score = 0;
        this.online = true;
        this.joinTime = 0;
        this.secondsOnline = 0;
        this.stats = new StatMap__WEBPACK_IMPORTED_MODULE_7__["default"]();
        this.ribbons = new StatMap__WEBPACK_IMPORTED_MODULE_7__["default"]();
        this.recentDeath = null;
        this.events = [];
    }
}
class BreakdownCollection {
    constructor() {
        this.title = "";
        this.sections = [];
    }
}
class BreakdownSection {
    constructor() {
        this.title = "";
        this.left = null;
        this.right = null;
        this.showPercent = true;
        this.showTotal = true;
    }
}
class BreakdownMeta {
    constructor() {
        this.title = "";
        this.altTitle = "Count";
        this.data = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
    }
}
class BreakdownSingle {
    constructor() {
        this.title = "";
        this.altTitle = "";
        this.data = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
        this.showPercent = true;
        this.showTotal = true;
    }
}
class EventFeedEntry {
    constructor() {
        this.type = "unknown";
        this.text = "";
        this.timestamp = new Date();
        this.effects = [];
    }
}
class ReportParameters {
    constructor() {
        /**
         * Player the report is being generated for
         */
        this.player = new TrackedPlayer();
        /**
         * Contains all events collected during tracking. If you need just the player's events, use @see player
         */
        this.events = [];
        /**
         * Tracking information about the current state the tracker
         */
        this.tracking = { running: false, startTime: 0, endTime: 0 };
        /**
         * All routers tracked
         */
        this.routers = [];
    }
}
class IndividualReporter {
    static generatePersonalReport(parameters) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        if (parameters.player.events.length == 0) {
            response.resolve({ code: 400, data: "No events for player, cannot generate" });
            return response;
        }
        const report = new Report();
        let opsLeft = 
        //1       // Transport assists
        +1 // Supported by
            + 1 // Misc collection
            + 1 // Weapon kills
            + 1 // Weapon type kills
            + 1 // Weapon deaths
            + 1 // Weapon death types
            + 1 // Ribbons
            + 1 // Medic breakdown
            + 1 // Engineer breakdown
            + 1 // Player versus
        ;
        const totalOps = opsLeft;
        const firstPlayerEvent = parameters.player.events[0];
        const lastPlayerEvent = parameters.player.events[parameters.player.events.length - 1];
        report.player = Object.assign({}, parameters.player);
        report.player.events = [];
        report.player.secondsOnline = (lastPlayerEvent.timestamp - firstPlayerEvent.timestamp) / 1000;
        report.classBreakdown = IndividualReporter.classUsage(parameters);
        report.classKd = IndividualReporter.classVersusKd(parameters.player.events);
        report.scoreBreakdown = IndividualReporter.scoreBreakdown(parameters);
        report.player.stats.getMap().forEach((value, eventID) => {
            var _a;
            const event = PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvents"].get(eventID);
            if (event == undefined) {
                return;
            }
            report.stats.set(event.name, `${value}`);
            (_a = report.player) === null || _a === void 0 ? void 0 : _a.stats.set(event.name, value);
        });
        const calculatedStats = IndividualReporter.calculatedStats(parameters, report.classBreakdown);
        calculatedStats.forEach((value, key) => {
            report.stats.set(key, value);
        });
        report.logistics.routers = IndividualReporter.routerBreakdown(parameters);
        const callback = (step) => {
            return () => {
                console.log(`Finished ${step}: Have ${opsLeft - 1} ops left outta ${totalOps}`);
                if (--opsLeft == 0) {
                    response.resolveOk(report);
                }
            };
        };
        IndividualReporter.supportedBy(parameters)
            .ok(data => report.collections.push(data)).always(callback("Supported by"));
        IndividualReporter.miscCollection(parameters)
            .ok(data => report.collections.push(data)).always(callback("Misc coll"));
        EventReporter__WEBPACK_IMPORTED_MODULE_8__["default"].weaponKills(parameters.player.events)
            .ok(data => report.weaponKillBreakdown = data).always(callback("Weapon kills"));
        EventReporter__WEBPACK_IMPORTED_MODULE_8__["default"].weaponTypeKills(parameters.player.events)
            .ok(data => report.weaponKillTypeBreakdown = data).always(callback("Weapon type kills"));
        EventReporter__WEBPACK_IMPORTED_MODULE_8__["default"].weaponDeaths(parameters.player.events)
            .ok(data => report.weaponDeathBreakdown = data).always(callback("Weapon deaths"));
        EventReporter__WEBPACK_IMPORTED_MODULE_8__["default"].weaponTypeDeaths(parameters.player.events)
            .ok(data => report.weaponDeathTypeBreakdown = data).always(callback("Weapon type deaths"));
        IndividualReporter.playerVersus(parameters).ok(data => report.playerVersus = data).always(callback("Player versus"));
        report.overtime.kd = EventReporter__WEBPACK_IMPORTED_MODULE_8__["default"].kdOverTime(parameters.player.events);
        report.overtime.kpm = EventReporter__WEBPACK_IMPORTED_MODULE_8__["default"].kpmOverTime(parameters.player.events);
        if (parameters.player.events.find(iter => iter.type == "exp" && (iter.expID == PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].revive || iter.expID == PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].squadRevive)) != undefined) {
            report.overtime.rpm = EventReporter__WEBPACK_IMPORTED_MODULE_8__["default"].revivesOverTime(parameters.player.events);
        }
        report.perUpdate.kd = EventReporter__WEBPACK_IMPORTED_MODULE_8__["default"].kdPerUpdate(parameters.player.events);
        const ribbonIDs = Array.from(parameters.player.ribbons.getMap().keys());
        if (ribbonIDs.length > 0) {
            census_AchievementAPI__WEBPACK_IMPORTED_MODULE_4__["AchievementAPI"].getByIDs(ribbonIDs).ok((data) => {
                var _a;
                (_a = report.player) === null || _a === void 0 ? void 0 : _a.ribbons.getMap().forEach((amount, achivID) => {
                    const achiv = data.find((iter) => iter.ID == achivID) || census_AchievementAPI__WEBPACK_IMPORTED_MODULE_4__["AchievementAPI"].unknown;
                    const entry = Object.assign(Object.assign({}, achiv), { amount: amount });
                    report.ribbonCount += amount;
                    report.ribbons.push(entry);
                });
                report.ribbons.sort((a, b) => {
                    return (b.amount - a.amount) || b.name.localeCompare(a.name);
                });
            }).always(() => {
                callback("Ribbons")();
            });
        }
        else {
            callback("Ribbons")();
        }
        if (report.classBreakdown.medic.secondsAs > 10) {
            IndividualReporter.medicBreakdown(parameters)
                .ok(data => report.breakdowns.push(data)).always(callback("Medic breakdown"));
        }
        else {
            callback("Medic breakdown")();
        }
        if (report.classBreakdown.engineer.secondsAs > 10) {
            IndividualReporter.engineerBreakdown(parameters)
                .ok(data => report.breakdowns.push(data)).always(callback("Eng breakdown"));
        }
        else {
            callback("Eng breakdown")();
        }
        return response;
    }
    static playerVersus(parameters) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const versus = [];
        const charIDs = [];
        const wepIDs = [];
        for (const ev of parameters.player.events) {
            if (ev.sourceID != parameters.player.characterID) {
                continue;
            }
            if (ev.type != "kill" && ev.type != "death") {
                continue;
            }
            charIDs.push(ev.targetID);
            wepIDs.push(ev.weaponID);
        }
        let characters = [];
        let weapons = [];
        let opsLeft = 2;
        const killsMap = new Map();
        const deathsMap = new Map();
        const done = () => {
            var _a, _b, _c, _d, _e, _f;
            for (const ev of parameters.player.events) {
                if (ev.sourceID != parameters.player.characterID) {
                    continue;
                }
                if (ev.type != "kill" && ev.type != "death") {
                    continue;
                }
                let entry = versus.find(iter => iter.charID == ev.targetID);
                if (entry == undefined) {
                    entry = new PlayerVersus();
                    entry.charID = ev.targetID;
                    entry.name = (_b = (_a = characters.find(iter => iter.ID == ev.targetID)) === null || _a === void 0 ? void 0 : _a.name, (_b !== null && _b !== void 0 ? _b : `Unknown ${ev.targetID}`));
                    killsMap.set(ev.targetID, new StatMap__WEBPACK_IMPORTED_MODULE_7__["default"]());
                    deathsMap.set(ev.targetID, new StatMap__WEBPACK_IMPORTED_MODULE_7__["default"]());
                    versus.push(entry);
                }
                const weaponName = (_d = (_c = weapons.find(iter => iter.ID == ev.weaponID)) === null || _c === void 0 ? void 0 : _c.name, (_d !== null && _d !== void 0 ? _d : `Unknown ${ev.weaponID}`));
                let type = "unknown";
                if (ev.type == "kill") {
                    ++entry.kills;
                    type = "kill";
                    killsMap.get(ev.targetID).increment(weaponName);
                }
                else if (ev.type == "death") {
                    if (ev.revived == true) {
                        ++entry.revives;
                        type = "revived";
                    }
                    else {
                        ++entry.deaths;
                        type = "death";
                        deathsMap.get(ev.targetID).increment(weaponName);
                    }
                }
                else {
                    console.error(`Unchecked event type: '${ev}'`);
                }
                const encounter = {
                    timestamp: ev.timestamp,
                    headshot: ev.isHeadshot,
                    type: type,
                    weaponName: (_f = (_e = weapons.find(iter => iter.ID == ev.weaponID)) === null || _e === void 0 ? void 0 : _e.name, (_f !== null && _f !== void 0 ? _f : `Unknown ${ev.weaponID}`))
                };
                entry.encounters.push(encounter);
            }
            for (const entry of versus) {
                if (killsMap.has(entry.charID) == false) {
                    console.error(`Missing killsMap entry for ${entry.name}`);
                    continue;
                }
                if (deathsMap.has(entry.charID) == false) {
                    console.error(`Missing deathsMap entry for ${entry.name}`);
                    continue;
                }
                const killMap = killsMap.get(entry.charID);
                const deathMap = deathsMap.get(entry.charID);
                const killBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
                killMap.getMap().forEach((amount, weapon) => {
                    killBreakdown.data.push({
                        display: weapon,
                        amount: amount,
                        sortField: weapon,
                        color: undefined
                    });
                    killBreakdown.total += amount;
                });
                entry.weaponKills = killBreakdown;
                const deathBreakdown = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
                deathMap.getMap().forEach((amount, weapon) => {
                    deathBreakdown.data.push({
                        display: weapon,
                        amount: amount,
                        sortField: weapon,
                        color: undefined
                    });
                    deathBreakdown.total += amount;
                });
                entry.weaponDeaths = deathBreakdown;
            }
            response.resolveOk(versus);
        };
        census_CharacterAPI__WEBPACK_IMPORTED_MODULE_1__["CharacterAPI"].getByIDs(charIDs).ok((data) => {
            characters = data;
            if (--opsLeft == 0) {
                done();
            }
        });
        census_WeaponAPI__WEBPACK_IMPORTED_MODULE_2__["WeaponAPI"].getByIDs(wepIDs).ok((data) => {
            weapons = data;
            if (--opsLeft == 0) {
                done();
            }
        });
        return response;
    }
    static medicBreakdown(parameters) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const medicCollection = new BreakdownCollection();
        medicCollection.title = "Medic";
        let opsLeft = 1 // Heals
            + 1 // Revives
            + 1; // Shield repair
        const add = (data) => {
            medicCollection.sections.push(data);
        };
        const callback = () => {
            if (--opsLeft == 0) {
                response.resolveOk(medicCollection);
            }
        };
        IndividualReporter.breakdownSection(parameters, "Heal ticks", PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].heal, PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].squadHeal).ok(add).always(callback);
        IndividualReporter.breakdownSection(parameters, "Revives", PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].revive, PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].squadRevive).ok(add).always(callback);
        IndividualReporter.breakdownSection(parameters, "Shield repair ticks", PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].shieldRepair, PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].squadShieldRepair).ok(add).always(callback);
        return response;
    }
    static engineerBreakdown(parameters) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const engCollection = new BreakdownCollection();
        engCollection.title = "Engineer";
        let opsLeft = 1 // Resupply
            + 1; // Repair MAX
        const add = (data) => {
            engCollection.sections.push(data);
        };
        const callback = () => {
            if (--opsLeft == 0) {
                response.resolveOk(engCollection);
            }
        };
        IndividualReporter.breakdownSection(parameters, "Resupply ticks", PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].resupply, PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].squadResupply).ok(add).always(callback);
        IndividualReporter.breakdownSection(parameters, "MAX repair ticks", PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].maxRepair, PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].squadMaxRepair).ok(add).always(callback);
        return response;
    }
    static breakdownSection(parameters, name, expID, squadExpID) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const ticks = parameters.player.events.filter(iter => iter.type == "exp" && iter.expID == expID);
        if (ticks.length > 0) {
            const section = new BreakdownSection();
            section.title = name;
            let opsLeft = 2;
            const callback = () => {
                if (--opsLeft == 0) {
                    response.resolveOk(section);
                }
            };
            section.left = new BreakdownMeta();
            section.left.title = "All";
            EventReporter__WEBPACK_IMPORTED_MODULE_8__["default"].experience(expID, ticks).ok((data) => {
                section.left.data = data;
            }).always(callback);
            section.right = new BreakdownMeta();
            section.right.title = "Squad only";
            EventReporter__WEBPACK_IMPORTED_MODULE_8__["default"].experience(squadExpID, ticks).ok((data) => {
                section.right.data = data;
            }).always(callback);
        }
        else {
            response.resolve({ code: 204, data: null });
        }
        return response;
    }
    static miscCollection(parameters) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const coll = {
            header: "Misc",
            metas: []
        };
        let opsLeft = 1; // Deployabled destroyed
        const dep = IndividualReporter.deployableDestroyedBreakdown(parameters);
        if (dep != null) {
            coll.metas.push(dep);
        }
        if (coll.metas.length > 0) {
            response.resolveOk(coll);
        }
        else {
            response.resolve({ code: 204, data: null });
        }
        return response;
    }
    static supportedBy(parameters) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const coll = {
            header: "Supported by",
            metas: []
        };
        let opsLeft = 1 // Healed by
            + 1 // Revived by
            + 1 // Shield repaired by
            + 1 // Resupplied by
            + 1; // Repaired by
        const add = (data) => {
            coll.metas.push(data);
        };
        const callback = () => {
            if (--opsLeft == 0) {
                response.resolveOk(coll);
            }
        };
        IndividualReporter.singleSupportedBy(parameters, "Healed by", [PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].heal, PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].squadHeal]).ok(add).always(callback);
        IndividualReporter.singleSupportedBy(parameters, "Revived by", [PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].revive, PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].squadRevive]).ok(add).always(callback);
        IndividualReporter.singleSupportedBy(parameters, "Shield repaired by", [PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].shieldRepair, PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].squadShieldRepair]).ok(add).always(callback);
        IndividualReporter.singleSupportedBy(parameters, "Resupplied by", [PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].resupply, PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].squadResupply]).ok(add).always(callback);
        IndividualReporter.singleSupportedBy(parameters, "Repaired by", [PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].maxRepair, PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].squadMaxRepair]).ok(add).always(callback);
        return response;
    }
    static singleSupportedBy(parameters, name, ids) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        let found = false;
        for (const ev of parameters.events) {
            if (ev.type == "exp" && ids.indexOf(ev.expID) > -1 && ev.targetID == parameters.player.characterID) {
                found = true;
                break;
            }
        }
        if (found == false) {
            response.resolve({ code: 204, data: null });
        }
        else {
            const meta = new BreakdownSingle();
            meta.title = name;
            meta.altTitle = "Player";
            meta.data = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
            EventReporter__WEBPACK_IMPORTED_MODULE_8__["default"].experienceSource(ids, parameters.player.characterID, parameters.events).ok((data) => {
                meta.data = data;
                console.log(`Found [${data.data.map(iter => `${iter.display}:${iter.amount}`).join(", ")}] for [${ids.join(", ")}]`);
                response.resolveOk(meta);
            });
        }
        return response;
    }
    static deployableDestroyedBreakdown(parameters) {
        const expIDs = [
            "57",
            "270",
            "327",
            "370",
            "437",
            "579",
            "1373",
            "1409",
        ];
        const ticks = parameters.player.events.filter((iter) => {
            if (iter.type != "exp") {
                return false;
            }
            return expIDs.indexOf(iter.expID) > -1;
        });
        if (ticks.length > 0) {
            const meta = new BreakdownSingle();
            meta.title = "Deployable kills";
            meta.altTitle = "Deployable";
            meta.data = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
            const map = new StatMap__WEBPACK_IMPORTED_MODULE_7__["default"]();
            for (const tick of ticks) {
                let name = "unknown";
                if (tick.expID == "57") {
                    name = "Engineer turret";
                }
                else if (tick.expID == "270") {
                    name = "Spawn beacon";
                }
                else if (tick.expID == "327") {
                    name = "Tank mine";
                }
                else if (tick.expID == "370") {
                    name = "Motion sensor";
                }
                else if (tick.expID == "437") {
                    name = "Shield bubble";
                }
                else if (tick.expID == "579") {
                    name = "Spitfire";
                }
                else if (tick.expID == "1373") {
                    name = "Hardlight";
                }
                else if (tick.expID == "1409") {
                    name = "Router";
                }
                else {
                    name = `Unknown ${tick.expID}`;
                }
                map.increment(name);
            }
            map.getMap().forEach((amount, expName) => {
                meta.data.total += amount;
                meta.data.data.push({
                    display: expName,
                    sortField: expName,
                    amount: amount,
                    color: undefined
                });
            });
            meta.data.data.sort((a, b) => {
                return b.amount - a.amount || a.sortField.localeCompare(b.sortField);
            });
            return meta;
        }
        return null;
    }
    static routerBreakdown(parameters) {
        const rts = parameters.routers.filter(iter => iter.owner == parameters.player.characterID);
        return rts;
    }
    static transportAssists(parameters) {
        const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"]();
        const transAssists = parameters.player.events.filter(iter => iter.type == "exp" && iter.expID == "30");
        if (transAssists.length > 0) {
            const killedIDs = transAssists.map(iter => iter.targetID).filter((iter, index, arr) => arr.indexOf(iter) == index);
            const firstEv = Math.min(...transAssists.map(iter => iter.timestamp));
            const lastEv = Math.max(...transAssists.map(iter => iter.timestamp));
            const map = new StatMap__WEBPACK_IMPORTED_MODULE_7__["default"]();
            const meta = new BreakdownMeta();
            meta.title = "Transport assists";
            meta.data = new EventReporter__WEBPACK_IMPORTED_MODULE_8__["BreakdownArray"]();
            census_EventAPI__WEBPACK_IMPORTED_MODULE_3__["EventAPI"].getMultiDeaths(killedIDs, firstEv, lastEv).ok((data) => {
                const killers = [];
                for (const assist of transAssists) {
                    const death = data.find(iter => iter.sourceID == assist.targetID && iter.timestamp == assist.timestamp);
                    if (death == undefined) {
                        console.warn(`Missing event death for transport assist for ${assist.targetID} at ${assist.timestamp}`);
                        continue;
                    }
                    killers.push(death.targetID);
                }
                census_CharacterAPI__WEBPACK_IMPORTED_MODULE_1__["CharacterAPI"].getByIDs(killers.filter((v, i, a) => a.indexOf(v) == i)).ok((data) => {
                    for (const killer of killers) {
                        const killerChar = data.find(iter => iter.ID == killer);
                        if (killerChar == undefined) {
                            console.warn(`Missing character ${killer} when generating transport assists`);
                            continue;
                        }
                        map.increment(killerChar.name);
                    }
                    map.getMap().forEach((amount, char) => {
                        const breakdown = {
                            display: char,
                            sortField: char,
                            amount: amount,
                            color: undefined
                        };
                        meta.data.data.push(breakdown);
                        meta.data.total += amount;
                    });
                    meta.data.data.sort((a, b) => {
                        return (b.amount - a.amount) || a.sortField.localeCompare(b.sortField);
                    });
                    response.resolveOk(meta);
                });
            });
        }
        else {
            response.resolve({ code: 204, data: null });
        }
        return response;
    }
    static calculatedStats(parameters, classKd) {
        const map = new Map();
        const stats = parameters.player.stats;
        map.set("KPM", (stats.get("Kill") / (parameters.player.secondsOnline / 60)).toFixed(2));
        // K/D = Kills / Deaths
        map.set("K/D", (stats.get("Kill") / stats.get("Death", 1)).toFixed(2));
        // KA/D = Kills + Assits / Deaths
        map.set("KA/D", ((stats.get("Kill") + stats.get("Kill assist")) / stats.get("Death", 1)).toFixed(2));
        // HSR = Headshots / Kills
        map.set("HSR", `${(stats.get("Headshot") / stats.get("Kill") * 100).toFixed(2)}%`);
        // KR/D  = Kills + Revives / Deaths
        map.set("KR/D", ((classKd.medic.kills + stats.get("Revive"))
            / (classKd.medic.deaths || 1)).toFixed(2));
        // R/D = Revives / Death
        map.set("R/D", (stats.get("Revive") / (classKd.medic.deaths || 1)).toFixed(2));
        // RPM = Revives / minutes online
        map.set("RPM", (stats.get("Revive") / (classKd.medic.secondsAs / 60)).toFixed(2));
        return map;
    }
    static scoreBreakdown(parameters) {
        const breakdown = new Map();
        for (const event of parameters.player.events) {
            if (event.type == "exp") {
                const exp = PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvents"].get(event.expID) || PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].other;
                if (!breakdown.has(exp.name)) {
                    breakdown.set(exp.name, new ExpBreakdown());
                }
                const score = breakdown.get(exp.name);
                score.name = exp.name;
                score.score += event.amount;
                score.amount += 1;
                if (exp == PsEvent__WEBPACK_IMPORTED_MODULE_6__["PsEvent"].other) {
                    //console.log(`Other: ${JSON.stringify(event)}`);
                }
            }
        }
        // Sort all the entries by score, followed by amount, then lastly name
        return [...breakdown.entries()].sort((a, b) => {
            return b[1].score - a[1].score
                || b[1].amount - a[1].amount
                || a[0].localeCompare(b[0]);
        }).map((a) => a[1]); // Transform the tuple into the ExpBreakdown
    }
    static classVersusKd(events, classLimit) {
        const kds = classKdCollection();
        events.forEach((event) => {
            if (event.type == "kill" || event.type == "death") {
                const sourceLoadoutID = event.loadoutID;
                const sourceLoadout = census_PsLoadout__WEBPACK_IMPORTED_MODULE_5__["PsLoadouts"].get(sourceLoadoutID);
                if (sourceLoadout == undefined) {
                    return;
                }
                const targetLoadoutID = event.targetLoadoutID;
                const targetLoadout = census_PsLoadout__WEBPACK_IMPORTED_MODULE_5__["PsLoadouts"].get(targetLoadoutID);
                if (targetLoadout == undefined) {
                    return;
                }
                if (classLimit != undefined) {
                    if (sourceLoadout.type != classLimit) {
                        return; // Continue to next iteration
                    }
                }
                if (event.type == "kill") {
                    switch (targetLoadout.type) {
                        case "infil":
                            kds.infil.kills += 1;
                            break;
                        case "lightAssault":
                            kds.lightAssault.kills += 1;
                            break;
                        case "medic":
                            kds.medic.kills += 1;
                            break;
                        case "engineer":
                            kds.engineer.kills += 1;
                            break;
                        case "heavy":
                            kds.heavy.kills += 1;
                            break;
                        case "max":
                            kds.max.kills += 1;
                            break;
                        default: console.warn(`Unknown type`);
                    }
                }
                if (event.type == "death" && event.revived == false) {
                    switch (targetLoadout.type) {
                        case "infil":
                            kds.infil.deaths += 1;
                            break;
                        case "lightAssault":
                            kds.lightAssault.deaths += 1;
                            break;
                        case "medic":
                            kds.medic.deaths += 1;
                            break;
                        case "engineer":
                            kds.engineer.deaths += 1;
                            break;
                        case "heavy":
                            kds.heavy.deaths += 1;
                            break;
                        case "max":
                            kds.max.deaths += 1;
                            break;
                        default: console.warn(`Unknown type`);
                    }
                }
                if (event.type == "death" && event.revived == true) {
                    switch (targetLoadout.type) {
                        case "infil":
                            kds.infil.score += 1;
                            break;
                        case "lightAssault":
                            kds.lightAssault.score += 1;
                            break;
                        case "medic":
                            kds.medic.score += 1;
                            break;
                        case "engineer":
                            kds.engineer.score += 1;
                            break;
                        case "heavy":
                            kds.heavy.score += 1;
                            break;
                        case "max":
                            kds.max.score += 1;
                            break;
                        default: console.warn(`Unknown type`);
                    }
                }
            }
        });
        return kds;
    }
    static classUsage(parameters) {
        const usage = new Playtime();
        if (parameters.player.events.length == 0) {
            return usage;
        }
        let lastLoadout = undefined;
        let lastTimestamp = parameters.player.events[0].timestamp;
        const finalTimestamp = parameters.player.events[parameters.player.events.length - 1].timestamp;
        usage.characterID = parameters.player.characterID;
        usage.secondsOnline = (finalTimestamp - lastTimestamp) / 1000;
        parameters.player.events.forEach((event) => {
            if (event.type == "capture" || event.type == "defend") {
                return;
            }
            lastLoadout = census_PsLoadout__WEBPACK_IMPORTED_MODULE_5__["PsLoadouts"].get(event.loadoutID);
            if (lastLoadout == undefined) {
                return console.warn(`Unknown loadout ID: ${event.loadoutID}`);
            }
            if (event.type == "exp") {
                const diff = (event.timestamp - lastTimestamp) / 1000;
                lastTimestamp = event.timestamp;
                switch (lastLoadout.type) {
                    case "infil":
                        usage.infil.secondsAs += diff;
                        break;
                    case "lightAssault":
                        usage.lightAssault.secondsAs += diff;
                        break;
                    case "medic":
                        usage.medic.secondsAs += diff;
                        break;
                    case "engineer":
                        usage.engineer.secondsAs += diff;
                        break;
                    case "heavy":
                        usage.heavy.secondsAs += diff;
                        break;
                    case "max":
                        usage.max.secondsAs += diff;
                        break;
                    default: console.warn(`Unknown type`);
                }
            }
            if (event.type == "exp") {
                switch (lastLoadout.type) {
                    case "infil":
                        usage.infil.score += event.amount;
                        break;
                    case "lightAssault":
                        usage.lightAssault.score += event.amount;
                        break;
                    case "medic":
                        usage.medic.score += event.amount;
                        break;
                    case "engineer":
                        usage.engineer.score += event.amount;
                        break;
                    case "heavy":
                        usage.heavy.score += event.amount;
                        break;
                    case "max":
                        usage.max.score += event.amount;
                        break;
                    default: console.warn(`Unknown type`);
                }
            }
            else if (event.type == "kill") {
                switch (lastLoadout.type) {
                    case "infil":
                        usage.infil.kills += 1;
                        break;
                    case "lightAssault":
                        usage.lightAssault.kills += 1;
                        break;
                    case "medic":
                        usage.medic.kills += 1;
                        break;
                    case "engineer":
                        usage.engineer.kills += 1;
                        break;
                    case "heavy":
                        usage.heavy.kills += 1;
                        break;
                    case "max":
                        usage.max.kills += 1;
                        break;
                    default: console.warn(`Unknown type`);
                }
            }
            else if (event.type == "death" && event.revived == false) {
                switch (lastLoadout.type) {
                    case "infil":
                        usage.infil.deaths += 1;
                        break;
                    case "lightAssault":
                        usage.lightAssault.deaths += 1;
                        break;
                    case "medic":
                        usage.medic.deaths += 1;
                        break;
                    case "engineer":
                        usage.engineer.deaths += 1;
                        break;
                    case "heavy":
                        usage.heavy.deaths += 1;
                        break;
                    case "max":
                        usage.max.deaths += 1;
                        break;
                    default: console.warn(`Unknown type`);
                }
            }
        });
        let maxTime = 0;
        if (usage.infil.secondsAs > maxTime) {
            maxTime = usage.infil.secondsAs;
            usage.mostPlayed.name = "Infiltrator";
        }
        if (usage.lightAssault.secondsAs > maxTime) {
            maxTime = usage.lightAssault.secondsAs;
            usage.mostPlayed.name = "Light Assault";
        }
        if (usage.medic.secondsAs > maxTime) {
            maxTime = usage.medic.secondsAs;
            usage.mostPlayed.name = "Medic";
        }
        if (usage.engineer.secondsAs > maxTime) {
            maxTime = usage.engineer.secondsAs;
            usage.mostPlayed.name = "Engineer";
        }
        if (usage.heavy.secondsAs > maxTime) {
            maxTime = usage.heavy.secondsAs;
            usage.mostPlayed.name = "Heavy";
        }
        if (usage.max.secondsAs > maxTime) {
            maxTime = usage.max.secondsAs;
            usage.mostPlayed.name = "MAX";
        }
        usage.mostPlayed.secondsAs = maxTime;
        return usage;
    }
    static unrevivedTime(events) {
        const array = [];
        for (const ev of events) {
            if (ev.type != "death") {
                continue;
            }
            if (ev.revivedEvent != null) {
                const diff = (ev.revivedEvent.timestamp - ev.timestamp) / 1000;
                if (diff > 40) {
                    continue; // Somehow death events are missed and a revive event is linked to the wrong death
                }
                array.push(diff);
            }
        }
        return array.sort((a, b) => b - a);
    }
    static reviveLifeExpectance(events) {
        const array = [];
        for (const ev of events) {
            if (ev.type != "death" || ev.revivedEvent == null) {
                continue;
            }
            const charEvents = events.filter(iter => iter.sourceID == ev.sourceID);
            const index = charEvents.findIndex(iter => {
                return iter.type == "death" && iter.timestamp == ev.timestamp && iter.targetID == ev.targetID;
            });
            if (index == -1) {
                console.error(`Failed to find a death for ${ev.sourceID} at ${ev.timestamp} but wasn't found in charEvents`);
                continue;
            }
            let nextDeath = null;
            for (let i = index + 1; i < charEvents.length; ++i) {
                if (charEvents[i].type == "death") {
                    nextDeath = charEvents[i];
                    break;
                }
            }
            if (nextDeath == null) {
                console.error(`Failed to find the next death for ${ev.sourceID} at ${ev.timestamp}`);
                continue;
            }
            const diff = (nextDeath.timestamp - ev.revivedEvent.timestamp) / 1000;
            if (diff <= 20) {
                array.push(diff);
            }
        }
        return array.sort((a, b) => b - a);
    }
    static lifeExpectanceRate(events) {
        const array = [];
        for (const ev of events) {
            if (ev.type != "death" || ev.revivedEvent == null) {
                continue;
            }
            const charEvents = events.filter(iter => iter.sourceID == ev.sourceID);
            const index = charEvents.findIndex(iter => {
                return iter.type == "death" && iter.timestamp == ev.timestamp && iter.targetID == ev.targetID;
            });
            if (index == -1) {
                console.error(`Failed to find a death for ${ev.sourceID} at ${ev.timestamp} but wasn't found in charEvents`);
                continue;
            }
            let nextDeath = null;
            for (let i = index + 1; i < charEvents.length; ++i) {
                if (charEvents[i].type == "death") {
                    nextDeath = charEvents[i];
                    break;
                }
            }
            if (nextDeath == null) {
                console.error(`Failed to find the next death for ${ev.sourceID} at ${ev.timestamp}`);
                continue;
            }
            const diff = (nextDeath.timestamp - ev.revivedEvent.timestamp) / 1000;
            array.push(diff);
        }
        const probs = this.kaplanMeier(array, 20);
        return probs;
    }
    static timeUntilReviveRate(events) {
        const array = [];
        for (const ev of events) {
            if (ev.type != "death") {
                continue;
            }
            if (ev.revivedEvent != null) {
                const diff = (ev.revivedEvent.timestamp - ev.timestamp) / 1000;
                if (diff > 40) {
                    continue; // Somehow death events are missed and a revive event is linked to the wrong death
                }
                array.push(diff);
            }
        }
        const probs = this.kaplanMeier(array);
        return probs;
    }
    static kaplanMeier(data, max) {
        const ticks = [...Array((max !== null && max !== void 0 ? max : Math.max(...data))).keys()];
        const probs = [];
        let cur_pop = [...Array(data.length).keys()];
        for (const tick of ticks) {
            const survived = data.filter(iter => iter > tick).length;
            probs.push(survived / cur_pop.length);
            cur_pop = data.filter(iter => iter > tick);
        }
        let cumul = 1;
        for (let i = 0; i < probs.length; ++i) {
            probs[i] = cumul * probs[i];
            cumul = probs[i];
        }
        return probs;
    }
    static generateContinentPlayedOn(events) {
        let indar = 0;
        let esamir = 0;
        let amerish = 0;
        let hossin = 0;
        for (const ev of events) {
            if (ev.type == "kill" || ev.type == "death") {
                switch (ev.zoneID) {
                    case "2":
                        ++indar;
                        break;
                    case "4":
                        ++hossin;
                        break;
                    case "6":
                        ++amerish;
                        break;
                    case "8":
                        ++esamir;
                        break;
                }
            }
        }
        let count = 0;
        let cont = "Default";
        if (indar > count) {
            cont = "Indar";
            count = indar;
        }
        if (esamir > count) {
            cont = "Esamir";
            count = esamir;
        }
        if (amerish > count) {
            cont = "Amerish";
            count = amerish;
        }
        if (hossin > count) {
            cont = "Hossin";
            count = hossin;
        }
        return cont;
    }
}
window.IndividualReporter = IndividualReporter;


/***/ }),

/***/ "../Loadable.ts":
/*!**********************!*\
  !*** ../Loadable.ts ***!
  \**********************/
/*! exports provided: Loadable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Loadable", function() { return Loadable; });
/**
 * Helper class to generating Loading instances
 */
class Loadable {
    /**
     * Create a Loading that is in the state of 'loading'. Data will be null
     */
    static loading() {
        return { state: "loading", data: null };
    }
    /**
     * Create a Loading that is in the state of 'idle'. Data will be null
     */
    static idle() {
        return { state: "idle", data: null };
    }
    /**
     * Create a Loading that is in the state of 'loaded'. Data will be what is passed
     *
     * @param data Data that was loaded externally
     */
    static loaded(data) {
        return { state: "loaded", data: data };
    }
    /**
     * Create a Loading that is in the state of 'error'. Data will be the error passed
     *
     * @param err Error that occured while attemping to load this external resource
     */
    static error(err) {
        return { state: "error", message: err };
    }
    /**
     * Create a Loading that is in the state of 'nocontent'. Data will be null
     */
    static nocontent() {
        return { state: "nocontent", data: null };
    }
    /**
     * Creating a Loading that is in the state of 'saving'. Data will be what is passed.
     *  Used when an external resource has been loaded, but is now being changed. The data is still loaded and valid,
     *      but is being updated. This is useful for a saving icon that rotates when the data is being saved, but
     *      the data that is loaded should still be displayed
     *
     * @param data Data that was previously loaded, but is now saving
     */
    static saving(data) {
        return { state: "saving", data: data };
    }
}


/***/ }),

/***/ "../PsEvent.ts":
/*!*********************!*\
  !*** ../PsEvent.ts ***!
  \*********************/
/*! exports provided: PsEvent, PsEvents */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PsEvent", function() { return PsEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PsEvents", function() { return PsEvents; });
class PsEvent {
    constructor() {
        // Display friendly name
        this.name = "";
        // What type of event is this?
        this.types = [];
        // Is this an event that will be kept track of in the map?
        this.track = true;
        this.alsoIncrement = undefined;
    }
}
PsEvent.default = {
    name: "Default",
    types: [],
    track: false
};
PsEvent.other = {
    name: "Other",
    types: [],
    track: false
};
// General events
PsEvent.kill = "1";
PsEvent.killAssist = "2";
PsEvent.headshot = "37";
PsEvent.teamkill = "-2";
PsEvent.teamkilled = "-7";
PsEvent.death = "-1";
PsEvent.revived = "-6";
PsEvent.baseCapture = "-3";
PsEvent.baseDefense = "-4";
PsEvent.squadSpawn = "56";
PsEvent.capturePoint = "272";
// Medic events
PsEvent.heal = "4";
PsEvent.healAssist = "5";
PsEvent.revive = "7";
PsEvent.squadRevive = "53";
PsEvent.squadHeal = "51";
PsEvent.shieldRepair = "438";
PsEvent.squadShieldRepair = "439";
// Engineer events
PsEvent.maxRepair = "6";
PsEvent.vehicleRepair = "90";
PsEvent.resupply = "34";
PsEvent.squadResupply = "55";
PsEvent.squadMaxRepair = "142";
// Recon events
PsEvent.spotKill = "36";
PsEvent.squadSpotKill = "54";
PsEvent.motionDetect = "293";
PsEvent.squadMotionDetect = "294";
PsEvent.radarDetect = "353";
PsEvent.squadRadarDetect = "354";
PsEvent.roadkill = "26";
PsEvent.transportAssists = "30";
PsEvent.concAssist = "550";
PsEvent.squadConcAssist = "551";
PsEvent.empAssist = "552";
PsEvent.squadEmpAssist = "553";
PsEvent.flashAssist = "554";
PsEvent.squadFlashAssist = "555";
PsEvent.savior = "335";
const remap = (expID, toID) => {
    return [expID, { name: "", types: [], track: true, alsoIncrement: toID }];
};
// All of the events to be tracked, updating this will change what events are subscribed as well
const PsEvents = new Map([
    [PsEvent.baseCapture, {
            name: "Base capture",
            types: ["general", "objective"],
            track: false
        }],
    [PsEvent.baseDefense, {
            name: "Base defense",
            types: ["general", "objective"],
            track: false
        }],
    [PsEvent.teamkill, {
            name: "Teamkill",
            types: ["versus"],
            track: false
        }],
    [PsEvent.teamkilled, {
            name: "Teamkilled",
            types: ["versus"],
            track: false
        }],
    [PsEvent.death, {
            name: "Death",
            types: ["general", "versus"],
            track: false
        }],
    [PsEvent.revived, {
            name: "Revived",
            types: [],
            track: false
        }],
    [PsEvent.kill, {
            name: "Kill",
            types: ["general", "versus"],
            track: false
        }],
    [PsEvent.killAssist, {
            name: "Kill assist",
            types: ["versus"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.heal, {
            name: "Heal",
            types: ["medic"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.healAssist, {
            name: "Heal assist",
            types: [],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.maxRepair, {
            name: "MAX repair",
            types: ["engineer"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.revive, {
            name: "Revive",
            types: ["medic"],
            track: true,
            alsoIncrement: undefined
        }],
    ["15", {
            name: "Control point defend",
            types: ["objective"],
            track: true,
            alsoIncrement: undefined
        }],
    ["16", {
            name: "Control point attack",
            types: ["objective"],
            track: true,
            alsoIncrement: undefined
        }],
    ["19", {
            name: "Base capture",
            types: ["objective"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.roadkill, {
            name: "Roadkill",
            types: [],
            track: true,
            alsoIncrement: undefined
        }],
    ["29", {
            name: "MAX kill",
            types: ["versus"],
            track: true,
            alsoIncrement: PsEvent.kill
        }],
    [PsEvent.transportAssists, {
            name: "Transport assist",
            types: ["logistics"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.resupply, {
            name: "Resupply",
            types: ["engineer"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.spotKill, {
            name: "Spot kill",
            types: ["recon"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.squadHeal, {
            name: "Squad heal",
            types: ["medic"],
            track: true,
            alsoIncrement: PsEvent.heal
        }],
    [PsEvent.squadRevive, {
            name: "Squad revive",
            types: ["medic"],
            track: true,
            alsoIncrement: PsEvent.revive
        }],
    [PsEvent.squadSpotKill, {
            name: "Squad spot kill",
            types: ["recon"],
            track: true,
            alsoIncrement: PsEvent.spotKill
        }],
    [PsEvent.squadResupply, {
            name: "Squad resupply",
            types: ["engineer"],
            track: true,
            alsoIncrement: PsEvent.resupply
        }],
    ["99", {
            name: "Sundy repair",
            types: ["engineer"],
            track: true,
            alsoIncrement: undefined
        }],
    remap("140", "99"),
    [PsEvent.vehicleRepair, {
            name: "Vehicle repair",
            types: ["engineer"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.headshot, {
            name: "Headshot",
            types: ["versus"],
            track: false,
            alsoIncrement: undefined
        }],
    [PsEvent.squadSpawn, {
            name: "Squad spawn",
            types: ["logistics"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.squadMaxRepair, {
            name: "Squad MAX repair",
            types: ["engineer"],
            track: true,
            alsoIncrement: PsEvent.maxRepair
        }],
    ["201", {
            name: "Galaxy spawn bonus",
            types: ["logistics"],
            track: true,
            alsoIncrement: PsEvent.squadSpawn
        }],
    ["233", {
            name: "Sundy spawn",
            types: ["logistics"],
            track: true,
            alsoIncrement: undefined
        }],
    ["236", {
            name: "Facility terminal hack",
            types: [],
            track: true,
            alsoIncrement: undefined
        }],
    ["270", {
            name: "Beacon kill",
            types: ["logistics"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.capturePoint, {
            name: "Capture point",
            types: ["objective"],
            track: true,
            alsoIncrement: undefined
        }],
    ["291", {
            name: "Ribbon",
            types: [],
            track: false,
            alsoIncrement: undefined
        }],
    [PsEvent.motionDetect, {
            name: "Motion detect",
            types: ["recon"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.squadMotionDetect, {
            name: "Squad motion detect",
            types: ["recon"],
            track: true,
            alsoIncrement: PsEvent.motionDetect
        }],
    [PsEvent.radarDetect, {
            name: "Radar detect",
            types: ["recon"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.squadRadarDetect, {
            name: "Squad radar detect",
            types: ["recon"],
            track: true,
            alsoIncrement: PsEvent.radarDetect
        }],
    [PsEvent.savior, {
            name: "Savior kill",
            types: [],
            track: true,
            alsoIncrement: undefined
        }],
    ["355", {
            name: "Squad vehicle spawn",
            types: ["logistics"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.shieldRepair, {
            name: "Shield repair",
            types: ["medic"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.squadShieldRepair, {
            name: "Squad shield repair",
            types: ["medic"],
            track: true,
            alsoIncrement: PsEvent.shieldRepair
        }],
    [PsEvent.concAssist, {
            name: "Conc assist",
            types: ["versus"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.squadConcAssist, {
            name: "Squad conc assist",
            types: ["versus"],
            track: true,
            alsoIncrement: "550" // Conc assist
        }],
    [PsEvent.empAssist, {
            name: "EMP assist",
            types: ["versus"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.squadEmpAssist, {
            name: "Squad EMP assist",
            types: ["versus"],
            track: true,
            alsoIncrement: "552" // EMP assist
        }],
    [PsEvent.flashAssist, {
            name: "Flash assist",
            types: ["versus"],
            track: true,
            alsoIncrement: undefined
        }],
    [PsEvent.squadFlashAssist, {
            name: "Squad flash assist",
            types: ["versus"],
            track: true,
            alsoIncrement: "554" // Flash assist
        }],
    ["556", {
            name: "Defend point pulse",
            types: [],
            track: true,
            alsoIncrement: PsEvent.capturePoint
        }],
    ["557", {
            name: "Capture point pulse",
            types: [],
            track: true,
            alsoIncrement: PsEvent.capturePoint
        }],
    ["674", {
            name: "Cortium harvest",
            types: ["logistics"],
            track: true
        }],
    ["675", {
            name: "Cortium deposit",
            types: ["logistics"],
            track: true
        }],
    ["1393", {
            name: "Hardlight cover",
            types: ["engineer"],
            track: true,
            alsoIncrement: undefined
        }],
    ["1394", {
            name: "Draw fire",
            types: ["engineer"],
            track: true,
            alsoIncrement: "1393"
        }],
    ["1409", {
            name: "Router kill",
            types: ["logistics"],
            track: true,
            alsoIncrement: undefined
        }],
    ["1410", {
            name: "Router spawn",
            types: ["logistics"],
            track: true,
            alsoIncrement: undefined
        }],
    // Remap kills
    remap("8", PsEvent.kill),
    remap("10", PsEvent.kill),
    remap("11", PsEvent.kill),
    remap("25", PsEvent.kill),
    remap("32", PsEvent.kill),
    remap("38", PsEvent.kill),
    remap("277", PsEvent.kill),
    remap("278", PsEvent.kill),
    remap("279", PsEvent.kill),
    remap("335", PsEvent.kill),
    remap("592", PsEvent.kill),
    remap("593", PsEvent.kill),
    remap("593", PsEvent.kill),
    remap("595", PsEvent.kill),
    remap("673", PsEvent.kill),
    ...[
        "3", "371", "372"
    ].map((expID) => remap(expID, PsEvent.killAssist)),
    // Remap vehicle repairs
    ...[
        "88", "89", "91", "92", "93", "94", "95", "96", "97", "98", "100", "303", "503", "581", "653", "1375",
        "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "141", "302", "505", "584", "656", "1378" // Squad
    ].map((expID) => remap(expID, PsEvent.vehicleRepair))
]);


/***/ }),

/***/ "../StatMap.ts":
/*!*********************!*\
  !*** ../StatMap.ts ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return StatMap; });
class StatMap {
    constructor() {
        this._stats = new Map();
    }
    get(statName, fallback = 0) {
        return this._stats.get(statName) || fallback;
    }
    increment(statName, amount = 1) {
        this._stats.set(statName, (this._stats.get(statName) || 0) + amount);
    }
    decrement(statName, amount = 1) {
        const cur = this.get(statName);
        if (cur < amount) {
            this.set(statName, 0);
        }
        else {
            this.set(statName, cur - amount);
        }
    }
    set(statName, amount) {
        this._stats.set(statName, amount);
    }
    size() { return this._stats.size; }
    getMap() { return this._stats; }
    clear() { this._stats.clear(); }
}


/***/ }),

/***/ "../census/AchievementAPI.ts":
/*!***********************************!*\
  !*** ../census/AchievementAPI.ts ***!
  \***********************************/
/*! exports provided: Achievement, AchievementAPI */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Achievement", function() { return Achievement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AchievementAPI", function() { return AchievementAPI; });
/* harmony import */ var _CensusAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CensusAPI */ "../census/CensusAPI.ts");
/* harmony import */ var _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ApiWrapper */ "../census/ApiWrapper.ts");


class Achievement {
    constructor() {
        this.ID = "";
        this.name = "";
        this.imageUrl = "";
        this.description = "";
    }
}
class AchievementAPI {
    static parseCharacter(elem) {
        var _a, _b;
        return {
            ID: elem.achievement_id,
            name: elem.name.en,
            description: (_b = (_a = elem.description) === null || _a === void 0 ? void 0 : _a.en, (_b !== null && _b !== void 0 ? _b : "")),
            imageUrl: elem.image_path
        };
    }
    static getByID(achivID) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        if (AchievementAPI._cache.has(achivID)) {
            response.resolveOk(AchievementAPI._cache.get(achivID));
        }
        else {
            const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`achievement?item_id=${achivID}`);
            request.ok((data) => {
                if (data.returned != 1) {
                    response.resolve({ code: 404, data: `No or multiple weapons returned from ${name}` });
                }
                else {
                    const wep = AchievementAPI.parseCharacter(data.item_list[0]);
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
    static getByIDs(weaponIDs) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        if (weaponIDs.length == 0) {
            response.resolveOk([]);
            return response;
        }
        const weapons = [];
        const requestIDs = [];
        for (const weaponID of weaponIDs) {
            if (AchievementAPI._cache.has(weaponID)) {
                const wep = AchievementAPI._cache.get(weaponID);
                weapons.push(wep);
            }
            else {
                requestIDs.push(weaponID);
            }
        }
        if (requestIDs.length > 0) {
            const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`achievement?achievement_id=${requestIDs.join(",")}`);
            request.ok((data) => {
                if (data.returned == 0) {
                    if (weapons.length == 0) {
                        response.resolve({ code: 404, data: `No or multiple weapons returned from ${name}` });
                    }
                    else {
                        response.resolveOk(weapons);
                    }
                }
                else {
                    for (const datum of data.achievement_list) {
                        const wep = AchievementAPI.parseCharacter(datum);
                        weapons.push(wep);
                        AchievementAPI._cache.set(wep.ID, wep);
                        console.log(`Cached ${wep.ID}`);
                    }
                    response.resolveOk(weapons);
                }
            });
        }
        else {
            response.resolveOk(weapons);
        }
        return response;
    }
}
AchievementAPI._cache = new Map([["0", null]]);
AchievementAPI.unknown = {
    ID: "-1",
    name: "Unknown",
    imageUrl: "",
    description: "Unknown achievement"
};
window.AchievementAPI = AchievementAPI;


/***/ }),

/***/ "../census/ApiWrapper.ts":
/*!*******************************!*\
  !*** ../census/ApiWrapper.ts ***!
  \*******************************/
/*! exports provided: ApiResponse, APIWrapper, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiResponse", function() { return ApiResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APIWrapper", function() { return APIWrapper; });
!(function webpackMissingModule() { var e = new Error("Cannot find module 'jquery'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());

// Default to void as undefined is assignable to void. Would prefer to use never, but there is
// no default value for never, and never cannot be assigned
/**
 * Promise-ish class that is returned from an API request. Use the callback functions .ok(), etc. to handle
 * the result of the request. Unhandles responses will throw an exception
 */
class ApiResponse {
    /**
     * Constructor for an ApiResponse
     *
     * @param responseData  Request that is being performed, and will produce a response
     * @param reader        Function that will read the data from a successful request into the type param T
     */
    constructor(responseData = null, reader = null) {
        /**
         * Status code returned from the API endpoint
         */
        this.status = 0;
        /**
         * Data returned from the API endpoint
         */
        this.data = null;
        /**
         * Callbacks to call when specific status code response is resolved from the API call.
         * If no callbacks are defined for a status code an exception is thrown
         */
        this._callbacks = new Map([]);
        /**
         * Has this API response already been resolved? If so, any additional callbacks added after the
         * constructor is called (due to the late timeout) will immediately be ran
         */
        this._resolved = false;
        if (responseData == null) {
            return;
        }
        // JQuery uses data and jq differently depending on if the request is rejected (status code 404/500)
        // or accepted (anything but a 404/500), so that's pretty neat :^)
        responseData.always((data, state, jq) => {
            let localStatus = 0;
            let localData = null;
            let localUrl = "";
            let localMethod = "";
            if (state == "success") { // data is the object, jq is the JQueryXHR
                if (jq.status === undefined) {
                    throw `Failed to get the status from jq`;
                }
                localStatus = Number(jq.status);
                localUrl = jq.url;
                localMethod = jq.method;
                if (reader != null && jq.status == 200) {
                    if (data.error != undefined || data.errorCode != undefined || data == "") {
                        localStatus = 500;
                        localData = data;
                    }
                    else {
                        localData = reader(data);
                    }
                }
                else {
                    localData = data;
                }
            }
            else if (state == "error") { // data is the JQueryXHR, jq is the status code string
                if (data.status === undefined || data.responseText === undefined) {
                    throw `Invalid data ${data}`;
                }
                localStatus = Number(data.status);
                localData = String(data.responseText);
                localUrl = data.url;
                localMethod = data.method;
            }
            else if (state == "nocontent") {
                localStatus = 204;
                localData = null;
                localUrl = jq.url;
                localMethod = jq.method;
            }
            else {
                debugger;
                throw `Unhandled state ${state}`;
            }
            // TODO: Get rid of this any
            // I need to figure out a way to remove this any. Because the type of each element in codes is
            //      a ResponseCode, not a number, and localStatus is a number, TS assumes that this can't be possible,
            //      when in fact it is
            if (ApiResponse.codes.indexOf(localStatus) == -1) {
                throw `Unhandle status code: ${localStatus}`;
            }
            // TODO: AHHHH, it's an any!
            // I need to find a better way to do this. Because the type of data is not known, Typescript rightly
            //      assumes that code could be 204 and data is a string, which doesn't meet the requirements of a
            //      ResponseContent. Maybe use a switch on localStatus?
            this.resolve({ code: localStatus, data: localData });
        });
    }
    isResolved() { return this._resolved; }
    /**
     * Statically resolve an ApiResponse, similar to how Promise.resolve works. This is useful when creating
     *      an ApiResponse from data that already exists
     *
     * @param status    Status code to resolve the response with
     * @param data      Data to resolve the response with
     *
     * @returns An ApiResponse that has been resolved with the parameters passed
     */
    static resolve(content) {
        const response = new ApiResponse(null, null);
        response.resolve(content);
        return response;
    }
    /**
     * Resolve ApiResponse with specific data, calling the callback setup and setting it as resolved
     *
     * @param status    Status code the response will be resolved with
     * @param data      Data the response will be resolved with
     */
    resolve(content) {
        if (this._resolved == true) {
            throw `This response has already been resolved`;
        }
        this.status = content.code;
        this.data = content.data;
        let callbacks = this._callbacks.get(this.status) || [];
        for (const callback of callbacks) {
            callback(content.data);
        }
        this._resolved = true;
    }
    /**
     * Resolving with an Ok is done a lot, this just saves some typing
     *
     * @param data Data to resolve this response with
     */
    resolveOk(data) {
        this.resolve({ code: 200, data: data });
    }
    /**
     * Forward the resolution of a response to a different ApiResponse. If a callback for the status code has already
     *      been set, an error will be thrown
     *
     * @param code      Status code that will be forwarded to response
     * @param response  ApiResponse that will be resolved instead of this ApiResponse
     *
     * @returns The F-bounded polymorphic this
     */
    forward(code, response) {
        if (this._callbacks.has(code)) {
            throw `Cannot forward ${code}, a callback has already been set`;
        }
        this.addCallback(code, (data) => {
            // This any cast is safe, there is no way that an ApiResponse can be resolved with the wrong type thanks to TS
            response.resolve({ code: code, data: data });
        });
        return this;
    }
    /**
     * Forward all callbacks that haven't been set to a different response
     *
     * @param response ApiResponse to forward all callbacks to
     */
    forwardUnset(response) {
        for (const code of ApiResponse.codes) {
            if (!this._callbacks.has(code)) {
                this.forward(code, response);
            }
        }
    }
    /**
     * Often, resources from API calls are wrapped with the Loading wrapper class, so this is just a helper method to
     *      add all the possible ways this ApiResponse can resolve to the Loading resource. Any status code that already
     *      has a callback set will not be linked
     *
     * @param loading Resource wrapped in a Loading wrapper that will update when this ApiResponse has resolved
     */
    linkLoading(loading) {
        // Why isn't the wrapper method in Loadable used instead of manipulating the Loading directly?
        //      Setting loading to a new object allocates a new object, changing the reference and actually
        //      causing a memory leak to occur. By setting the properties directly instead, the reference stays the same,
        //      and any other objects that reference loading will still update properly (such as Vue watchers)
        if (!this._callbacks.has(200)) {
            this.ok((data) => {
                loading.state = "loaded";
                loading.data = data;
            });
        }
        if (!this._callbacks.has(201)) {
            this.created((data) => {
                loading.state = "loaded";
                loading.data = data;
            });
        }
        if (!this._callbacks.has(204)) {
            this.noContent(() => {
                loading.state = "nocontent";
                loading.data = null;
            });
        }
        if (!this._callbacks.has(400)) {
            this.badRequest((err) => {
                loading.state = "error";
                loading.message = `Bad request: ${err}`;
            });
        }
        if (!this._callbacks.has(403)) {
            this.forbidden((err) => {
                loading.state = "error";
                loading.message = `Forbidden: ${err}`;
            });
        }
        if (!this._callbacks.has(404)) {
            this.notFound((err) => {
                loading.state = "error";
                loading.message = `Not found: ${err}`;
            });
        }
        if (!this._callbacks.has(500)) {
            this.internalError((err) => {
                loading.state = "error";
                loading.message = `Internal error: ${err}`;
            });
        }
    }
    /**
     * Remove all callbacks for resolution. Useful for when an ApiResponse is cached
     */
    resetCallbacks() {
        this._callbacks.clear();
        return this;
    }
    /**
     * Add a new callback when the API request has resolved
     *
     * @param status    Status code to call parameter func for
     * @param func      Callback to execut when the API request has resolved
     */
    addCallback(status, func) {
        if (!this._callbacks.has(status)) {
            this._callbacks.set(status, []);
        }
        this._callbacks.get(status).push(func); // TS doesn't see the .set() above making this not undefined
    }
    /**
     * Add a new callback that is always executed
     *
     * @param func Callback to call
     *
     * @returns The F-bounded polymorphic this
     */
    always(func) {
        if (this._resolved == true) {
            func();
        }
        for (const code of ApiResponse.codes) {
            this.addCallback(code, func);
        }
        return this;
    }
    /**
     * Add a new callback when the API request resolves with a 200 OK
     *
     * @param func Callback to call. Will take in the the parameter passed
     *
     * @returns The F-bounded polymorphic this
     */
    ok(func) {
        if (this._resolved == true && this.status == 200) {
            func(this.data);
        }
        this.addCallback(200, func);
        return this;
    }
    /**
     * Add a new callback when the API request resolves with a 201 created
     *
     * @param func Callback to call. Will take in the ID returned from the API endpoint
     *
     * @returns The F-bounded polymorphic this
     */
    created(func) {
        if (this._resolved == true && this.status == 201) {
            func(this.data);
        }
        this.addCallback(201, func);
        return this;
    }
    /**
     * Add a new callback when the API request resolves with a 204 No content
     *
     * @param func Callback to call. Takes in no parameters
     *
     * @returns The F-bounded polymorphic this
     */
    noContent(func) {
        if (this._resolved == true && this.status == 204) {
            func();
        }
        this.addCallback(204, func);
        return this;
    }
    /**
     * Add a new callback when the API request resolves with a 400 Bad request
     *
     * @param func Callback to call. Takes in a string representing the bad request's error
     *
     * @returns The F-bounded polymorphic this
     */
    badRequest(func) {
        if (this._resolved == true && this.status == 400) {
            func(this.data);
        }
        this.addCallback(400, func);
        return this;
    }
    /**
     * Add a new callback when the API request resolves with a 403 Forbidden
     *
     * @param func Callback to call. Takes in a string respresenting the string returned from the API
     *
     * @returns The F-bounded polymorphic this
     */
    forbidden(func) {
        if (this._resolved == true && this.status == 403) {
            func(this.data);
        }
        this.addCallback(403, func);
        return this;
    }
    /**
     * Add a new callback when the API request resolves with a 404 Not found. Different from noContent,
     * as noContent is usually when a GET request does not find the object, where notFound is returned
     * during validation errors (typically validation object IDs not found)
     *
     * @param func Callback to call. Takes in the resource ID that was not found
     *
     * @returns The F-bounded polymorphic this
     */
    notFound(func) {
        if (this._resolved == true && this.status == 404) {
            func(this.data);
        }
        this.addCallback(404, func);
        return this;
    }
    /**
     * Add a new callback when the API request resolves with a 500 Internal server error
     *
     * @param func Callback to call. Takes in the error returned from the server
     *
     * @returns The F-bounded polymorphic this
     */
    internalError(func) {
        if (this._resolved == true && this.status == 500) {
            func(this.data);
        }
        this.addCallback(500, func);
        return this;
    }
}
/**
 * Array of possible status codes from a request
 */
ApiResponse.codes = [200, 201, 204, 400, 401, 403, 404, 413, 500, 501];
window.ApiResponse = ApiResponse;
/**
 * Abstract wrapper class used by API wrappers
 */
class APIWrapper {
    /**
     * Read an array of objects from the endpoint into an array of the wrapped object
     *
     * @param elem An array of elements from an API endpoint
     *
     * @returns An array of type T
     */
    readList(elem) {
        let result = [];
        if (Array.isArray(elem)) {
            elem.forEach((item) => {
                result.push(this.readEntry(item));
            });
        }
        return result;
    }
    /**
     * Get an array of data from an API endpoint
     *
     * @param url   URL the API endpoint is located at
     * @param data  Optional data to pass to the API endpoint
     *
     * @returns The ApiResponse that is being performed. Add callbacks using .ok(), etc.
     */
    get(url, data) {
        if (data != undefined) {
            for (const name in data) {
                const val = data[name];
                // Convert dates into ISO strings, which is what c# uses for DateTime binding
                if (val instanceof Date) {
                    data[name] = val.toISOString();
                }
            }
        }
        const promise = !(function webpackMissingModule() { var e = new Error("Cannot find module 'jquery'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
            url: url,
            data: data
        });
        // Bind this to ensure that .readEntry by binding the inherited class instead of
        // the base class APIWrapper
        let result = new ApiResponse(promise, this.readList.bind(this));
        return result;
    }
    /**
     * Read a single entry from the API endpoint. If multiple entries are returned, only the first
     * entry will be returned. A 404 does not return null, instead it will throw. For a null to
     * be returned, the response must reply 204NoContent
     *
     * @param url   URL the API endpoint is located at
     * @param data  Optional data to pass to the API endpoint
     *
     * @returns The ApiResponse that is being performed. Add callbacks using .ok(), etc.
     */
    single(url, data) {
        const promise = !(function webpackMissingModule() { var e = new Error("Cannot find module 'jquery'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
            url: url,
            data: data
        });
        let result = new ApiResponse(promise, this.readEntry);
        return result;
    }
    /**
     * Perform a post request. Typically used for inserting new data, or other operations that are
     * not idempotent
     *
     * @param url   URL to perform the post request on
     * @param data  Data to be passed when performing the post request. This data is JSONified before sent
     *
     * @returns The ApiResponse that is being performed. Add callbacks using .ok(), etc.
     */
    post(url, data) {
        const promise = !(function webpackMissingModule() { var e = new Error("Cannot find module 'jquery'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
            url: `${url}`,
            contentType: "application/json",
            data: JSON.stringify(data)
        });
        let result = new ApiResponse(promise, null);
        return result;
    }
    /**
     * Post a message which expects a reply from the API
     *
     * @param url   URL to perform the POST request on
     * @param data  Data to be passed to the POST request. this data is JSONified before being sent in the body
     *
     * @returns The ApiResponse that is being performed. Add callbacks using .ok(), etc.
     */
    postReply(url, data) {
        const promise = !(function webpackMissingModule() { var e = new Error("Cannot find module 'jquery'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
            url: `${url}`,
            contentType: "application/json",
            data: JSON.stringify(data)
        });
        let result = new ApiResponse(promise, null);
        return result;
    }
    /**
     * Perform a PUT request. Operations perform with this method should be idempotent, which means this request
     * can be repeated as many times as the client needs to (if say the network is botched and the client isn't
     * sure if the request was successfully completed). This means it is not appropriate for creating objects
     * (which is why creating is done through POSTing), but could also not be appropriate for updating certain
     * objects
     *
     * @param url   URL to PUT to
     * @param data  Option data to be passed when performing the PUT request
     *
     * @returns The ApiResponse that is being performed. Add callbacks using .ok(), etc.
     */
    put(url, data) {
        const promise = !(function webpackMissingModule() { var e = new Error("Cannot find module 'jquery'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
            url: `${url}`,
            contentType: "application/json",
            data: JSON.stringify(data),
            type: "PUT"
        });
        let result = new ApiResponse(promise, null);
        return result;
    }
    /**
     * Perform a DELETE request. Typically DELETE endpoints just take in a single value, which is the
     * ID of the resource to delete
     *
     * @param url   URL to DELETE to
     * @param data  Data to pass to the API endpoint. This data will be JSONified in the body when passed
     *
     * @returns The ApiResponse that is being performed. Add callbacks using .ok(), etc.
     */
    delete(url, data) {
        const promise = !(function webpackMissingModule() { var e = new Error("Cannot find module 'jquery'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
            url: `${url}`,
            contentType: "application/json",
            data: JSON.stringify(data),
            type: "DELETE"
        });
        let result = new ApiResponse(promise, null);
        return result;
    }
}
/* harmony default export */ __webpack_exports__["default"] = (APIWrapper);


/***/ }),

/***/ "../census/CensusAPI.ts":
/*!******************************!*\
  !*** ../census/CensusAPI.ts ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CensusAPI; });
/* harmony import */ var _ApiWrapper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ApiWrapper */ "../census/ApiWrapper.ts");
!(function webpackMissingModule() { var e = new Error("Cannot find module 'jquery'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());


class CensusAPI {
    static baseUrl() {
        return `https://census.daybreakgames.com/s:${CensusAPI.serviceID}/get/ps2:v2`;
    }
    static init(serviceID) {
        CensusAPI.serviceID = serviceID;
    }
    static getType(url, reader) {
        if (url.charAt(0) != "/") {
            url = `/${url}`;
        }
        if (CensusAPI.serviceID.length == 0) {
            throw `serviceID not given`;
        }
        return new _ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"](!(function webpackMissingModule() { var e = new Error("Cannot find module 'jquery'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(`https://census.daybreakgames.com/s:${CensusAPI.serviceID}/get/ps2:v2${url}`), reader);
    }
    static get(url) {
        if (url.charAt(0) != "/") {
            url = `/${url}`;
        }
        if (CensusAPI.serviceID.length == 0) {
            throw `serviceID not given`;
        }
        return new _ApiWrapper__WEBPACK_IMPORTED_MODULE_0__["ApiResponse"](!(function webpackMissingModule() { var e = new Error("Cannot find module 'jquery'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(`https://census.daybreakgames.com/s:${CensusAPI.serviceID}/get/ps2:v2${url}`), ((elem) => elem));
    }
}
CensusAPI.serviceID = "";
CensusAPI.requestCount = 0;
window.CensusAPI = CensusAPI;


/***/ }),

/***/ "../census/CharacterAPI.ts":
/*!*********************************!*\
  !*** ../census/CharacterAPI.ts ***!
  \*********************************/
/*! exports provided: Character, CharacterAPI */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Character", function() { return Character; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CharacterAPI", function() { return CharacterAPI; });
/* harmony import */ var _CensusAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CensusAPI */ "../census/CensusAPI.ts");
/* harmony import */ var _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ApiWrapper */ "../census/ApiWrapper.ts");


class Character {
    constructor() {
        this.ID = "";
        this.name = "";
        this.faction = "";
        this.outfitID = "";
        this.outfitTag = "";
        this.outfitName = "";
        this.online = false;
        this.joinTime = 0;
        this.secondsPlayed = 0;
    }
}
class CharacterAPI {
    static parseCharacter(elem) {
        const char = {
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
        CharacterAPI._cache.set(char.ID, char);
        return char;
    }
    static getByID(charID) {
        if (CharacterAPI._pending.has(charID)) {
            return CharacterAPI._pending.get(charID);
        }
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        CharacterAPI._pending.set(charID, response);
        if (CharacterAPI._cache.has(charID)) {
            response.resolveOk(CharacterAPI._cache.get(charID));
        }
        else {
            const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/character/?character_id=${charID}&c:resolve=outfit,online_status`);
            request.ok((data) => {
                if (data.returned != 1) {
                    response.resolve({ code: 404, data: `No or multiple characters returned from ${name}` });
                }
                else {
                    response.resolveOk(CharacterAPI.parseCharacter(data.character_list[0]));
                }
            }).always(() => {
                CharacterAPI._pending.delete(charID);
            });
        }
        return response;
    }
    static cache(charID) {
        if (CharacterAPI._cache.has(charID)) {
            return;
        }
        clearTimeout(CharacterAPI._pendingResolveID);
        CharacterAPI._pendingIDs.push(charID);
        if (CharacterAPI._pendingIDs.length > 9) {
            CharacterAPI.getByIDs(CharacterAPI._pendingIDs).ok(() => { });
            CharacterAPI._pendingIDs = [];
        }
        else {
            CharacterAPI._pendingResolveID = setTimeout(() => {
                CharacterAPI.getByIDs(CharacterAPI._pendingIDs).ok(() => { });
            }, 5000);
        }
    }
    static getByIDs(charIDs) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        if (charIDs.length == 0) {
            response.resolveOk([]);
            return response;
        }
        const chars = [];
        const requestIDs = [];
        for (const charID of charIDs) {
            if (CharacterAPI._cache.has(charID)) {
                const char = CharacterAPI._cache.get(charID);
                chars.push(char);
            }
            else {
                requestIDs.push(charID);
            }
        }
        if (requestIDs.length > 0) {
            const sliceSize = 50;
            let slicesLeft = Math.ceil(requestIDs.length / sliceSize);
            //console.log(`Have ${slicesLeft} slices to do. size of ${sliceSize}, data of ${requestIDs.length}`);
            for (let i = 0; i < requestIDs.length; i += sliceSize) {
                const slice = requestIDs.slice(i, i + sliceSize);
                //console.log(`Slice ${i}: ${i} - ${i + sliceSize - 1}: [${slice.join(",")}]`);
                const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/character/?character_id=${slice.join(",")}&c:resolve=outfit,online_status`);
                request.ok((data) => {
                    if (data.returned == 0) {
                        if (chars.length == 0) {
                            response.resolve({ code: 404, data: `Missing characters: ${charIDs.join(",")}` });
                        }
                        else {
                            response.resolveOk(chars);
                        }
                    }
                    else {
                        for (const datum of data.character_list) {
                            const char = CharacterAPI.parseCharacter(datum);
                            chars.push(char);
                        }
                    }
                    --slicesLeft;
                    if (slicesLeft == 0) {
                        //console.log(`No more slices left, resolving`);
                        response.resolveOk(chars);
                    }
                    else {
                        //console.log(`${slicesLeft} slices left`);
                    }
                });
            }
        }
        else {
            response.resolveOk(chars);
        }
        return response;
    }
    static getByName(name) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/character/?name.first_lower=${name.toLowerCase()}&c:resolve=outfit,online_status`);
        request.ok((data) => {
            if (data.returned != 1) {
                response.resolve({ code: 404, data: `No or multiple characters returned from ${name}` });
            }
            else {
                response.resolveOk(CharacterAPI.parseCharacter(data.character_list[0]));
            }
        });
        return response;
    }
}
CharacterAPI._cache = new Map();
CharacterAPI._pending = new Map();
CharacterAPI._pendingIDs = [];
CharacterAPI._pendingResolveID = 0;
window.CharacterAPI = CharacterAPI;


/***/ }),

/***/ "../census/EventAPI.ts":
/*!*****************************!*\
  !*** ../census/EventAPI.ts ***!
  \*****************************/
/*! exports provided: EventAPI */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventAPI", function() { return EventAPI; });
/* harmony import */ var _CensusAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CensusAPI */ "../census/CensusAPI.ts");
/* harmony import */ var _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ApiWrapper */ "../census/ApiWrapper.ts");


class EventAPI {
    static parseEvent(elem) {
        throw ``;
    }
    static parseEventKill(elem) {
        return {
            type: "kill",
            isHeadshot: elem.is_headshot == "1",
            loadoutID: elem.attacker_loadout_id,
            sourceID: elem.attacker_character_id,
            targetID: elem.character_id,
            targetLoadoutID: elem.character_loadout_id,
            timestamp: Number.parseInt(elem.timestamp) * 1000,
            weaponID: elem.attacker_weapon_id,
            zoneID: elem.zone_id
        };
    }
    static parseEventDeath(elem) {
        return {
            type: "death",
            isHeadshot: elem.is_headshot == "1",
            loadoutID: elem.character_loadout_id,
            sourceID: elem.character_id,
            targetID: elem.attacker_character_id,
            targetLoadoutID: elem.attacker_loadout_id,
            timestamp: Number.parseInt(elem.timestamp) * 1000,
            weaponID: elem.attacker_weapon_id,
            revived: false,
            revivedEvent: null,
            zoneID: elem.zone_id
        };
    }
    static getKills(charID, startMs, endMs) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        startMs = Math.round((startMs / 1000)) - 1;
        endMs = Math.round((endMs / 1000)) + 1;
        if (startMs >= endMs) {
            response.resolve({ code: 400, data: `Start must come before end` });
        }
        else {
            const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/characters_event/?character_id=${charID}&type=KILL&after=${startMs}&before=${endMs}`);
            request.ok((data) => {
                const events = [];
                for (const datum of data.characters_event_list) {
                    events.push(EventAPI.parseEventKill(datum));
                }
                response.resolveOk(events);
            });
        }
        return response;
    }
    static getMultiDeaths(ids, startMs, endMs) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        startMs = (startMs / 1000) - 1;
        endMs = (endMs / 1000) + 1;
        const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/characters_event/?character_id=${ids.join(",")}&type=DEATH&after=${startMs}&before=${endMs}&c:limit=10000`);
        request.ok((data) => {
            const events = [];
            for (const datum of data.characters_event_list) {
                events.push(EventAPI.parseEventDeath(datum));
            }
            response.resolveOk(events);
        });
        return response;
    }
    static getDeaths(charID, startMs, endMs) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        startMs = (startMs / 1000) - 1;
        endMs = (endMs / 1000) + 1;
        const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/characters_event/?character_id=${charID}&type=DEATH&after=${startMs}&before=${endMs}`);
        request.ok((data) => {
            const events = [];
            for (const datum of data.characters_event_list) {
                events.push(EventAPI.parseEventDeath(datum));
            }
            response.resolveOk(events);
        });
        return response;
    }
}
window.EventAPI = EventAPI;


/***/ }),

/***/ "../census/FacilityAPI.ts":
/*!********************************!*\
  !*** ../census/FacilityAPI.ts ***!
  \********************************/
/*! exports provided: Facility, FacilityAPI */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Facility", function() { return Facility; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FacilityAPI", function() { return FacilityAPI; });
/* harmony import */ var _CensusAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CensusAPI */ "../census/CensusAPI.ts");
/* harmony import */ var _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ApiWrapper */ "../census/ApiWrapper.ts");
!(function webpackMissingModule() { var e = new Error("Cannot find module 'jquery'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());



class Facility {
    constructor() {
        this.ID = "";
        this.zoneID = "";
        this.name = "";
        this.typeID = "";
        this.type = "";
    }
}
class FacilityAPI {
    static parse(elem) {
        return {
            ID: elem.facility_id,
            zoneID: elem.zone_id,
            name: elem.facility_name,
            typeID: elem.facility_type_id,
            type: elem.facility_type
        };
    }
    static loadJson() {
        new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"](!(function webpackMissingModule() { var e = new Error("Cannot find module 'jquery'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("/bases.json"), ((data) => {
            const bs = Array.isArray(data) ? data : JSON.parse(data);
            for (const datum of bs) {
                const wep = FacilityAPI.parse(datum);
                this._cache.set(wep.ID, wep);
            }
        }));
    }
    static precache(facilityID) {
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
    static getByID(facilityID) {
        if (FacilityAPI._pending.has(facilityID)) {
            console.log(`${facilityID} already has a pending request, using that one instead`);
            return FacilityAPI._pending.get(facilityID);
        }
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        if (FacilityAPI._cache.has(facilityID)) {
            response.resolveOk(FacilityAPI._cache.get(facilityID));
        }
        else {
            const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/map_region?facility_id=${facilityID}`);
            FacilityAPI._pending.set(facilityID, request);
            request.ok((data) => {
                if (data.returned == 0) {
                    FacilityAPI._cache.set(facilityID, null);
                    response.resolve({ code: 204, data: null });
                }
                else {
                    const facility = FacilityAPI.parse(data.map_region_list[0]);
                    FacilityAPI._cache.set(facility.ID, facility);
                    response.resolveOk(facility);
                }
                FacilityAPI._pending.delete(facilityID);
            });
        }
        return response;
    }
    static getByIDs(IDs) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        const facilities = [];
        const requestIDs = [];
        for (const facID of IDs) {
            if (FacilityAPI._cache.has(facID)) {
                const fac = FacilityAPI._cache.get(facID);
                if (fac != null) {
                    facilities.push(fac);
                }
            }
            else {
                requestIDs.push(facID);
            }
        }
        if (requestIDs.length > 0) {
            const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/map_region?facility_id=${requestIDs.join(",")}`);
            request.ok((data) => {
                if (data.returned == 0) {
                    if (facilities.length == 0) {
                        response.resolve({ code: 404, data: `No facilities returned from ${name}` });
                    }
                    else {
                        response.resolveOk(facilities);
                    }
                }
                else {
                    const bases = [];
                    for (const datum of data.map_region_list) {
                        const fac = FacilityAPI.parse(datum);
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
            }).internalError((err) => {
                for (const wepID of requestIDs) {
                    FacilityAPI._cache.set(wepID, null);
                }
                if (facilities.length > 0) {
                    response.resolveOk(facilities);
                }
                else {
                    response.resolve({ code: 500, data: "" });
                }
                console.error(err);
            });
        }
        else {
            response.resolveOk(facilities);
        }
        return response;
    }
}
FacilityAPI._cache = new Map();
FacilityAPI._pending = new Map();
FacilityAPI._idList = [];
FacilityAPI._timeoutID = -1;
window.FacilityAPI = FacilityAPI;


/***/ }),

/***/ "../census/OutfitAPI.ts":
/*!******************************!*\
  !*** ../census/OutfitAPI.ts ***!
  \******************************/
/*! exports provided: Outfit, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Outfit", function() { return Outfit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return OutfitAPI; });
/* harmony import */ var _CensusAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CensusAPI */ "../census/CensusAPI.ts");
/* harmony import */ var _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ApiWrapper */ "../census/ApiWrapper.ts");
/* harmony import */ var _CharacterAPI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CharacterAPI */ "../census/CharacterAPI.ts");



class Outfit {
    constructor() {
        this.ID = "";
        this.name = "";
        this.tag = "";
        this.faction = "";
    }
}
class OutfitAPI {
    static parse(elem) {
        var _a, _b;
        return {
            ID: elem.outfit_id,
            name: elem.name,
            tag: elem.alias,
            faction: (_b = (_a = elem.leader) === null || _a === void 0 ? void 0 : _a.faction_id, (_b !== null && _b !== void 0 ? _b : "-1"))
        };
    }
    static getByID(ID) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/outfit/?outfit_id=${ID}&c:resolve=leader`);
        request.ok((data) => {
            if (data.returned != 1) {
                response.resolve({ code: 404, data: `` });
            }
            else {
                const outfit = OutfitAPI.parse(data.outfit_list[0]);
                response.resolveOk(outfit);
            }
        });
        return response;
    }
    static getByIDs(IDs) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        if (IDs.length == 0) {
            response.resolve({ code: 204, data: null });
            return response;
        }
        IDs = IDs.filter(i => i.length > 0 && i != "0");
        const outfits = [];
        const sliceSize = 50;
        let slicesLeft = Math.ceil(IDs.length / sliceSize);
        console.log(`Have ${slicesLeft} slices to do. size of ${sliceSize}, data of ${IDs.length}`);
        for (let i = 0; i < IDs.length; i += sliceSize) {
            const slice = IDs.slice(i, i + sliceSize);
            const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/outfit/?outfit_id=${slice.join(",")}&c:resolve=leader`);
            request.ok((data) => {
                if (data.returned == 0) {
                }
                else {
                    for (const datum of data.outfit_list) {
                        const char = OutfitAPI.parse(datum);
                        outfits.push(char);
                    }
                }
                --slicesLeft;
                if (slicesLeft == 0) {
                    console.log(`No more slices left, resolving`);
                    response.resolveOk(outfits);
                }
                else {
                    console.log(`${slicesLeft} slices left`);
                }
            });
        }
        return response;
    }
    /*
    
        const outfits: Outfit[] = [];

        const sliceSize: number = 20;
        let slicesLeft: number = Math.ceil(IDs.length / sliceSize);
        console.log(`Have ${slicesLeft} slices to do. size of ${sliceSize}, data of ${IDs.length}`);

        for (let i = 0; i < IDs.length; i += sliceSize) {
            const slice: string[] = IDs.slice(i, i + sliceSize);

            const request: ApiResponse<any> = CensusAPI.get(`/outfit/?outfit_id=${slice.join(",")}&c:resolve=leader`);

            request.ok((data: any) => {
                if (data.returned == 0) {
                } else {
                    for (const datum of data.character_list) {
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

    */
    static getByTag(outfitTag) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/outfit/?alias_lower=${outfitTag.toLocaleLowerCase()}&c:resolve=leader`);
        request.ok((data) => {
            if (data.returned != 1) {
                response.resolve({ code: 404, data: `` });
            }
            else {
                const outfit = OutfitAPI.parse(data.outfit_list[0]);
                response.resolveOk(outfit);
            }
        });
        return response;
    }
    static getCharactersByTag(outfitTag) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/outfit/?alias_lower=${outfitTag.toLowerCase()}&c:resolve=member_character,member_online_status`);
        request.ok((data) => {
            if (data.returned != 1) {
                response.resolve({ code: 404, data: `${outfitTag} did not return 1 entry` });
            }
            else {
                // With really big outfits (3k+ members) somehow a character that doesn't exist
                //      shows up in the query. They don't have a name, so filter them out
                const chars = data.outfit_list[0].members
                    .filter((elem) => elem.name != undefined)
                    .map((elem) => {
                    return _CharacterAPI__WEBPACK_IMPORTED_MODULE_2__["CharacterAPI"].parseCharacter(Object.assign({ outfit: {
                            alias: data.outfit_list[0].alias
                        } }, elem));
                });
                response.resolveOk(chars);
            }
        });
        return response;
    }
}
window.OutfitAPI = OutfitAPI;


/***/ }),

/***/ "../census/PsLoadout.ts":
/*!******************************!*\
  !*** ../census/PsLoadout.ts ***!
  \******************************/
/*! exports provided: PsLoadout, PsLoadouts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PsLoadout", function() { return PsLoadout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PsLoadouts", function() { return PsLoadouts; });
class PsLoadout {
    constructor() {
        this.ID = 0;
        this.faction = "";
        this.longName = "";
        this.shortName = "";
        this.singleName = "";
        this.type = "unknown";
    }
}
PsLoadout.default = {
    ID: -1,
    faction: "DD",
    longName: "Default",
    shortName: "Def",
    singleName: "D",
    type: "unknown"
};
const PsLoadouts = new Map([
    ["1", {
            ID: 1,
            faction: "NC",
            longName: "Infiltrator",
            shortName: "Infil",
            singleName: "I",
            type: "infil"
        }],
    ["3", {
            ID: 3,
            faction: "NC",
            longName: "Light Assault",
            shortName: "LA",
            singleName: "L",
            type: "lightAssault"
        }],
    ["4", {
            ID: 4,
            faction: "NC",
            longName: "Medic",
            shortName: "Medic",
            singleName: "M",
            type: "medic"
        }],
    ["5", {
            ID: 5,
            faction: "NC",
            longName: "Engineer",
            shortName: "Eng",
            singleName: "E",
            type: "engineer"
        }],
    ["6", {
            ID: 5,
            faction: "NC",
            longName: "Heavy Assault",
            shortName: "HA",
            singleName: "H",
            type: "heavy"
        }],
    ["7", {
            ID: 7,
            faction: "NC",
            longName: "Max",
            shortName: "Max",
            singleName: "W",
            type: "max"
        }],
    ["8", {
            ID: 8,
            faction: "TR",
            longName: "Infiltrator",
            shortName: "Infil",
            singleName: "I",
            type: "infil"
        }],
    ["10", {
            ID: 10,
            faction: "TR",
            longName: "Light Assault",
            shortName: "LA",
            singleName: "L",
            type: "lightAssault"
        }],
    ["11", {
            ID: 11,
            faction: "TR",
            longName: "Medic",
            shortName: "Medic",
            singleName: "M",
            type: "medic"
        }],
    ["12", {
            ID: 12,
            faction: "TR",
            longName: "Engineer",
            shortName: "Eng",
            singleName: "E",
            type: "engineer"
        }],
    ["13", {
            ID: 13,
            faction: "TR",
            longName: "Heavy Assault",
            shortName: "HA",
            singleName: "H",
            type: "heavy"
        }],
    ["14", {
            ID: 14,
            faction: "TR",
            longName: "Max",
            shortName: "Max",
            singleName: "W",
            type: "max"
        }],
    ["15", {
            ID: 15,
            faction: "VS",
            longName: "Infiltrator",
            shortName: "Infil",
            singleName: "I",
            type: "infil"
        }],
    ["17", {
            ID: 17,
            faction: "VS",
            longName: "Light Assault",
            shortName: "LA",
            singleName: "L",
            type: "lightAssault"
        }],
    ["18", {
            ID: 18,
            faction: "VS",
            longName: "Medic",
            shortName: "Medic",
            singleName: "M",
            type: "medic"
        }],
    ["19", {
            ID: 19,
            faction: "VS",
            longName: "Engineer",
            shortName: "Eng",
            singleName: "E",
            type: "engineer"
        }],
    ["20", {
            ID: 20,
            faction: "VS",
            longName: "Heavy Assault",
            shortName: "HA",
            singleName: "H",
            type: "heavy"
        }],
    ["21", {
            ID: 21,
            faction: "VS",
            longName: "Max",
            shortName: "Max",
            singleName: "W",
            type: "max"
        }],
    ["28", {
            ID: 28,
            faction: "NS",
            longName: "Infiltrator",
            shortName: "Infil",
            singleName: "I",
            type: "infil"
        }],
    ["29", {
            ID: 29,
            faction: "NS",
            longName: "Light Assault",
            shortName: "LA",
            singleName: "L",
            type: "lightAssault"
        }],
    ["30", {
            ID: 30,
            faction: "NS",
            longName: "Medic",
            shortName: "medic",
            singleName: "M",
            type: "medic"
        }],
    ["31", {
            ID: 31,
            faction: "NS",
            longName: "Engineer",
            shortName: "eng",
            singleName: "E",
            type: "engineer"
        }],
    ["32", {
            ID: 32,
            faction: "NS",
            longName: "Heavy Assault",
            shortName: "heavy",
            singleName: "H",
            type: "heavy"
        }],
    ["45", {
            ID: 45,
            faction: "NS",
            longName: "MAX",
            shortName: "max",
            singleName: "W",
            type: "max"
        }],
]);


/***/ }),

/***/ "../census/VehicleAPI.ts":
/*!*******************************!*\
  !*** ../census/VehicleAPI.ts ***!
  \*******************************/
/*! exports provided: Vehicle, VehicleTypes, Vehicles, VehicleAPI */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Vehicle", function() { return Vehicle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VehicleTypes", function() { return VehicleTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Vehicles", function() { return Vehicles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VehicleAPI", function() { return VehicleAPI; });
/* harmony import */ var _CensusAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CensusAPI */ "../census/CensusAPI.ts");
/* harmony import */ var _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ApiWrapper */ "../census/ApiWrapper.ts");


class Vehicle {
    constructor() {
        this.ID = "";
        this.name = "";
        this.typeID = "";
    }
}
class VehicleTypes {
}
VehicleTypes.tracked = ["2033", "2010", "15", "14", "13", "12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1"];
VehicleTypes.ground = "5";
VehicleTypes.magrider = "2";
VehicleTypes.turret = "7";
VehicleTypes.air = "1";
VehicleTypes.spawn = "8";
class Vehicles {
}
Vehicles.flash = "1";
Vehicles.sunderer = "2";
Vehicles.lightning = "3";
Vehicles.magrider = "4";
Vehicles.vanguard = "5";
Vehicles.prowler = "6";
Vehicles.scythe = "7";
Vehicles.reaver = "8";
Vehicles.mosquito = "9";
Vehicles.liberator = "10";
Vehicles.galaxy = "11";
Vehicles.harasser = "12";
Vehicles.dropPod = "13";
Vehicles.valkyrie = "14";
Vehicles.ant = "15";
Vehicles.bastionMosquite = "2122";
Vehicles.bastionReaver = "2123";
Vehicles.bastionScythe = "2124";
class VehicleAPI {
    static parse(elem) {
        return {
            ID: elem.vehicle_id,
            typeID: elem.type_id,
            name: elem.name.en,
        };
    }
    static getByID(vehicleID) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        VehicleAPI.getAll().ok((data) => {
            let found = false;
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
    static getAll(ids = []) {
        if (VehicleAPI._cache == null) {
            VehicleAPI._cache = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
            const vehicles = [];
            const response = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`vehicle?c:limit=100`);
            response.ok((data) => {
                for (const datum of data.vehicle_list) {
                    vehicles.push(VehicleAPI.parse(datum));
                }
                VehicleAPI._cache.resolveOk(vehicles);
                console.log(`Cached ${vehicles.length} vehicles: [${vehicles.map(iter => iter.name).join(",")}]`);
            });
        }
        return VehicleAPI._cache;
    }
}
VehicleAPI._cache = null;
window.VehicleAPI = VehicleAPI;


/***/ }),

/***/ "../census/WeaponAPI.ts":
/*!******************************!*\
  !*** ../census/WeaponAPI.ts ***!
  \******************************/
/*! exports provided: Weapon, WeaponAPI */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Weapon", function() { return Weapon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WeaponAPI", function() { return WeaponAPI; });
/* harmony import */ var _CensusAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CensusAPI */ "../census/CensusAPI.ts");
/* harmony import */ var _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ApiWrapper */ "../census/ApiWrapper.ts");
!(function webpackMissingModule() { var e = new Error("Cannot find module 'jquery'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());



class Weapon {
    constructor() {
        this.ID = "";
        this.name = "";
        this.type = "";
    }
}
class WeaponAPI {
    static maxTypeFixer(name) {
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
    static parseCharacter(elem) {
        var _a, _b, _c, _d;
        return {
            ID: elem.item_id,
            name: (_b = (_a = elem.name) === null || _a === void 0 ? void 0 : _a.en, (_b !== null && _b !== void 0 ? _b : `Unnamed ${elem.item_id}`)),
            type: this.maxTypeFixer((_d = (_c = elem.category) === null || _c === void 0 ? void 0 : _c.name.en, (_d !== null && _d !== void 0 ? _d : "Unknown")))
        };
    }
    static loadJson() {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"](!(function webpackMissingModule() { var e = new Error("Cannot find module 'jquery'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("/weapons.json"), ((data) => {
            const weapons = Array.isArray(data) ? data : JSON.parse(data);
            for (const datum of weapons) {
                const wep = WeaponAPI.parseCharacter(datum);
                this._cache.set(wep.ID, wep);
            }
        }));
    }
    static precache(weaponID) {
        clearTimeout(this._pendingTimerID);
        if (this._pendingCaches.indexOf(weaponID) == -1) {
            this._pendingCaches.push(weaponID);
        }
        this._pendingTimerID = setTimeout(() => {
            this.getByIDs(this._pendingCaches);
        }, 100);
    }
    static getByID(weaponID) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        if (WeaponAPI._cache.has(weaponID)) {
            response.resolveOk(WeaponAPI._cache.get(weaponID));
        }
        else {
            const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`item?item_id=${weaponID}&c:hide=description,max_stack_size,image_set_id,image_id,image_path&c:lang=en&c:join=item_category^inject_at:category`);
            request.ok((data) => {
                if (data.returned != 1) {
                    response.resolve({ code: 404, data: `No or multiple weapons returned from ${name}` });
                }
                else {
                    const wep = WeaponAPI.parseCharacter(data.item_list[0]);
                    if (!WeaponAPI._cache.has(wep.ID)) {
                        WeaponAPI._cache.set(wep.ID, wep);
                    }
                    response.resolveOk(wep);
                }
            }).internalError((err) => {
                WeaponAPI._cache.set(weaponID, null);
                console.error(err);
            });
        }
        return response;
    }
    static getByIDs(weaponIDs) {
        const response = new _ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
        const weapons = [];
        const requestIDs = [];
        for (const weaponID of weaponIDs) {
            if (WeaponAPI._cache.has(weaponID)) {
                const wep = WeaponAPI._cache.get(weaponID);
                if (wep != null) {
                    weapons.push(wep);
                }
            }
            else {
                requestIDs.push(weaponID);
            }
        }
        if (requestIDs.length > 0) {
            const request = _CensusAPI__WEBPACK_IMPORTED_MODULE_0__["default"].get(`item?item_id=${requestIDs.join(",")}&c:hide=description,max_stack_size,image_set_id,image_id,image_path&c:lang=en&c:join=item_category^inject_at:category`);
            request.ok((data) => {
                if (data.returned == 0) {
                    if (weapons.length == 0) {
                        response.resolve({ code: 404, data: `No or multiple weapons returned from ${name}` });
                    }
                    else {
                        response.resolveOk(weapons);
                    }
                }
                else {
                    for (const datum of data.item_list) {
                        const wep = WeaponAPI.parseCharacter(datum);
                        weapons.push(wep);
                        WeaponAPI._cache.set(wep.ID, wep);
                    }
                    response.resolveOk(weapons);
                }
            }).internalError((err) => {
                for (const wepID of requestIDs) {
                    WeaponAPI._cache.set(wepID, null);
                }
                if (weapons.length > 0) {
                    console.error(`API call failed, but some weapons were cached, so using that`);
                    response.resolveOk(weapons);
                }
                else {
                    response.resolve({ code: 500, data: "" });
                }
                console.error(err);
            });
        }
        else {
            response.resolveOk(weapons);
        }
        return response;
    }
}
WeaponAPI._cache = new Map([["0", null]]);
WeaponAPI._pendingCaches = [];
WeaponAPI._pendingTimerID = -1;
window.WeaponAPI = WeaponAPI;


/***/ }),

/***/ "../core/Core.ts":
/*!***********************!*\
  !*** ../core/Core.ts ***!
  \***********************/
/*! exports provided: Core */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Core", function() { return Core; });
/* harmony import */ var Loadable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Loadable */ "../Loadable.ts");
/* harmony import */ var census_CensusAPI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! census/CensusAPI */ "../census/CensusAPI.ts");
/* harmony import */ var census_OutfitAPI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! census/OutfitAPI */ "../census/OutfitAPI.ts");
/* harmony import */ var census_CharacterAPI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! census/CharacterAPI */ "../census/CharacterAPI.ts");
/* harmony import */ var InvididualGenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! InvididualGenerator */ "../InvididualGenerator.ts");





class Core {
    constructor(serviceID) {
        this.sockets = {
            tracked: null,
            logistics: null,
            logins: null,
            facility: null
        };
        this.routerTracking = {
            // key - Who placed the router
            // value - Lastest npc ID that gave them a router spawn tick
            routerNpcs: new Map(),
            routers: [] // All routers that have been placed
        };
        this.socketMessageQueue = [];
        this.stats = new Map();
        this.outfits = [];
        this.characters = [];
        this.miscEvents = [];
        this.playerCaptures = [];
        this.facilityCaptures = [];
        this.rawData = [];
        this.tracking = {
            running: false,
            startTime: new Date().getTime(),
            endTime: new Date().getTime()
        };
        this.connected = false;
        this.handlers = {
            exp: [],
            kill: [],
            death: [],
            teamkill: [],
            capture: [],
            defend: [],
            vehicle: [],
            login: [],
            logout: []
        };
        this.serviceID = serviceID;
        this.socketMessageQueue.length = 5;
        census_CensusAPI__WEBPACK_IMPORTED_MODULE_1__["default"].init(this.serviceID);
    }
    /**
     * Emit an event and execute all handlers on it
     *
     * @param event Event being emitted to all handlers
     */
    emit(event) {
        this.handlers[event.type].forEach((callback) => { callback(event); });
    }
    /**
     * Add an event handler that will occur when a specific event is created from the core
     *
     * @param type      Event to attach the handler to
     * @param handler   Handler that will be executed when that event is emitted
     */
    on(type, handler) {
        switch (type) {
            case "exp":
                this.handlers.exp.push(handler);
                break;
            case "kill":
                this.handlers.kill.push(handler);
                break;
            case "death":
                this.handlers.death.push(handler);
                break;
            case "teamkill":
                this.handlers.death.push(handler);
                break;
            case "capture":
                this.handlers.capture.push(handler);
                break;
            case "defend":
                this.handlers.defend.push(handler);
                break;
            case "vehicle":
                this.handlers.vehicle.push(handler);
                break;
            case "login":
                this.handlers.login.push(handler);
                break;
            case "logout":
                this.handlers.logout.push(handler);
                break;
            default: throw `Unchecked event type ${type}`;
        }
    }
    /**
     * Start the tracking and begin saving events
     */
    start() {
        if (this.connected == false) {
            throw `Cannot start TOPT: core is not connected`;
        }
        this.tracking.running = true;
        const nowMs = new Date().getTime();
        this.tracking.startTime = nowMs;
        this.stats.forEach((char, charID) => {
            char.joinTime = nowMs;
        });
    }
    /**
     * Stop running the tracker
     */
    stop() {
        if (this.tracking.running == true) {
            const nowMs = new Date().getTime();
            this.tracking.endTime = nowMs;
        }
        this.tracking.running = false;
        this.stats.forEach((char, charID) => {
            if (char.events.length > 0) {
                const first = char.events[0];
                const last = char.events[char.events.length - 1];
                char.joinTime = first.timestamp;
                char.secondsOnline = (last.timestamp - first.timestamp) / 1000;
            }
            else {
                char.secondsOnline = 0;
            }
        });
    }
    /**
     * Begin tracking all members of an outfit
     *
     * @param tag Tag of the outfit to track. Case-insensitive
     *
     * @returns A Loading that will contain the state of
     */
    addOutfit(tag) {
        if (this.connected == false) {
            throw `Cannot track outfit ${tag}: Core is not connected`;
        }
        const loading = Loadable__WEBPACK_IMPORTED_MODULE_0__["Loadable"].loading();
        if (tag.trim().length == 0) {
            loading.state = "loaded";
            return loading;
        }
        census_OutfitAPI__WEBPACK_IMPORTED_MODULE_2__["default"].getByTag(tag).ok((data) => {
            this.outfits.push(data.ID);
        });
        census_OutfitAPI__WEBPACK_IMPORTED_MODULE_2__["default"].getCharactersByTag(tag).ok((data) => {
            this.subscribeToEvents(data);
            loading.state = "loaded";
        });
        return loading;
    }
    /**
     * Begin tracking a new player
     *
     * @param name Name of the player to track. Case-insensitive
     *
     * @returns A loading that will contain the state of
     */
    addPlayer(name) {
        if (this.connected == false) {
            throw `Cannot track character ${name}: Core is not connected`;
        }
        const loading = Loadable__WEBPACK_IMPORTED_MODULE_0__["Loadable"].loading();
        if (name.trim().length == 0) {
            loading.state = "loaded";
            return loading;
        }
        census_CharacterAPI__WEBPACK_IMPORTED_MODULE_3__["CharacterAPI"].getByName(name).ok((data) => {
            this.subscribeToEvents([data]);
        });
        return loading;
    }
    /**
     * Subscribe to the events in the event stream
     *
     * @param chars Characters to subscribe to
     */
    subscribeToEvents(chars) {
        if (this.sockets.tracked == null) {
            console.warn(`Cannot subscribe to events, tracked socket is null`);
            return;
        }
        // No duplicates
        chars = chars.filter((char) => {
            return this.characters.map((c) => c.ID).indexOf(char.ID) == -1;
        });
        if (chars.length == 0) {
            return;
        }
        this.characters = this.characters.concat(chars).sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        chars.forEach((character) => {
            const player = new InvididualGenerator__WEBPACK_IMPORTED_MODULE_4__["TrackedPlayer"]();
            player.characterID = character.ID;
            player.faction = character.faction;
            player.outfitTag = character.outfitTag;
            player.name = character.name;
            if (character.online == true) {
                player.joinTime = new Date().getTime();
            }
            this.stats.set(character.ID, player);
        });
        const subscribeExp = {
            "action": "subscribe",
            "characters": [
                ...(chars.map((char) => char.ID))
            ],
            "eventNames": [
                "GainExperience",
                "AchievementEarned",
                "Death",
                "FacilityControl",
                "ItemAdded",
                "VehicleDestroy"
            ],
            "service": "event"
        };
        this.sockets.tracked.send(JSON.stringify(subscribeExp));
    }
    onmessage(ev) {
        for (const message of this.socketMessageQueue) {
            if (ev.data == message) {
                //console.log(`Duplicate message found: ${ev.data}`);
                return;
            }
        }
        this.socketMessageQueue.push(ev.data);
        this.socketMessageQueue.shift();
        this.processMessage(ev.data, false);
    }
}
window.Core = Core;


/***/ }),

/***/ "../core/CoreConnection.ts":
/*!*********************************!*\
  !*** ../core/CoreConnection.ts ***!
  \*********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_Core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core/Core */ "../core/Core.ts");
/* harmony import */ var census_ApiWrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! census/ApiWrapper */ "../census/ApiWrapper.ts");


core_Core__WEBPACK_IMPORTED_MODULE_0__["Core"].prototype.connect = function () {
    const self = this;
    const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
    self.disconnect();
    let opsLeft = +1 // Tracker
        + 1 // Logins
        + 1 // Logistics
        + 1; // Facilities
    setupTrackerSocket(self).always(() => { if (--opsLeft == 0) {
        response.resolveOk();
    } });
    setupLoginSocket(self).always(() => { if (--opsLeft == 0) {
        response.resolveOk();
    } });
    setupLogisticsSocket(self).always(() => { if (--opsLeft == 0) {
        response.resolveOk();
    } });
    setupFacilitySocket(self).always(() => { if (--opsLeft == 0) {
        response.resolveOk();
    } });
    self.connected = true;
    return response;
};
core_Core__WEBPACK_IMPORTED_MODULE_0__["Core"].prototype.disconnect = function () {
    const self = this;
    if (self.sockets.tracked != null) {
        self.sockets.tracked.close();
    }
    if (self.sockets.logins != null) {
        self.sockets.logins.close();
    }
    if (self.sockets.logistics != null) {
        self.sockets.logistics.close();
    }
    if (self.sockets.facility != null) {
        self.sockets.facility.close();
    }
    self.connected = false;
};
core_Core__WEBPACK_IMPORTED_MODULE_0__["Core"].prototype.onSocketError = function (socketName, ev) {
    console.error(`Error on socket: ${socketName}> ${ev}`);
};
function setupTrackerSocket(core) {
    const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
    core.sockets.tracked = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${core.serviceID}`);
    core.sockets.tracked.onopen = () => {
    };
    core.sockets.tracked.onerror = () => {
        response.resolve({ code: 500, data: `` });
    };
    core.sockets.tracked.onmessage = () => {
        response.resolveOk();
        core.sockets.tracked.onmessage = core.onmessage.bind(core);
    };
    return response;
}
function setupLogisticsSocket(core) {
    const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
    core.sockets.logistics = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${core.serviceID}`);
    core.sockets.logistics.onopen = (ev) => {
        if (core.sockets.logistics == null) {
            throw `Expected sockets.logistics to not be null`;
        }
        const msg = {
            service: "event",
            action: "subscribe",
            characters: ["all"],
            worlds: [
                //core.settings.serverID
                "1"
            ],
            eventNames: [
                "GainExperience_experience_id_1409",
            ],
            logicalAndCharactersWithWorlds: true
        };
        core.sockets.logistics.send(JSON.stringify(msg));
        response.resolveOk();
    };
    core.sockets.logistics.onerror = (ev) => core.onSocketError("logistics", ev);
    core.sockets.logistics.onmessage = core.onmessage.bind(core);
    return response;
}
function setupLoginSocket(core) {
    const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
    core.sockets.logins = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${core.serviceID}`);
    core.sockets.logins.onopen = (ev) => {
        if (core.sockets.logins == null) {
            throw `Expected sockets.login to not be null`;
        }
        const msg = {
            service: "event",
            action: "subscribe",
            characters: ["all"],
            worlds: [
                //core.settings.serverID
                "1"
            ],
            eventNames: [
                "PlayerLogin",
                "PlayerLogout"
            ],
            logicalAndCharactersWithWorlds: true
        };
        core.sockets.logins.send(JSON.stringify(msg));
        response.resolveOk();
    };
    core.sockets.logins.onerror = (ev) => core.onSocketError("login", ev);
    core.sockets.logins.onmessage = core.onmessage.bind(core);
    return response;
}
function setupFacilitySocket(core) {
    const response = new census_ApiWrapper__WEBPACK_IMPORTED_MODULE_1__["ApiResponse"]();
    core.sockets.facility = new WebSocket(`wss://push.planetside2.com/streaming?environment=ps2&service-id=s:${core.serviceID}`);
    core.sockets.facility.onopen = (ev) => {
        if (core.sockets.facility == null) {
            throw `sockets.facility is null`;
        }
        console.log(`facility socket connected`);
        const msg = {
            service: "event",
            action: "subscribe",
            characters: ["all"],
            worlds: [
                //this.settings.serverID
                "1"
            ],
            eventNames: [
                "PlayerFacilityCapture",
                "PlayerFacilityDefend"
            ],
            logicalAndCharactersWithWorlds: true
        };
        core.sockets.facility.send(JSON.stringify(msg));
        response.resolveOk();
    };
    core.sockets.facility.onmessage = core.onmessage.bind(core);
    core.sockets.facility.onerror = (ev) => core.onSocketError("facility", ev);
    return response;
}


/***/ }),

/***/ "../core/CoreProcessing.ts":
/*!*********************************!*\
  !*** ../core/CoreProcessing.ts ***!
  \*********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_Core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core/Core */ "../core/Core.ts");
/* harmony import */ var census_PsLoadout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! census/PsLoadout */ "../census/PsLoadout.ts");
/* harmony import */ var PsEvent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! PsEvent */ "../PsEvent.ts");
/* harmony import */ var census_WeaponAPI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! census/WeaponAPI */ "../census/WeaponAPI.ts");
/* harmony import */ var census_FacilityAPI__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! census/FacilityAPI */ "../census/FacilityAPI.ts");
/* harmony import */ var census_CharacterAPI__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! census/CharacterAPI */ "../census/CharacterAPI.ts");






core_Core__WEBPACK_IMPORTED_MODULE_0__["Core"].prototype.processMessage = function (input, override = false) {
    var _a;
    const self = this;
    if (self.tracking.running == false && override == false) {
        return;
    }
    let save = false;
    const msg = JSON.parse(input);
    if (msg.type == "serviceMessage") {
        const event = msg.payload.event_name;
        const timestamp = Number.parseInt(msg.payload.timestamp) * 1000;
        const zoneID = msg.payload.zone_id;
        if (event == "GainExperience") {
            const eventID = msg.payload.experience_id;
            const charID = msg.payload.character_id;
            const targetID = msg.payload.other_id;
            const amount = Number.parseInt(msg.payload.amount);
            const event = PsEvent__WEBPACK_IMPORTED_MODULE_2__["PsEvents"].get(eventID);
            if (eventID == "1410") {
                if (self.stats.get(charID) != undefined) {
                    if (self.routerTracking.routerNpcs.has(charID)) {
                        //console.log(`${charID} router npc check for ${targetID}`);
                        const router = self.routerTracking.routerNpcs.get(charID);
                        if (router.ID != targetID) {
                            //console.warn(`New router placed by ${charID}, missed ItemAdded event: removing old one and replacing with ${targetID}`);
                            router.destroyed = timestamp;
                            self.routerTracking.routers.push(Object.assign({}, router));
                            self.routerTracking.routerNpcs.set(charID, {
                                ID: targetID,
                                owner: charID,
                                pulledAt: timestamp,
                                firstSpawn: timestamp,
                                destroyed: undefined,
                                count: 1,
                                type: "router"
                            });
                        }
                        else {
                            //console.log(`Same router, incrementing count`);
                            if (router.ID == "") {
                                router.ID = targetID;
                            }
                            if (router.firstSpawn == undefined) {
                                router.firstSpawn = timestamp;
                            }
                            ++router.count;
                        }
                    }
                    else {
                        //console.log(`${charID} has new router ${targetID} placed/used`);
                        self.routerTracking.routerNpcs.set(charID, {
                            ID: targetID,
                            owner: charID,
                            pulledAt: timestamp,
                            firstSpawn: timestamp,
                            destroyed: undefined,
                            count: 1,
                            type: "router"
                        });
                    }
                    save = true;
                }
            }
            else if (eventID == "1409") {
                const trackedNpcs = Array.from(self.routerTracking.routerNpcs.values());
                const ids = trackedNpcs.map(iter => iter.ID);
                if (ids.indexOf(targetID) > -1) {
                    const router = trackedNpcs.find(iter => iter.ID == targetID);
                    //console.log(`Router ${router.ID} placed by ${router.owner} destroyed, saving`);
                    router.destroyed = timestamp;
                    self.routerTracking.routers.push(Object.assign({}, router));
                    self.routerTracking.routerNpcs.delete(router.owner);
                    save = true;
                }
            }
            const ev = {
                type: "exp",
                amount: amount,
                expID: eventID,
                zoneID: zoneID,
                trueExpID: eventID,
                loadoutID: msg.payload.loadout_id,
                sourceID: charID,
                targetID: targetID,
                timestamp: timestamp
            };
            // Undefined means was the target of the event, not the source
            const player = self.stats.get(charID);
            if (player != undefined) {
                if (Number.isNaN(amount)) {
                    console.warn(`NaN amount from event: ${JSON.stringify(msg)}`);
                }
                else {
                    player.score += amount;
                }
                if (event != undefined) {
                    if (event.track == true) {
                        player.stats.increment(eventID);
                        if (event.alsoIncrement != undefined) {
                            const alsoEvent = PsEvent__WEBPACK_IMPORTED_MODULE_2__["PsEvents"].get(event.alsoIncrement);
                            if (alsoEvent.track == true) {
                                player.stats.increment(event.alsoIncrement);
                            }
                            ev.expID = event.alsoIncrement;
                        }
                    }
                }
                player.events.push(ev);
            }
            else {
                self.miscEvents.push(ev);
            }
            self.emit(ev);
            if (eventID == PsEvent__WEBPACK_IMPORTED_MODULE_2__["PsEvent"].revive || eventID == PsEvent__WEBPACK_IMPORTED_MODULE_2__["PsEvent"].squadRevive) {
                const target = self.stats.get(targetID);
                if (target != undefined) {
                    if (target.recentDeath != null) {
                        target.recentDeath.revived = true;
                        target.recentDeath.revivedEvent = ev;
                        //console.log(`${targetID} died but was revived by ${charID}`);
                    }
                    target.stats.decrement(PsEvent__WEBPACK_IMPORTED_MODULE_2__["PsEvent"].death);
                    target.stats.increment(PsEvent__WEBPACK_IMPORTED_MODULE_2__["PsEvent"].revived);
                }
            }
            save = true;
        }
        else if (event == "Death") {
            const targetID = msg.payload.character_id;
            const sourceID = msg.payload.attacker_character_id;
            const isHeadshot = msg.payload.is_headshot == "1";
            const targetLoadoutID = msg.payload.character_loadout_id;
            const sourceLoadoutID = msg.payload.attacker_loadout_id;
            if (self.tracking.running == true) {
                census_CharacterAPI__WEBPACK_IMPORTED_MODULE_5__["CharacterAPI"].cache(targetID);
                census_CharacterAPI__WEBPACK_IMPORTED_MODULE_5__["CharacterAPI"].cache(sourceID);
            }
            const targetLoadout = census_PsLoadout__WEBPACK_IMPORTED_MODULE_1__["PsLoadouts"].get(targetLoadoutID);
            if (targetLoadout == undefined) {
                return console.warn(`Unknown target loadout ID: ${targetLoadoutID}`);
            }
            const sourceLoadout = census_PsLoadout__WEBPACK_IMPORTED_MODULE_1__["PsLoadouts"].get(sourceLoadoutID);
            if (sourceLoadout == undefined) {
                return console.warn(`Unknown source loadout ID: ${sourceLoadoutID}`);
            }
            let targetTicks = self.stats.get(targetID);
            if (targetTicks != undefined && targetLoadout.faction != sourceLoadout.faction) {
                targetTicks.stats.increment(PsEvent__WEBPACK_IMPORTED_MODULE_2__["PsEvent"].death);
                const ev = {
                    type: "death",
                    isHeadshot: isHeadshot,
                    sourceID: targetID,
                    targetID: sourceID,
                    loadoutID: targetLoadoutID,
                    targetLoadoutID: sourceLoadoutID,
                    weaponID: msg.payload.attacker_weapon_id,
                    revived: false,
                    revivedEvent: null,
                    timestamp: timestamp,
                    zoneID: zoneID
                };
                targetTicks.events.push(ev);
                targetTicks.recentDeath = ev;
                census_WeaponAPI__WEBPACK_IMPORTED_MODULE_3__["WeaponAPI"].precache(ev.weaponID);
                self.emit(ev);
                save = true;
            }
            let sourceTicks = self.stats.get(sourceID);
            if (sourceTicks != undefined) {
                if (targetLoadout.faction == sourceLoadout.faction) {
                    sourceTicks.stats.increment(PsEvent__WEBPACK_IMPORTED_MODULE_2__["PsEvent"].teamkill);
                    (_a = targetTicks) === null || _a === void 0 ? void 0 : _a.stats.increment(PsEvent__WEBPACK_IMPORTED_MODULE_2__["PsEvent"].teamkilled);
                    const ev = {
                        type: "teamkill",
                        sourceID: sourceID,
                        loadoutID: sourceLoadoutID,
                        targetID: targetID,
                        targetLoadoutID: targetLoadoutID,
                        weaponID: msg.payload.attacker_weapon_id,
                        zoneID: zoneID,
                        timestamp: timestamp
                    };
                    sourceTicks.events.push(ev);
                    self.emit(ev);
                }
                else {
                    sourceTicks.stats.increment(PsEvent__WEBPACK_IMPORTED_MODULE_2__["PsEvent"].kill);
                    if (isHeadshot == true) {
                        sourceTicks.stats.increment(PsEvent__WEBPACK_IMPORTED_MODULE_2__["PsEvent"].headshot);
                    }
                    const ev = {
                        type: "kill",
                        isHeadshot: isHeadshot,
                        sourceID: sourceID,
                        targetID: targetID,
                        loadoutID: sourceLoadoutID,
                        targetLoadoutID: targetLoadoutID,
                        weaponID: msg.payload.attacker_weapon_id,
                        timestamp: timestamp,
                        zoneID: zoneID
                    };
                    sourceTicks.events.push(ev);
                    census_WeaponAPI__WEBPACK_IMPORTED_MODULE_3__["WeaponAPI"].precache(ev.weaponID);
                    self.emit(ev);
                }
                save = true;
            }
        }
        else if (event == "PlayerFacilityCapture") {
            const playerID = msg.payload.character_id;
            const outfitID = msg.payload.outfit_id;
            const facilityID = msg.payload.facility_id;
            const ev = {
                type: "capture",
                sourceID: playerID,
                outfitID: outfitID,
                facilityID: facilityID,
                timestamp: timestamp,
                zoneID: zoneID
            };
            self.playerCaptures.push(ev);
            let player = self.stats.get(playerID);
            if (player != undefined) {
                player.stats.increment(PsEvent__WEBPACK_IMPORTED_MODULE_2__["PsEvent"].baseCapture);
                player.events.push(ev);
            }
            self.emit(ev);
            save = true;
        }
        else if (event == "PlayerFacilityDefend") {
            const playerID = msg.payload.character_id;
            const outfitID = msg.payload.outfit_id;
            const facilityID = msg.payload.facility_id;
            const ev = {
                type: "defend",
                sourceID: playerID,
                outfitID: outfitID,
                facilityID: facilityID,
                timestamp: timestamp,
                zoneID: zoneID,
            };
            self.playerCaptures.push(ev);
            self.emit(ev);
            let player = self.stats.get(playerID);
            if (player != undefined) {
                player.stats.increment(PsEvent__WEBPACK_IMPORTED_MODULE_2__["PsEvent"].baseDefense);
            }
            save = true;
        }
        else if (event == "AchievementEarned") {
            const charID = msg.payload.character_id;
            const achivID = msg.payload.achievement_id;
            const char = self.stats.get(charID);
            if (char != undefined) {
                char.ribbons.increment(achivID);
                save = true;
            }
        }
        else if (event == "FacilityControl") {
            const outfitID = msg.payload.outfit_id;
            const facilityID = msg.payload.facility_id;
            census_FacilityAPI__WEBPACK_IMPORTED_MODULE_4__["FacilityAPI"].getByID(facilityID).ok((data) => {
                const capture = {
                    facilityID: data.ID,
                    zoneID: zoneID,
                    name: data.name,
                    typeID: data.typeID,
                    type: data.type,
                    timestamp: new Date(timestamp),
                    timeHeld: Number.parseInt(msg.payload.duration_held),
                    factionID: msg.payload.new_faction_id,
                    outfitID: outfitID,
                    previousFaction: msg.payload.old_faction_id,
                };
                self.facilityCaptures.push(capture);
            }).noContent(() => {
                console.error(`Failed to find facility ID ${facilityID}`);
            });
            save = true;
        }
        else if (event == "ItemAdded") {
            const itemID = msg.payload.item_id;
            const charID = msg.payload.character_id;
            if (itemID == "6003551") {
                if (self.stats.get(charID) != undefined) {
                    //console.log(`${charID} pulled a new router`);
                    if (self.routerTracking.routerNpcs.has(charID)) {
                        const router = self.routerTracking.routerNpcs.get(charID);
                        //console.log(`${charID} pulled a new router, saving old one`);
                        router.destroyed = timestamp;
                        self.routerTracking.routers.push(Object.assign({}, router));
                    }
                    const router = {
                        ID: "",
                        owner: charID,
                        count: 0,
                        destroyed: undefined,
                        firstSpawn: undefined,
                        pulledAt: timestamp,
                        type: "router"
                    };
                    self.routerTracking.routerNpcs.set(charID, router);
                    save = true;
                }
            }
        }
        else if (event == "VehicleDestroy") {
            const killerID = msg.payload.attacker_character_id;
            const killerLoadoutID = msg.payload.attacker_loadout_id;
            const killerWeaponID = msg.payload.attacker_weapon_id;
            const vehicleID = msg.payload.vehicle_id;
            const player = self.stats.get(killerID);
            if (player != undefined) {
                const ev = {
                    type: "vehicle",
                    sourceID: killerID,
                    loadoutID: killerLoadoutID,
                    weaponID: killerWeaponID,
                    targetID: msg.payload.character_id,
                    vehicleID: vehicleID,
                    timestamp: timestamp,
                    zoneID: zoneID
                };
                player.events.push(ev);
                save = true;
                self.emit(ev);
            }
        }
        else if (event == "PlayerLogin") {
            const charID = msg.payload.character_id;
            if (this.stats.has(charID)) {
                const char = this.stats.get(charID);
                char.online = true;
                if (this.tracking.running == true) {
                    char.joinTime = new Date().getTime();
                }
                const ev = {
                    type: "login",
                    sourceID: charID,
                    timestamp: timestamp
                };
                char.events.push(ev);
                self.emit(ev);
            }
        }
        else if (event == "PlayerLogout") {
            const charID = msg.payload.character_id;
            if (this.stats.has(charID)) {
                const char = this.stats.get(charID);
                char.online = false;
                if (this.tracking.running == true) {
                    const diff = new Date().getTime() - char.joinTime;
                    char.secondsOnline += (diff / 1000);
                }
                const ev = {
                    type: "logout",
                    sourceID: charID,
                    timestamp: timestamp
                };
                char.events.push(ev);
                self.emit(ev);
            }
        }
        else {
            console.warn(`Unknown event type: ${event}\n${JSON.stringify(msg)}`);
        }
    }
    else if (msg.type == "heartbeat") {
        //console.log(`Heartbeat ${new Date().toISOString()}`);
    }
    else if (msg.type == "serviceStateChanged") {
        console.log(`serviceStateChanged event`);
    }
    else if (msg.type == "connectionStateChanged") {
        console.log(`connectionStateChanged event`);
    }
    else if (msg.type == undefined) {
        // Occurs in response to subscribing to new events
    }
    else {
        console.warn(`Unchecked message type: '${msg.type}'`);
    }
    if (save == true) {
        self.rawData.push(JSON.stringify(msg));
    }
};


/***/ }),

/***/ "../core/index.ts":
/*!************************!*\
  !*** ../core/index.ts ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Core */ "../core/Core.ts");
/* harmony import */ var _CoreProcessing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CoreProcessing */ "../core/CoreProcessing.ts");
/* harmony import */ var _CoreConnection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CoreConnection */ "../core/CoreConnection.ts");



/* harmony default export */ __webpack_exports__["default"] = (_Core__WEBPACK_IMPORTED_MODULE_0__["Core"]);


/***/ }),

/***/ "./app.ts":
/*!****************!*\
  !*** ./app.ts ***!
  \****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/index */ "../core/index.ts");


const vm = new vue__WEBPACK_IMPORTED_MODULE_0___default.a({
    el: "app",
    data: {
        core: new _core_index__WEBPACK_IMPORTED_MODULE_1__["default"]("cikserviceid80")
    },
    created: function () {
        this.core.connect().ok(() => {
            var _a;
            this.core.start();
            (_a = this.core.sockets.logistics) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                service: "event",
                action: "subscribe",
                characters: ["all"],
                worlds: ["1"],
                eventNames: ["GainExperience_experience_id_1410"],
                logicalAndCharctersWithWorlds: true
            }));
        });
    },
    methods: {}
});
window.vm = vm;


/***/ }),

/***/ "vue":
/*!**********************!*\
  !*** external "Vue" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = Vue;

/***/ })

/******/ });