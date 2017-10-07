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
 * 2. Compression
 * 3. Body-Parser
 * 3. Express
 * 4. UUID
 * 5. ECT
 */
const config      = require(configDir + 'config.json');
const compression = require('compression');
const parser      = require('body-parser');
const express     = require('express');
const uuidv4      = require('uuid/v4');
const ect         = require('ect');


/**
 * Require database connector
 */
const db_psql = require(dir + 'connectors/psql');


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
var compress = compression({
    threshold: 0
});


/**
 * Initialize Express App
 */
var application = express();

/**
 * Configuration for Application
 */
application.engine('ect', renderer.render);

application.set('port', process.env.PORT || config.settings.port);
application.set('view engine', 'ect');

application.use(express.static(config.settings.statics, { maxage:'1w' }));
application.use(parser.urlencoded({ extended: true }));
application.use(parser.json());
application.use(compress);


/**
 * Require route files
 * 1. frontend
 * 2. api
 */
require('./routes/frontend')(application, config);
require('./routes/api')(application, config, db_psql);


/**
 * Start App && Listen to Port
 */
application.listen(application.get('port'), listenResult);
function listenResult()
{
    console.log('App listening on port ' + application.get('port'));
}



