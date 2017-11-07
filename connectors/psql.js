/**
 * File: data.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 *
 * Database functions file for the WhichISP application
 */


const urlLib = require('url');


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
    createPool: function(config)
    {

        let dbSettings = config.db;
        if (config.environment == "production")
        {
            
            let params = urlLib.parse(process.env.DATABASE_URL);
            let auth   = params.auth.split(':');

            dbSettings = {
                "database": params.pathname.split('/')[1],
                "host"    : params.hostname,
                "port"    : params.port,
                "password": auth[1],
                "user"    : auth[0]
            };

        }
        // Create DB Pool
        pool = new pgPool(dbSettings);

    },

    /**
     * Get the filters
     */
    getFilters: async function()
    {

        // Create client connection
        var client = await pool.connect();
        try
        {

            // Create queries
            let filterQueries = {
                types    : buildFilterQuery("connection_type"),
                providers: buildFilterQuery("provider"),
                speeds   : buildFilterQuery("speed")
                //prices   : buildFilterQuery("price")
            };
            
            // Process queries
            let providers = await client.query(filterQueries.providers);
            let speeds    = await client.query(filterQueries.speeds);
            let types     = await client.query(filterQueries.types);

            //let prices    = await client.query(filterQueries.prices);
            //pricesList  : prices.rows,
            
            // Return data
            return {
                providerList: providers.rows,
                speedsList  : speeds.rows,
                typesList   : types.rows
            }

        }
        catch (error)
        {

            // Catch Errors
            console.log(error);

            // Return null
            return false;

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

            console.log(query);

            // Execute query
            let result = await client.query(query);

            // Return result
            return result;

        }
        catch(error)
        {

            // Catch Errors
            console.log(error);

            // Return false
            return false;

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
    //let base = "SELECT distinct(filter) FROM net_plans WHERE active=true ORDER BY filter ASC";
    let base = "SELECT distinct(filter) FROM plans WHERE active=true ORDER BY filter ASC";
    

    // Basic check that the filter exists
    if (["speed", "provider", "connection_type"].includes(filter))
    {

        // Replace placeholder with provided filter variable
        return base.replace(/filter/gi, filter);

    }

    // Price filter needs a different query
    /*if (filter === 'price')
    {
        return "SELECT MAX(price) AS max FROM plans WHERE active= true";
    }*/

    return false;

}


/**
 * Build the Query based on filters and sorting, setting a sane default
 */
function buildQuery(limit = false, offset = false, filters = false, sort = false)
{

    // Basic query format
    let query = "SELECT * FROM plans WHERE active = true";

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
