"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpers = exports.database = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const pgp = pg_promise_1.default({
    capSQL: true
});
const options = {
    host: 'db',
    port: 5432,
    database: 'whichisp',
    user: 'postgres',
    password: 'postgres',
};
exports.database = pgp(options);
exports.helpers = pgp.helpers;
//# sourceMappingURL=database.js.map