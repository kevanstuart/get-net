/**
 * File: data_routes.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 * 
 * Handles routing for the frontend urls
 */

/**
 * Module Requires
 * 1. Request
 */
const request = require('request');

/**
 * Frontend Routes function
 */
module.exports = function(application, config)
{
	'use strict';

	/**
	 * Set config into request
	 */
	application.use(function(req, res, next) 
	{
		config.apiUrl = config.baseUrl + config.apiPath;
		req.config = config;
		next();
	});

	/**
	 * Set index route on GET
	 */
	application.get('/', indexGetRoute);
	function indexGetRoute(req, res)
	{

		/**
		 * Set API URL && send request to the URL && handle response
		 */
		request(config.apiUrl, function(err, response, data) 
		{

			console.log(data);
			
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
		 * Get POST data
		 */
		let postOptions = {
			url:  config.apiUrl,
			form: req.body
		};

		/**
		 * Send request to the URL && handle response
		 */
		request.post(postOptions, function(err, response, data) 
		{

			/**
			 * Render the index page
			 */
			res.render('index', JSON.parse(data));	

		});

	}

}
