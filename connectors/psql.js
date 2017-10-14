/**
 * File: data.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 *
 * Database functions file for the WhichISP application
 */


/**
 * Require libraries
 */
const Pool  = require('pg').Pool;


/**
 * Configure PSQL
 */
var pool;


/**
 * Module Exports
 */
module.exports = 
{

    /**
     * Connect to the database by initializing a 
     * connection Pool 
     */
    connectToDb: function(db_config)
    {

        // Create a pool from the database config
        pool = new Pool(db_config);

    },

    /**
     * Get All Items from the database
     */
    getPlans: async function(filters = false, sort = false)
    {

        // Create client connection
        const client = await pool.connect();
        try 
        {

            // Create query
            let query = buildQuery(filters, sort);

            // Execute query && return
            let result = await pool.query(query);
            return result;

        }
        catch(error)
        {

            // Catch Errors
            console.log(error);
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

    // Add sorting
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
