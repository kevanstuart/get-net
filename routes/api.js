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
		result.then(function (data) 
		{

			/**
    		 * Init rows array
    		 */
    		let rows = data.rows;
    		
    		/**
    		 * Configure page options
    		 */
    		/*let pageOptions = {
    			page : req.params.page,
    			limit: config.settings.page_limit
    		};
			let paginated = paginateResults(rows, pageOptions);*/

			/**
    		 * Create return json
    		 */
    		let toReturn = {
    			/*pagination: paginated,*/
    			plans: rows,
    			config: config
    		};

			/**
    		 * Send results to Frontend
    		 */
    		res.json(toReturn);
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
    		 * Configure page options
    		 */
    		/*let pageOptions = {
    			page : req.params.page,
    			limit: config.settings.page_limit
    		};
			let paginated = paginateResults(sorted, pageOptions);*/

    		/**
    		 * Create return json
    		 */
    		let toReturn = {
    			/*pagination: paginated,*/
    			plans : sorted,
    			config: config,
    			data  : postData
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
