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
 * 3. Express
 * 4. AWS SDK
 * 5. UUID
 * 6. ECT
 */
const config      = require(configDir + 'config.json');
const compression = require('compression');
const parser      = require('body-parser');
const express     = require('express');
const request     = require('request');
const uuidv4      = require('uuid/v4');
const ect         = require('ect');


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
 * Set Default Route
 */
application.get('/', defaultRoute);
function defaultRoute(req, res)
{
	let data = "http://localhost:3000/data";
	request(data, function(err, response, data) 
	{
		let plans = JSON.parse(data);
		
		//res.render('index', { name: 'Kevan' });	
	});
}


/**
 * Set routes for AJAX data calls
 */
require('./routes/data_routes')(application, config);


/**
 * Start App && Listen to Port
 */
application.listen(application.get('port'), listenResult);
function listenResult()
{
    console.log('App listening on port ' + application.get('port'));
}



