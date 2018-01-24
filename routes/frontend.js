/**
 * File: data_routes.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 * 
 * Handles routing for the frontend urls
 */

/**
 * Module Requires
 * 1. Sendgrid Mail
 * 2. Form Validator
 * 3. Request
 */
const sendgrid  = require('@sendgrid/mail');
const validator = require('validator');
const request   = require('request');


/**
 * Set the Sendgrid API Key
 */
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);


/**
 * These are the elements in the contact form
 */
const contactElements = [ 'name', 'email', 'message' ];


/**
 * Frontend Routes function
 */
module.exports = function(application, config)
{

	'use strict';

	/**
	 * Set Route URL's && Callbacks
	 */
	application.param('page', checkParameter);

	application.get('/contact', contactPage);
	application.post('/contact', 
		contactPost, 
		contactMail, 
		contactPage
	);

	application.get( '/:page?', 
		indexFilters, 
		indexGet,  
		indexPage
	);
	
	application.post('/:page?', 
		indexFilters, 
		indexPost, 
		indexPage
	);


	/**
	 * Handling a parameter check - needs to be a number
	 */
	function checkParameter(req, res, next, page)
	{
		if (isNaN(page) || page == 0)
		{
			let error = new Error();
			error.status(404);
			next(error);
		}

		next();
	}


	/**
	 * Sanitize and Validate Contact Form input
	 */
	function contactPost(req, res, next)
	{
		let inputs = req.body;
		let errors = [];

		let inputKeys = Object.keys(inputs);
		inputKeys.map(function(key)
		{

			inputs[key] = validator.escape(inputs[key]);
			inputs[key] = validator.trim(inputs[key]);

			if (key === "email")
			{
				inputs[key] = validator.normalizeEmail(inputs[key]);
			}

		});

		inputKeys.map(function(key) 
		{

			if ((key === "email" && !validator.isEmail(inputs[key])) ||
				!contactElements.includes(key) || 
				validator.isEmpty(inputs[key]))
			{
				errors.push(key);
			}

		});
		
		res.locals.inputs = inputs;
		res.locals.errors = errors;

		next();
	}


	/**
	 * Sends an email (duh)
	 */
	function contactMail(req, res, next)
	{
		if (Object.keys(res.locals.errors).length == 0)
		{		
			let params = res.locals.inputs;
			let message = {
				subject: "GetWebKH Contact Form - " + params.name,
				replyTo: params.name + "<" + params.email + ">",
				from   : params.name + "<" + params.email + ">",
				to     : config.email.sendTo,
				text   : params.message
			};

			let mailSent = mail.send(message);
			sent.then(() => {
				res.locals.sent = true;
			});
			sent.catch((error) => {
				console.error(error.toString());
				res.locals.sent = false;
			});
		}

		next();
	}


	/**
	 * Set the contact form page route
	 */
	function contactPage(req, res, next)
	{
		console.log(res.locals);
		res.render('contact', res.locals);
	}


	/**
	 * Get dynamic filters to insert into index page
	 */
	function indexFilters(req, res, next)
	{
		let options = { 
			url : config.baseUrl + config.filtersPath
		};

		request(options, function(error, response, data) 
		{
			res.locals.filters = JSON.parse(data);
			next();
		});
	}

	/**
	 * Set index route on GET
	 */
	function indexGet(req, res, next)
	{
		// Reset the session if the page number is unspecified
		if (req.params.page === undefined)
		{
			req.session.filters = false;
		}

		let pageNum = req.params.page || 1;
		let filters = req.session.filters || false;

		res.locals.options = {
			form : { page: pageNum, filters: filters },
			url  : config.baseUrl + config.plansPath
		};

		next();
	}

	/**
	 * Set index route on POST
	 */
	function indexPost(req, res, next)
	{
		let pageNum = req.params.page || 1;
		let filters = req.body || false;

		res.locals.options = {
			form : { page: pageNum, filters: filters },
			url  : config.baseUrl + config.plansPath
		};

		next();
	}


	/**
	 * Final index page route for request and rendering
	 */
	function indexPage(req, res, next)
	{
		request.post(res.locals.options, function(error, response, data) 
		{
			let appData = (data.length > 0) ? JSON.parse(data) : {};
			appData.filters  = res.locals.filters;
			appData.base_url = config.baseUrl;
			appData.img_url  = config.imgUrl;

			if (appData.post)
			{
				req.session.filters = appData.post;
			}

			res.render('index', appData);
		});
	}

}
