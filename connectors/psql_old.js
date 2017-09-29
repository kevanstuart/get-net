/**
 * File: data.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 *
 * Database functions file for the WhichISP application
 */


/**
 * Require libraries
 */
const { Pool }  = require('pg');
/*const nodeCache = require('node-cache');*/


/**
 * Configure Cache
 */
/*const cache     = new nodeCache();
const cacheKey = 'all-items';
const cacheTtl = 1000;*/


/**
 * Configure PSQL
 */
const connection = "postgres://localhost:5432/whichisp";
const pool       = new Pool({
    connectionString: connection
});

/**
 * Module Exports
 */
module.exports = {


    /**
     * Get All Items
     */
    getAll: function()
    {}


    /**
     * Get all items from the Net Plans table
     */
    getAllItems: function(page)
    {

        /**
         * Check request against the cache
         */
        cache.get(cacheKey, function(err, data)
        {

            /**
             * No error and cache exists
             */
            if (!err && data != undefined)
            {

                /**
                 * Process to render the page
                 */
                processAndRender(data, true);

            }
            else
            {

                /**
                 * Handle query via JS Promise
                 */
                let result = module.exports.getAllItemsQuery();
                result.then(processAndRender).catch(processError);

            }
        });

        /**
         * Process the query result and render the page
         */
        function processAndRender(results, isCache=false)
        {

            /**
             * Add results to cache
             */
            if (!isCache)
            {
                let didCache = cache.set(cacheKey, results, 300);
                if (didCache)
                {
                    console.log("Cache Saved");
                }
                else
                {
                    console.log("Hey - no cache saved");
                }
            }

            /**
             * Add results to display variables
             */
            let toRender = {
                'plans': results.rows
            };

            /**
             * Render the page
             */
            page.render('index', toRender);

        }

        /**
         * Process the query error
         */
        function processError(error)
        {
            // Log error
            console.error(error.stack);
            page.render('error');
        }

    },


    /**
     * Function to handle the query without processing the result
     */
    getAllItemsQuery: function()
    {

        /**
         * Handle the query and return a promise
         */
        let result = pool.query('SELECT * FROM net_plans ORDER BY price ASC');
        return result;

    }

};
