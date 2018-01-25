/**
 * File: api.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 * 
 * Handles routing for the data api urls
 */

const db = require('../connectors/psql');

var filtersToCheck = ['max_price', 'min_speed', 'provider', 'connection_type'];
var sortByToCheck  = ['speed', 'upload', 'price'];
var config;


/**
 * [exports description]
 */
module.exports =
{

	constructor: function(config)
	{
		this.setConfig(config);
		this.startDb();
	},

	setConfig: function(config)
	{
		this.config = config;
		return this;
	},

	startDb: function()
	{
		db.createPool(this.config);
	},

	getFilters: function()
	{
		let results = db
			.getFilters()
			.then(data => 
			{
	    		return formatFiltersForDisplay(data, this.config);
			});

		return results;
	},

	getPlans: function(parameters)
	{
		let dbLimit   = this.config.data.page_limit;
		let dbOffset  = (parameters.page-1) * dbLimit;
		let dbFilters = false;
		let dbSortBy  = false;

		if (parameters.filters !== false)
		{
			dbFilters = getDbFilters(parameters.filters, this.config.data);
			dbSortBy  = getDbSort(parameters.filters);
		}

		let result = db
			.getPlans(dbLimit + 1, dbOffset, dbFilters, dbSortBy)
			.then(data => {
				return formatPlansForDisplay(data, dbLimit, parameters);
			});

		return result;
	}
}


/**
 * Format filters into correct object to display
 */
function formatFiltersForDisplay(data, config)
{
	let sort = getSortValues();
	let filters = {
		types    : data.typesList.map(val => val.connection_type),
		providers: data.providerList.map(val => val.provider),
		speeds   : data.speedsList.map(val => val.speed),
		prices   : [0, config.data.max_price],
		sort     : sort
	};

	filters.providers.unshift("All");
	filters.types.unshift("All");

	return filters;
}


/**
 * Format plans into correct object to display
 */
function formatPlansForDisplay(data, limit, parameters)
{
	let next = (data.rows.length > limit) ? data.rows.pop() : false;
	let plans = {
		page  : parameters.page,
		plans : data.rows,
		next  : next
	};

	if (parameters.filters !== false)
	{
		plans.post = parameters.filters;
	}

	return plans;
}


/**
 * Get hardcoded sort parameters
 */
function getSortValues()
{
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
		if ((!filtersToCheck.includes(item)) ||
			(post[item] == "All" || post[item] == 0) ||
			(item == "max_price" && post[item] == config.max_price))
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
