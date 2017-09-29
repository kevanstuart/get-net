/**
 * File: data_routes.js
 * Author: Kevan Stuart (kevan@tapendium.com)
 * 
 * Handles routing for the data api urls
 */

const db = require('../connectors/psql');


module.exports = function(application, config)
{
	'use strict';

	/**
	 * Set config into request
	 */
	application.use(function(req, res, next) 
	{
		req.config = config;
		next();
	});


	/**
	 * Set data endpoint to send JSON back to the frontend
	 */
	application.get('/data', function(req, res)
	{
		let result = db.getFilteredPlans();
		/*result.then(function (then) {
			res.json(then.rows);
		});*/
    });
}