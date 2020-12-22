/**
 * File: data_routes.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 *
 * Handles routing for the frontend urls
 */

/* const model     = require('../connectors/model');
const sendgrid  = require('@sendgrid/mail');
const validator = require('validator');
const request   = require('axios'); */


/**
 * Set the Sendgrid API Key
 */
// sendgrid.setApiKey(process.env.SENDGRID_API_KEY);


/**
 * These are the elements in the contact form for validation
 */
// const contactElements = [ 'name', 'email', 'message' ];


/**
 * Frontend Routes function
 */
// module.exports = function(application, config)
// {
	// 'use strict';


	/**
	 * Initialize database connector
	 */
	// model.constructor(config);


	/**
	 * Route URL's
	 */
	/*
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
	); */


	/**
	 * Sanitize and Validate Contact Form input
	 */
	/* function contactPost(req, res, next)
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
	} */


	/**
	 * Sends an email (duh)
	 */
	/* function contactMail(req, res, next)
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
	} */


	/**
	 * Get dynamic filters to insert into index page
	 */
	/* function indexFilters(req, res, next)
	{
		let filters = model.getFilters();
		filters.then(data =>
		{
			res.locals.filters = data;
			next();
		}).catch(error => {
			console.error(error);
			next();
		});
	} */


	/**
	 * Set index route on POST
	 */
	/* function indexPost(req, res, next)
	{
		let pageNum = req.params.page || 1;
		let filters = req.body || false;

		res.locals.options = {
			filters: filters,
			page: pageNum
		};

		next();
	} */


	/**
	 * Final index page route for request and rendering
	 */
	/* function indexPage(req, res, next)
	{
		let plans = model.getPlans(res.locals.options);
		plans.then(data =>
		{
			let appData = (Object.keys(data).length > 0) ? data : {};
			appData.filters  = res.locals.filters;
			appData.base_url = config.baseUrl;
			appData.img_url  = config.imgUrl;

			if (appData.post)
			{
				req.session.filters = appData.post;
			}

			res.render('index', appData);
		});
	} */

// }
