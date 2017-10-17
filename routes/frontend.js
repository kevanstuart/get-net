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
	 * Set Route URL's && Callbacks
	 */
	application.get('/', getFilters, indexGetRoute);
	application.post('/', getFilters, indexPostRoute);
	application.get('/about', aboutRoute);
	application.get('/contact', contactFormRoute);

	/**
	 * Get dynamic filters to insert into index page
	 */
	function getFilters(req, res, next)
	{

		// Set Filters URL
		let filtersOptions = { 
			url: config.baseUrl + config.filtersPath 
		};

    	// Get Filters from API URL
		request(filtersOptions, function(error, response, data) 
		{

			// Add filters to request
			req.filters = JSON.parse(data);
			
			// Next
			next();

		});

	}

	/**
	 * Set index route on GET
	 */
	function indexGetRoute(req, res, next)
	{

		// Configure GET parameters
		let getOptions = {
			url: config.baseUrl + config.plansPath
		};

		// Set API URL && send request to the URL && handle response
		request(getOptions, function(error, response, data) 
		{

			// Assign and merge data objects
			let rowData = JSON.parse(data);
			let filterData  = { filters: req.filters };
			Object.assign(rowData, filterData);

			// Render the index page
			res.render('index', rowData);

		});	

	}

	/**
	 * Set index route on POST
	 */
	function indexPostRoute(req, res, next)
	{

		// Configure POST parameters
		let postOptions = {
			url : config.baseUrl + config.plansPath,
			form: req.body
		};

		// Send request to the URL && handle response
		request.post(postOptions, function(err, response, data) 
		{

			// Assign and merge data objects
			let rowData = JSON.parse(data);
			let filterData  = { filters: req.filters };
			Object.assign(rowData, filterData);

			// Render the index page
			res.render('index', rowData);

		});

	}

	/**
	 * Set the contact form page route
	 */
	function contactFormRoute(req, res)
	{

		// Render the contact page
		res.render('contact');

	}


	/**
	 * Set the about page route
	 */
	function aboutRoute(req, res)
	{

		// Render the about page
		res.render('about');

	}

}
