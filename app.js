/**
 * File: app.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 *
 * Main node file for the WhichISP application
 */

const environment = process.env.NODE_ENV || "development";
const dir         = __dirname + '/';
const configDir   = dir + 'config/' + environment + '/';


/**
 * Module / File requires
 * 1. Configuration File
 * 2. Metatags
 * 3. Compression
 * 4. Body-Parser
 * 5. Express
 * 6. UUID
 * 7. ECT
 */
const config      = require(configDir + 'config.json');
const compression = require('compression');
const parser      = require('body-parser');
const express     = require('express');
const uuidv4      = require('uuid/v4');
const ect         = require('ect');
const session     = require('express-session');
const memstore    = require('memorystore')(session);

let renderer = ect({ 
    root: dir + config.settings.views,
    watch: true,
    ext: '.ect'
});


let compress    = compression({ threshold: 0 });
let application = express();


application.engine('ect', renderer.render);
application.set('view engine', 'ect');


/**
 * Set caching for static files at 1 week
 */
application.use(express.static(config.settings.statics, { maxage:'1w' }));
application.use(parser.urlencoded({ extended: true }));
application.use(parser.json());
application.use(compress);


/**
 * Setup session store
 */
application.use(session({
    store : new memstore({ checkPeriod: 86400000 }),
    secret: 'whichisp_kevanstuart_7100',
    saveUninitialized: false,
    resave: false
}));


/**
 * Looks like the best way to handle robots.txt
 */
application.get('/robots.txt', function(req, res) 
{
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /api/");
});


require('./controller/frontend')(application, config);


/**
 * Looks like the best way to handle errors
 */
application.use(function(err, req, res, next) 
{
	res.status(err.status || 500);
	res.render('error', { error: err });
});


application.set('port', process.env.PORT || config.settings.port);
application.listen(application.get('port'), listen);
function listen()
{
    console.log('App listening on port ' + application.get('port'));
}

