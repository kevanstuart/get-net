/**
 * File: api.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 * 
 * Handles routing for the data api urls
 */


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
module.exports = function(application, config, db)
{
	'use strict';

	/**
	 * Set config into request
	 */
	application.use(function(req, res, next) 
	{
		db.connectToDb({
			database: config.db.database,
			password: config.db.password,
			host: config.db.host,
			user: config.db.user
		});
		next();
	});

	/**
	 * Set data endpoint to send JSON back to the frontend
	 */
	application.get('/data', function(req, res)
	{

		/**
		 * Get all results && push to json
		 */
		let result = db.getAllPlans();
		result.then(function (data) {
			res.json(data.rows);
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
    		 * Get filters & sort information from POST data
    		 */
    		let filters = getFilters(postData);
    		let sortBy  = postData.sort;


    		/**
    		 * Filter rows
    		 */
    		let filtered = filterResults(rows, postData, filters);

    		/**
    		 * Sort filtered rows
    		 */
    		let sorted = sortResults(filtered, postData, sortBy);

    		/**
    		 * Create return json
    		 */
    		let toReturn = {
    			plans: sorted,
    			filters: filters,
    			sort: sortBy
    		};

    		/**
    		 * Send filtered results to Frontend
    		 */
    		res.json(toReturn);

    	});
    	
    });
}


/**
 * Filter the results from the database with the provided POST data
 */
function filterResults(rows, postData, filters)
{

	/**
	 * Filter data into a new Array
	 */
	return rows.filter(function(row) 
	{

		/**
		 * Push filter results to new Array
		 */
		let pass = new Array();
		filters.forEach(function (item) {
			pass.push(processFilter(item, row, postData));
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
 * Sort the filtered rows with the provided POST data
 */
function sortResults(rows, postData)
{

	/**
	 * Return true if sorting value is "default"
	 */
	if (postData.sort === "default")
	{
		return rows;
	}

	/**
	 * Explode the Sorting POST data into sort && direction
	 */
	var sortObj = getSortAndDirection(postData.sort);
	var sortKey = Object.keys(sortObj)[0];
	var sortDir = sortObj[sortKey];

	/**
	 * Sort the rows
	 */
	return rows.sort(function(a, b) 
	{

		/**
		 * Set sane default return
		 */
		let result = 0;

		/**
		 * Process the sort based on key type and direction
		 */
		if (typeof a[sortKey] == 'string' && typeof b[sortKey] == 'string')
		{
			result = a[sortKey].localeCompare(b[sortKey])
		}
		else
		{
			result = (sortDir === "asc") ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
		}

		/**
		 * Return sort order
		 */
		return result;
		
	});

}


/**
 * Explode filters into column && operator in an Object
 */
function getFilters(postData)
{

	/**
	 * New filters array
	 */
	let filters = new Array();

	/**
	 * Loop through POST data to get filters
	 */
	for (var item in postData)
	{
		
		/**
		 * If filter isn't in the list, move on
		 */
		if (!filtersToCheck.includes(item))
		{
			continue;
		}

		/**
		 * If filter is set to "All", move on
		 */
		if (postData[item] == "all")
		{
			continue;
		}

		/**
		 * Split filter into filter name and filter operator
		 * and push to array
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

		filters.push(tmpObj);

	}

	/**
	 * Return filters to use
	 */
	return filters;

}


/**
 * Return boolean on comparing values to filters
 */
function processFilter(filter, element, postData)
{

	/**
	 * Get column and operator
	 */
	let column   = Object.keys(filter)[0];
	let operator = filter[column];

	/**
	 * Perform comparison operation and return
	 */
	let result = false;
	switch (operator)
	{
		case 'min':
			result = (element[column] >= postData[ operator + '_' + column ]);
			break;
		case 'max':
			result = (element[column] <= postData[ operator + '_' + column ]);
			break;
		default:
			result = (element[column] == postData[ column ]);
			break;
	}
	return result;

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
