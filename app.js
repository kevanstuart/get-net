/**
 * File: app.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 *
 * Main node file for the WhichISP application
 */


/**
 * Get Node Environment Variable
 */
const environment = process.env.NODE_ENV || "development";


/**
 * Set Base Directory && Related
 */
const dir       = __dirname + '/';
const configDir = dir + 'config/' + environment + '/';


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


/**
 * Session Handling
 */
const session  = require('express-session');
const memstore = require('memorystore')(session);


/**
 * Configure ECT Rendering Engine
 */
var renderer = ect({ 
    root: dir + config.settings.views,
    watch: true,
    ext: '.ect'
});


/**
 * Configure Compression Engine
 */
var compress = compression({ threshold: 0 });


/**
 * Initialize Express App
 */
var application = express();


/**
 * Configuration for ECT rendering
 */
application.engine('ect', renderer.render);
application.set('view engine', 'ect');


/**
 * Set caching for static files at 1 week
 */
application.use(express.static(config.settings.statics, { maxage:'1w' }));


/**
 * Set body-parser and compression
 */
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


/**
 * Require route files
 * 1. frontend
 * 2. api
 */
require('./routes/frontend')(application, config);
require('./routes/api')(application, config);


/**
 * Default error handler
 */
application.use(function(err, req, res, next) 
{

    // Render error pages
	res.status(err.status || 500);
	res.render('error', { error: err });

});


/**
 * Start App && Listen to Port
 */
application.set('port', process.env.PORT || config.settings.port);
application.listen(application.get('port'), listenResult);
function listenResult()
{
    console.log('App listening on port ' + application.get('port'));
}



