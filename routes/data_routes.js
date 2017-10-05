/**
 * File: data_routes.js
 * Author: Kevan Stuart (kevan@tapendium.com)
 * 
 * Handles routing for the data api urls
 */


/**
 * Require database connector
 */
const db = require('../connectors/psql');


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
		let result = db.getAllPlans();
		result.then(function (then) {
			res.json(then.rows);
		});
    });

	/**
	 * Set data endpoint to take POST data and return JSON to the frontend
	 */
    application.post('/data', function(req, res) 
    {

    	/**
    	 * Get post data from body
    	 */
    	let postData = req.body;

    	/**
    	 * Get data and handle promise
    	 */
    	let result = db.getAllPlans();
    	result.then(function (data) 
    	{

    		/**
    		 * Init rows array
    		 */
    		let rows = data.rows;

    		/**
    		 * Filter rows
    		 */
    		let filtered = filterResults(rows, postData);

    		/**
    		 * Sort filtered rows
    		 */
    		let sorted = sortResults(filtered, postData);

    		/**
    		 * Send filtered results to Frontend
    		 */
    		res.json(sorted);

    	});
    	
    });
}


/**
 * Filter the results from the database with the provided POST data
 */
function filterResults(rows, postData)
{

	/**
	 * Set the filters to loop through
	 */
	let filters = getRequestedFilters(Object.keys(postData));

	/**
	 * Filter rows && return new Array
	 */
	return rows.filter(function(row) 
	{

		/**
		 * Push filter results to new Array
		 */
		let pass = new Array();
		filters.forEach(function (item) {
			pass.push(getFilterComparisons(item, row, postData));
		});

		/**
		 * Return false if a filter fails
		 */
		if (pass.includes(false))
		{
			return false;
		}
		return true;

	});

}


/**
 * Explode filters into column && operator in an Object
 */
function getRequestedFilters(filters)
{

	/**
	 * Loop through filters
	 */
	filters.forEach(function(item, index) 
	{

		/**
		 * Check item is a valid filter
		 */
		if (!filtersToCheck.includes(item))
		{
			return;
		}

		/**
		 * Create object and split item into array
		 */
		let tmpObj = new Object();
		if (item.includes('max') || item.includes('min'))
		{
			let tmpArr = item.split('_');	
			tmpObj[ tmpArr[1] ] = tmpArr[0];
		}
		else
		{
			tmpObj[ item ] = "equals";
		}

		/**
		 * Populate Object
		 */
		filters[index] = tmpObj;

	});

	/**
	 * Return exploded filters
	 */
	return filters;

}


/**
 * Return boolean on comparing values to filters
 */
function getFilterComparisons(filter, element, postData)
{

	/**
	 * Get column and operator
	 */
	let column   = Object.keys(filter)[0];
	let operator = filter[column];

	/**
	 * Perform comparison operation and return
	 */
	if (operator === 'min')
	{
		return element[column] >= postData[ operator + '_' + column ];
	}
	else if (operator === 'max')
	{
		return element[column] <= postData[ operator + '_' + column ];
	}

}


/**
 * Sort the filtered rows with the provided POST data
 */
function sortResults(rows, postData)
{

	/**
	 * Explode the Sorting POST data into sort && direction
	 */
	var sortObj = getSortAndDirection(postData.sort);
	var sortKey = Object.keys(sortObj)[0];
	var sortDir = sortObj[sortKey];

	/**
	 * Sort the rows
	 */
	rows.sort(function(a, b) 
	{

		/**
		 * Change sort calculation for directionality
		 */
		if (sortDir == "desc")
		{
			return b[sortKey] - a[sortKey];
		}
		else if (sortDir == "asc")
		{
			return a[sortKey] - b[sortKey];
		}
		
	});

	/**
	 * Return sorted rows
	 */
	return rows;

}


/**
 * Explode the Sorting POST data into sort && direction
 */
function getSortAndDirection(item)
{

	/**
	 * Create object and split item into array
	 */
	let tmpObj = new Object();
	let tmpArr = item.split('_');

	/**
	 * Populate Object && return
	 */
	tmpObj[ tmpArr[0] ] = tmpArr[1];
	return tmpObj;

}
