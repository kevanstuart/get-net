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
	application.get('/', indexGetRoute);
	function indexGetRoute(req, res)
	{

		// Get page parameter (optional);
		//let page = (req.params.page !== undefined) ? req.params.page : 1;

		// Configure GET parameters
		let getOptions = {
			url: config.apiUrl
		};

		// Set API URL && send request to the URL && handle response
		request(getOptions, function(error, response, data) 
		{
			
			// Render the index page
			res.render('index', JSON.parse(data));

		});	

	}

	/**
	 * Set index route on POST
	 */
	application.post('/', indexPostRoute);
	function indexPostRoute(req, res)
	{

		console.time('Filters');

		// Get page parameter (optional);
		//let page = (req.params.page !== undefined) ? req.params.page : 1;

		// Configure POST parameters
		let postOptions = {
			url : config.apiUrl,
			form: req.body
		};

		// Send request to the URL && handle response
		request.post(postOptions, function(err, response, data) 
		{

			console.timeEnd('Filters');

			// Render the index page
			res.render('index', JSON.parse(data));

		});

	}

	/**
	 * Set the contact form page route
	 */
	application.get('/contact', contactFormRoute);
	function contactFormRoute(req, res)
	{

		// Render the contact page
		res.render('contact');

	}


	/**
	 * Set the about page route
	 */
	application.get('/about', aboutRoute);
	function aboutRoute(req, res)
	{

		// Render the about page
		res.render('about');

	}

}
