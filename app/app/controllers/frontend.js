"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContact = exports.getProviders = exports.getIndex = void 0;
const database_1 = require("../utils/database");
// import { Plan } from '../models/plan'
const PlanLib_1 = require("../lib/PlanLib");
const planLib = new PlanLib_1.PlanLib(database_1.database);
exports.getIndex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plans = yield planLib.getPlans();
        // eslint-disable-next-line no-console
        console.log(plans);
        res.render('index');
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
    }
});
exports.getProviders = (req, res) => {
    res.render('providers');
};
exports.getContact = (req, res) => {
    res.render('contact');
};
//# sourceMappingURL=frontend.js.map