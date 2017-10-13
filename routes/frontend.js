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
		next();
	});

	/**
	 * Set index route on GET
	 */
	application.get('/:page?', indexGetRoute);
	function indexGetRoute(req, res)
	{

		/**
		 * Get page parameter (optional);
		 */
		let page = (req.params.page !== undefined) ? req.params.page : 1;

		/**
		 * GET data
		 */
		let getOptions = {
			url: config.apiUrl + '/' + page
		};

		/**
		 * Set API URL && send request to the URL && handle response
		 */
		request(getOptions, function(error, response, data) 
		{
			
			/**
			 * Render the index page
			 */
			res.render('index', JSON.parse(data));

		});	

	}

	/**
	 * Set index route on POST
	 */
	application.post('/:page?', indexPostRoute);
	function indexPostRoute(req, res)
	{

		/**
		 * Get page parameter (optional);
		 */
		let page = (req.params.page !== undefined) ? req.params.page : 1;

		/**
		 * Get POST data
		 */
		let postOptions = {
			url : config.apiUrl + '/' + page,
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

	application.get('/contact', contactFormRoute);
	function contactFormRoute(req, res)
	{
		res.render('contact');
	}

}
