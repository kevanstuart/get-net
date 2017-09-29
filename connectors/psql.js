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
const connection = "postgres://localhost:5432/whichisp";
const pool       = new Pool({
    connectionString: connection
});


/**
 * The pool with emit an error on behalf of any idle clients it contains 
 * if a backend error or network partition happens
 */
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})


/**
 * Module Exports
 */
module.exports = 
{

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
            let result = await pool.query("SELECT * FROM net_plans ORDER BY price ASC");
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
    },


    /**
     * Function to handle the query without processing the result
     */
    getFilteredPlans: async function()
    {

        /**
         * Retrieve all items
         */
        let plans = await this.getAllPlans();

        

        //return promise;

    }

};
