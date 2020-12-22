"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.frontendRoutes = void 0;
const express_1 = __importDefault(require("express"));
const frontend_1 = require("../controllers/frontend");
const router = express_1.default.Router();
exports.frontendRoutes = router;
router.get('/:page?', frontend_1.getIndex);
router.get('/contact', frontend_1.getContact);
router.get('/providers', frontend_1.getProviders);
//# sourceMappingURL=frontend.js.map