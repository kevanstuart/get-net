"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mustache_express_1 = __importDefault(require("mustache-express"));
const compression_1 = __importDefault(require("compression"));
const memorystore_1 = __importDefault(require("memorystore"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const csurf_1 = __importDefault(require("csurf"));
const path_1 = __importDefault(require("path"));
// import { v4 as uuidv4 } from 'uuid'
const application = express_1.default();
const viewPath = path_1.default.join(__dirname, '../', 'views');
application.engine('mustache', mustache_express_1.default());
application.set('view engine', 'mustache');
application.set('views', viewPath);
application.use(express_1.default.static('public', { maxAge: '1w' }));
application.use(body_parser_1.default.urlencoded({ extended: true }));
application.use(compression_1.default({ threshold: 0 }));
application.use(body_parser_1.default.json());
const memStore = memorystore_1.default(express_session_1.default);
application.use(express_session_1.default({
    store: new memStore({ checkPeriod: 86400000 }),
    secret: 'whichisp_kevanstuart_7100',
    saveUninitialized: false,
    resave: false
}));
const csrf = csurf_1.default();
application.use(csrf);
application.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
const frontend_1 = require("./routes/frontend");
application.use(frontend_1.frontendRoutes);
application.listen('3000');
//# sourceMappingURL=index.js.map