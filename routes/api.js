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

		// Connection details from config
		let dbParameters = {
			database: config.db.database,
			password: config.db.password,
			host: config.db.host,
			user: config.db.user
		};

		// Connect to Database
		db.connectToDb(dbParameters);

		// Next function
		next();

	});

	/**
	 * Set data endpoint to send JSON back to the frontend
	 */
	application.get('/data', function(req, res)
	{

		// Get all results
		let result = db.getPlans();

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

    });

	/**
	 * Set data endpoint to take POST data and return JSON to the frontend
	 */
    application.post('/data', function(req, res) 
    {

    	// Get post data from body
    	let postData = req.body;
    	let filters  = getDbFilters(postData);
    	let sortBy   = getDbSort(postData);

    	// Get filtered results
    	let result = db.getPlans(filters, sortBy);

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
    	
    });
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
			result = (sortDir === "asc") ? b[sortKey].localeCompare(a[sortKey]) : 
					  					   a[sortKey].localeCompare(b[sortKey]);
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


function paginateResults(rows, options)
{

	/**
	 * 1. Nr of Pages
     * 2. Prev / Next Links
     * 3. Paginated Rows
     */
    let toReturn = {
    	pages : 1,
    	prev  : false,
    	next  : false,
    	rows  : rows
    }
    
    /**
     * Return default object if number of rows
     * is less or equal to the page limit
     */
    if (rows <= options.limit)
    {
    	return toReturn;
    }

    /**
     * Calculate number of pages
     */
    toReturn.pages = Math.ceil(rows.length / options.limit);

    /**
     * Get next link
     */
    toReturn.next = getNextLink(options.page, toReturn.pages);

    /**
     * Get previous link
     */
    toReturn.prev = getPrevLink(options.page, toReturn.pages);

    /**
     * Calculate rows
     */
    toReturn.rows = getPaginatedRows(rows, options.page, options.limit);

    /**
     * Return the new object
     */
    return toReturn;

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
		if (postData[item] == "all" || postData[item] == 0)
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


/**
 * [getPrevLink description]
 */
function getPrevLink(page, totalPages)
{

	/**
	 * First page, no previous link
	 */
	if (parseInt(page) === 1)
	{
		return false;
	}

	/**
	 * Decrement page
	 */
	if (page <= totalPages)
	{
		page--;
		return '/' + page;
	}

}


/**
 * [getNextLink description]
 */
function getNextLink(page, totalPages)
{

	/**
	 * Last page, no next link
	 */
	if (page == totalPages)
	{
		return false;
	}

	/**
	 * Increment page
	 */
	if (page >= 1)
	{
		page++;
		return '/' + page;
	}

}


/**
 * [getPaginatedRows description]
 */
function getPaginatedRows(rows, page, pageLimit)
{	

	if (page == 1)
	{
		return rows.slice(0,pageLimit);
	}

	let startSlice = (page-1) * pageLimit;
	let endSlice   = startSlice + pageLimit;

	return rows.slice(startSlice, endSlice);

}
