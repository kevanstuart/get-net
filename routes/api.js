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
var filtersToCheck = ['max_price', 'min_speed', 'provider', 'connection_type'];


/**
 * Sort Criteria to check POSt data against
 */
var sortByToCheck  = ['speed', 'upload', 'price'];


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
	pSql.createPool(config);

	/**
	 * Setting API Route URL's && Callbacks
	 */
	application.post('/api/getplans', 
		cors(corsOptions), 
		plansPost
	);

	application.get('/api/getfilters', 
		cors(corsOptions), 
		filtersGet
	);

	/**
	 * Set data endpoint to take POST data and return JSON to the frontend
	 */
    function plansPost(req, res, next) 
    {
		let dbLimit   = config.data.page_limit;
		let dbOffset  = (req.body.page -1) * dbLimit;
		let dbFilters = false;
		let dbSortBy  = false;

		if (req.body.filters != "false")
		{
			dbFilters = getDbFilters(req.body.filters, config.data);
			dbSortBy  = getDbSort(req.body.filters);
		}

    	let result = pSql.getPlans(dbLimit + 1, dbOffset, dbFilters, dbSortBy);

    	result.then(function (data) 
    	{

    		let next = (data.rows.length > dbLimit) ? data.rows.pop() : false;
    		let toReturn = {
    			page  : req.body.page,
    			plans : data.rows,
    			next  : next
    		};

    		if (req.body.filters != "false")
			{
				toReturn.post = req.body.filters;
			}

    		res.json(toReturn);
    	});
    }

    /**
     * Set endpoint to retrieve filter values from the database
     */
    function filtersGet(req, res, next) 
    {
    	let sort = getSortData();
    	let result = pSql.getFilters();

    	result.then(function(data) 
    	{
    		let toReturn = {
    			types    : data.typesList.map(val => val.connection_type),
    			providers: data.providerList.map(val => val.provider),
    			speeds   : data.speedsList.map(val => val.speed),
    			prices   : [0, config.data.max_price],
    			sort     : sort
    		};

    		toReturn.providers.unshift("All");
    		toReturn.types.unshift("All");

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
		default   : "Default",
		speed_desc: "Fastest Speed First",
		speed_asc : "Slowest Speed First",
		price_asc : "Price (Low to High)",
		price_desc: "Price (High to Low)"
	};
}


/**
 * Get filters for the Database Query
 */
function getDbFilters(post, config)
{
	let filters = new Object();

	for (var item in post)
	{
		if (!filtersToCheck.includes(item))
		{
			continue;
		}

		if (post[item] == "All" || post[item] == 0)
		{
			continue;
		}

		if (item == "max_price" && post[item] == config.max_price)
		{
			continue;
		}

		if (item.includes("max") || item.includes("min"))
		{
			let tmpArr = item.split("_");
			filters[ tmpArr[1] ] = minMaxEqualsFilter(tmpArr[0], post[item]);
		}
		else
		{
			filters[ item ] = minMaxEqualsFilter("equals", post[item])
		}

	}

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
	let filter = false;

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

	return filter;
}


/**
 * Get sort by string for Database Query
 */
function getDbSort(post)
{
	let sortBy = false;

	if (post.sort === "default")
	{
		return sortBy;
	}

	tmpArr = post.sort.split("_");
	sortBy = tmpArr[0] + " " + tmpArr[1].toUpperCase();

	return sortBy;
}
