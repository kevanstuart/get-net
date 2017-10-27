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
const cors = require('cors');


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
	 * Enable CORS options
	 */
	let corsOptions = {
  		optionsSuccessStatus: 200,
  		origin: config.baseUrl,
  		methods:'GET, POST'
	}

	/**
	 * Create a new pool
	 */
	pSql.createPool(config.db);

	/**
	 * Setting API Route URL's && Callbacks
	 */
	application.post('/api/getplans', cors(corsOptions), plansPostRoute);
	application.get('/api/getfilters', cors(corsOptions), filtersGetRoute);

	/**
	 * Set data endpoint to take POST data and return JSON to the frontend
	 */
    function plansPostRoute(req, res, next) 
    {

    	// Set limit parameter
		let dbLimit  = config.settings.page_limit;

		// Set offset parameter
		let dbOffset = (req.body.page -1) * dbLimit;

		// We need to set these as default
		let dbFilters = false;
		let dbSortBy  = false;

		// Change the default if filters exist
		if (req.body.filters != "false")
		{

			dbFilters = getDbFilters(req.body.filters);
			dbSortBy  = getDbSort(req.body.filters);

		}

    	// Get filtered results
    	let result = pSql.getPlans(dbLimit + 1, dbOffset, dbFilters, dbSortBy);

    	// Process promise result
    	result.then(function (data) 
    	{

    		// Check next set exists
    		let next = (data.rows.length > dbLimit) ? data.rows.pop() : false;

    		// Create return json
    		let toReturn = {
    			page  : req.body.page,
    			plans : data.rows,
    			next  : next
    		};

    		// Add filters if set
    		if (req.body.filters != "false")
			{
				toReturn.post = req.body.filters;
			}

    		// Send results to Frontend
    		res.json(toReturn);

    	});
    	
    }

    /**
     * Set endpoint to retrieve filter values from the database
     */
    function filtersGetRoute(req, res, next) 
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
    			types    : data.typesList.map(val => val.connection_type),
    			providers: data.providerList.map(val => val.provider),
    			downloads: data.downloadList.map(val => val.download),
    			prices   : [0, data.pricesList[0].max],
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
		if (post[item] == "All" || post[item] == 0)
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
