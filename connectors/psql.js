/**
 * File: data.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 *
 * Database functions file for the WhichISP application
 */


/**
 * Require Node Postgres Pooling
 */
const pgPool = require('pg').Pool;


/**
 * Empty variable to hold Pool
 */
var pool;


/**
 * Module Exports
 */
module.exports = 
{

    /**
     * Create a new pool
     */
    createPool: function(dbSettings)
    {

        // Create DB Pool
        pool = new pgPool(dbSettings);

    },

    /**
     * Get the filters
     * @return {[type]} [description]
     */
    getFilters: async function()
    {

        // Create client connection
        var client = await pool.connect();
        try
        {

            // Create queries
            let filterQueries = {
                downloads: buildFilterQuery("download"),
                providers: buildFilterQuery("provider"),
                types    : buildFilterQuery("connection_type"),
            };
            
            // Process queries
            let providers = await client.query(filterQueries.providers);
            let downloads = await client.query(filterQueries.downloads);
            let types     = await client.query(filterQueries.types);
            
            // Return data
            return {
                providerList: providers.rows,
                downloadList: downloads.rows,
                typesList   : types.rows
            }

        }
        catch (error)
        {

            // Catch Errors
            console.log(error);

            // Return null
            return null;

        }
        finally
        {

            // Release client to the pool
            client.release();

        }

    },

    /**
     * Get All Items from the database
     */
    getPlans: async function(limit = false, offset = false, filters = false, sort = false)
    {

        // Create client connection
        var client = await pool.connect();
        try 
        {

            // Create query
            let query = buildQuery(limit, offset, filters, sort);

            // Execute query
            let result = await client.query(query);

            // Return result
            return result;

        }
        catch(error)
        {

            // Catch Errors
            console.log(error);

            // Return null
            return null;

        }
        finally
        {

            // Release client to the pool
            client.release();

        }
    }

};


/**
 * Build the filter query based on a provided column name
 */
function buildFilterQuery(filter)
{

    // Setting a base query
    let base = "SELECT distinct(filter) FROM net_plans WHERE active=true ORDER BY filter ASC";

    // Basic check that the filter exists
    if (["download", "provider", "connection_type"].includes(filter))
    {

        // Replace placeholder with provided filter variable
        return base.replace(/filter/gi, filter);

    }

    return false;

}


/**
 * Build the Query based on filters and sorting, setting a sane default
 */
function buildQuery(limit = false, offset = false, filters = false, sort = false)
{

    // Basic query format
    let query = "SELECT plan_id, provider_logo, provider, plan, download, upload, connection_type, "
                + "price, link FROM net_plans WHERE active = true";

    // Add any filters
    if (filters)
    {

        // Loop through filters
        Object.keys(filters).forEach(function (key, index, array)
        {

            // Prepend AND to filters
            if (index == 0 || index < array.length)
            {
                query += " AND ";
            }

            // Add filter to query
            query += key + " " + filters[key];
            
        });

    }

    // Add sorting for ORDER BY
    if (sort)
    {
        query += " ORDER BY " + sort
    }
    else
    {
        query += " ORDER BY price ASC, plan_id ASC";
    }

    // Add limit to query
    if (limit)
    {
        query += " LIMIT " + limit;
    }

    // I know offset pagination is worse that keyset
    // however I don't have time to implement keyset
    if (offset)
    {
        query += " OFFSET " + offset;
    }

    // Return query
    return query;

}
