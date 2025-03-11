"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObject = void 0;
const toObject = (objThis) => {
    if (typeof objThis === 'string') {
        return objThis;
    }
    const obj = { ...objThis };
    Object.keys(obj).map((key) => {
        if (obj[key] === undefined) {
            delete obj[key];
        }
    });
    return obj;
};
exports.toObject = toObject;
//# sourceMappingURL=util.helper.js.map