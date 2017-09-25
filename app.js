/**
 * File: app.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 *
 * Main node file for the WhichISP application
 */


/**
 * Get Node Environment Variable
 */
var environment = process.env.NODE_ENV || "development";


/**
 * Set Base Directory && Related
 */
let dir        = __dirname + '/';
let config_dir = dir + 'config/' + environment + '/';


/**
 * Module / File requires
 * 1. Configuration File
 * 2. Compression
 * 3. Express
 * 4. AWS SDK
 * 5. UUID
 * 6. ECT
 */
var config      = require(config_dir + 'config.json');
var compression = require('compression');
var express     = require('express');
var aws_sdk     = require('aws-sdk');
var uuidv4      = require('uuid/v4');
var ect         = require('ect');


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
 * Initialize AWS SDK && Dynamodb Client
 */
aws_sdk.config.loadFromPath(config_dir + 'aws-config.json');
var ddb = new aws_sdk.DynamoDB();


/**
 * Initialize Express App & Configure
 */
var application = express();
application.engine('ect', renderer.render);

application.set('port', process.env.PORT || config.settings.port);
application.set('view engine', 'ect');

application.use(express.static(config.settings.statics, { maxage:'1w' }));
application.use(compress);


/**
 * Require the database functions file
 */
var db = require('./data.js')(ddb);
console.log(db);


/**
 * Set Default Route
 */
application.get('/', default_route);
function default_route(req, res)
{
    res.render('index');
}


/**
 * Start App && Listen to Port
 */
application.listen(application.get('port'), listen_result);
function listen_result()
{
    console.log('App listening on port ' + application.get('port'));
}



