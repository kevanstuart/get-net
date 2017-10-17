/**
 * File: api.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 * 
 * Handles routing for the data api urls
 */


/**
 * Module / File Requires
 */
const pSql = require('../connectors/psql');


/**
 * Filters to check POST data against
 */
var filtersToCheck = ['max_price', 'min_download', 'provider', 'connection_type'];


/**
 * Sort Criteria to check POSt data against
 */
var sortByToCheck  = ['download', 'upload', 'price'];


/**
 * Data API Routes function
 */
module.exports = function(application, config)
{

	'use strict';

	/**
	 * Create a new pool
	 */
	pSql.createPool(config.db);

	/**
	 * Setting API Route URL's && Callbacks
	 */
	application.get('/api/getplans', plansGetRoute);
	application.post('/api/getplans', plansPostRoute);
	application.get('/api/getfilters', filtersGetRoute);

	/**
	 * Set data endpoint to send JSON back to the frontend
	 */
	function plansGetRoute(req, res)
	{

		// Get all results
		let result = pSql.getPlans();

		// Process promise result
		result.then(function (data) 
		{

			// Init rows array
    		let rows = data.rows;

			// Create return json
    		let toReturn = {
    			config: config,
    			plans : rows
    		};

			// Send results to Frontend
    		res.json(toReturn);

		});

    }

	/**
	 * Set data endpoint to take POST data and return JSON to the frontend
	 */
    function plansPostRoute(req, res) 
    {

    	// Get post data from body
    	let postData = req.body;
    	let filters  = getDbFilters(postData);
    	let sortBy   = getDbSort(postData);

    	// Get filtered results
    	let result = pSql.getPlans(filters, sortBy);

    	// Process promise result
    	result.then(function (data) 
    	{

    		// Init rows array
    		let rows = data.rows;

    		// Create return json
    		let toReturn = {
    			data  : postData,
    			config: config,
    			plans : rows,
    		};

    		// Send results to Frontend
    		res.json(toReturn);

    	});
    	
    }

    /**
     * Set endpoint to retrieve filter values from the database
     */
    function filtersGetRoute(req, res) 
    {

    	// Get sort list
    	let sort = getSortData();

    	// Get filters results
    	let result = pSql.getFilters();

    	// Process promise result
    	result.then(function(data) 
    	{

    		// Format return
    		let toReturn = {
    			providers: data.providerList.map(val => val.provider),
    			downloads: data.downloadList.map(val => val.download),
    			types    : data.typesList.map(val => val.connection_type),
    			prices   : [0, 200],
    			sort     : sort
    		};

    		// Add "ALL" to certain filters
    		toReturn.providers.unshift("All");
    		toReturn.types.unshift("All");

    		// Send results to Frontend
    		res.json(toReturn);
    	});

    }

}


/**
 * Get sort dropdown
 */
function getSortData()
{

	// Return data
	return {
		default: "Default",
		download_desc: "Fastest Download Speed",
		upload_desc: "Fastest Upload Speed",
		price_asc: "Price (Low to High)",
		price_desc: "Price (High to Low)"
	};

}


/**
 * Get filters for the Database Query
 */
function getDbFilters(post)
{

	// New filters array
	let filters = new Object();

	// Loop through POST data to get filters
	for (var item in post)
	{

		// If filter isn't in the list, move on
		if (!filtersToCheck.includes(item))
		{
			continue;
		}

		// If filter is set to "All", move on
		if (post[item] == "all" || post[item] == 0)
		{
			continue;
		}

		// Min, Max or Equals filter?
		if (item.includes("max") || item.includes("min"))
		{
			
			// Split and get filter operation
			let tmpArr = item.split("_");
			filters[ tmpArr[1] ] = minMaxEqualsFilter(tmpArr[0], post[item]);

		}
		else
		{

			// Get filter operation
			filters[ item ] = minMaxEqualsFilter("equals", post[item])

		}

	}

	// Return filters to use
	return filters;
}


/**
 * Min/Max/Equals function returns the value of
 * a filter primed for database query creation
 */
function minMaxEqualsFilter(operator, value)
{

	// Determine string or integer and add quotes
	let tmpVal = (isNaN(value)) ? "'" + value + "'" : parseInt(value);

	// Init filter variable
	let filter = false;

	// Determine correct operators for database filter
	switch (operator)
	{

		case "min":
			filter = ">= " + tmpVal;
			break;
		case "max":
			filter = "<= " + tmpVal;
			break;
		case "equals":
			filter = "= " + tmpVal
			break;

	}

	// Return filter value
	return filter;

}


/**
 * Get sort by string for Database Query
 */
function getDbSort(post)
{

	// Default value
	let sortBy = false;

	// Return false if sorting value is "default"
	if (post.sort === "default")
	{
		return sortBy;
	}

	// Split and reassemble in correct format
	tmpArr = post.sort.split("_");
	sortBy = tmpArr[0] + " " + tmpArr[1].toUpperCase();

	// Return sort by string
	return sortBy;

}
