/**
 * File: data_routes.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 * 
 * Handles routing for the frontend urls
 */

/**
 * Module Requires
 * 1. Request
 * 2. Sendgrid Mail
 */
const request = require('request');
//const helper  = require('sendgrid').mail;


/**
 * Elements in the contact form
 */
var formElements = [ 'name', 'email', 'message' ];


/**
 * Frontend Routes function
 */
module.exports = function(application, config)
{

	'use strict';

	/**
	 * Set Route URL's && Callbacks
	 */
	/*application.get('/about', aboutPageRoute);
	application.get('/contact', contactFormRoute);
	application.post('/contact', processContactForm, contactFormRoute);*/
	application.param('page', checkParameter);
	application.get( '/:page?', getFilters, indexGetRoute,  indexPageRoute);
	application.post('/:page?', getFilters, indexPostRoute, indexPageRoute);


	/**
	 * Handling a parameter check - needs to be a number
	 */
	function checkParameter(req, res, next, page)
	{

		// Page needs to be a number or not zero
		if (isNaN(page) || page == 0)
		{

			// Create a 404 error
			let error = new Error();
			error.message = "Well, this is strange. There's no page here... Hmmm....";
			error.name    = "Page not found";
			error.status  = 404;
			next(error);

		}
		else
		{

			// Next!
			next();

		}

	}


	/**
	 * Get dynamic filters to insert into index page
	 */
	function getFilters(req, res, next)
	{

		// Set Filters URL
		let options = { 
			url : config.baseUrl + config.filtersPath
		};

    	// Get Filters from API URL
		request(options, function(error, response, data) 
		{

			// Add filters to request
			res.locals.filters = JSON.parse(data);
			
			// Next
			next();

		});

	}

	/**
	 * Set index route on GET
	 */
	function indexGetRoute(req, res, next)
	{

		// Reset the session if the page number is unspecified
		if (req.params.page === undefined)
		{
			req.session.filters = false;
		}

		// I'm checking for a page number
		let pageNum = req.params.page || 1;

		// Check whether filters exist in session
		let filters = req.session.filters || false;

		// Options to pass to request
		res.locals.options = {
			form : { page: pageNum, filters: filters },
			url  : config.baseUrl + config.plansPath
		};

		// Because
		next();

	}

	/**
	 * Set index route on POST
	 */
	function indexPostRoute(req, res, next)
	{

		// I'm checking for a page number
		let pageNum = req.params.page || 1;

		// Check whether filters exist in session
		let filters = req.body || false;

		// Configure parameters
		res.locals.options = {
			form : { page: pageNum, filters: filters },
			url  : config.baseUrl + config.plansPath
		};

		// Because
		next();

	}


	/**
	 * Final index page route for request and rendering
	 */
	function indexPageRoute(req, res, next)
	{

		//console.log(res.locals.options);

		// Send request to the URL && handle response
		request.post(res.locals.options, function(error, response, data) 
		{

			// Assign data and add filters
			let appData = (data.length > 0) ? JSON.parse(data) : {};
			appData.filters = res.locals.filters;

			// Add base url to appData
			appData.base_url = config.baseUrl;

			// Assign filter post to session if filtering exists
			if (appData.post)
			{
				req.session.filters = appData.post;
			}

			// Render the index page
			res.render('index', appData);

		});

	}


	function processContactForm(req, res, next)
	{

		// Render the form
		next();

	}


	/**
	 * Set the contact form page route
	 */
	function contactFormRoute(req, res, next)
	{

		// Render the contact page
		res.render('contact');

	}


	/**
	 * Set the about page route
	 */
	function aboutPageRoute(req, res)
	{

		// Render the about page
		res.render('about');

	}

}
