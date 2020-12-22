"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceModel = exports.ConnectionType = void 0;
// eslint-disable-next-line no-shadow
var ConnectionType;
(function (ConnectionType) {
    ConnectionType["adsl"] = "ADSL";
    ConnectionType["fiber"] = "Fiber";
    ConnectionType["lte"] = "4G LTE+";
})(ConnectionType = exports.ConnectionType || (exports.ConnectionType = {}));
// eslint-disable-next-line no-shadow
var PriceModel;
(function (PriceModel) {
    PriceModel["perMonth"] = "per month";
    PriceModel["perYear"] = "per year";
})(PriceModel = exports.PriceModel || (exports.PriceModel = {}));
//# sourceMappingURL=plan.js.map