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
 * Set index route on GET
 */
application.get('/', indexGetRoute);
function indexGetRoute(req, res)
{

	/**
	 * Set data api URL
	 */
	let dataUrl = config.base_url + '/data';

	/**
	 * Send request to the URL && handle response
	 */
	request(dataUrl, function(err, response, data) 
	{

		/**
		 * JSON parse data response
		 */
		let plans = {
			plans: JSON.parse(data)
		};

		/**
		 * Render the index page
		 */
		res.render('index', plans);	

	});

}


/**
 * Set index route on POST
 */
application.post('/', indexPostRoute);
function indexPostRoute(req, res)
{

	/**
	 * Set data api URL
	 */
	let dataUrl = config.base_url + '/data';

	/**
	 * Get POST data
	 */
	let postOptions = {
		url:  dataUrl,
		form: req.body
	};

	/**
	 * Send request to the URL && handle response
	 */
	request.post(postOptions, function(err, response, data) 
	{

		/**
		 * JSON parse data response
		 */
		let plans = {
			plans: JSON.parse(data)
		};

		/**
		 * Render the index page
		 */
		res.render('index', plans);	

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



