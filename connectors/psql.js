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
                downloads: "SELECT distinct(download) FROM net_plans WHERE active = true ORDER BY download ASC",
                providers: "SELECT distinct(provider) FROM net_plans WHERE active = true ORDER BY provider ASC",
                types    : "SELECT distinct(connection_type) FROM net_plans WHERE active = true ORDER BY connection_type ASC"
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
    getPlans: async function(filters = false, sort = false)
    {

        // Create client connection
        var client = await pool.connect();
        try 
        {

            // Create query
            let query = buildQuery(filters, sort);

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
 * Build the Query based on filters and sorting, setting a sane default
 */
function buildQuery(filters = false, sort = false)
{

    // Basic query format
    let query = "SELECT provider_logo, provider, plan, download, upload, connection_type, price, link"
        + " FROM net_plans WHERE active = true";

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
        query += " ORDER BY price ASC";
    }

    // Return query
    return query;

}
