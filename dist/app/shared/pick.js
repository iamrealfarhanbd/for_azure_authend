"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = void 0;
const pick = (filterable, options) => {
    const finalFilter = {};
    for (const option of options) {
        if (filterable && filterable.hasOwnProperty.call(filterable, option)) {
            finalFilter[option] = filterable[option];
        }
    }
    return finalFilter;
};
exports.pick = pick;
