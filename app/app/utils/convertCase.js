"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objToCamelCase = exports.strToCamelCase = void 0;
exports.strToCamelCase = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0
        ? word.toLowerCase()
        : word.toUpperCase()).replace(/\s+/g, '');
};
exports.objToCamelCase = (obj) => {
    const camelCased = {};
    Object.keys(obj).map((key) => camelCased[exports.strToCamelCase(key)] = obj[key]);
    return camelCased;
};
//# sourceMappingURL=convertCase.js.map