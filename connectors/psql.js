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
     * Connect to the database by 
     * initializing a connection Pool 
     */
    connectToDb: function(db_config)
    {
        pool = new Pool(db_config);
    },

    /**
     * Get All Items from the database
     */
    getAllPlans: async function()
    {

        /**
         * Create client connection
         */
        const client = await pool.connect();
        try 
        {

            /**
             * Execute query && return
             */
            let result = await pool.query("SELECT * FROM net_plans WHERE active = true ORDER BY price ASC");
            return result;

        }
        catch(error)
        {

            /**
             * Catch Errors
             */
            console.error(error);
            return null;

        }
        finally
        {

            /**
             * Release client to the pool
             */
            client.release();

        }
    }

};
