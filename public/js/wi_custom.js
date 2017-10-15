/**
 * File: wi_custom.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 * 
 * Handles custom frontend code for the project
 */


// Run slider functions
var maxPriceSlider    = setMaxPriceSlider();
var minDownloadSlider = setMinDownloadSlider();


/**
 * Reset the sliders
 */
function resetSliders()
{

    console.log(maxPriceSlider);
    console.log("Reset");

    minDownloadSlider.reset();
    maxPriceSlider.reset();

    // Return true
    return true;
}

/**
 * Max Price Slider function
 */
function setMaxPriceSlider()
{

    // Get the Max Price Element
    let maxPriceEl = document.getElementById('max_price');

    // Set the Max Price Slider options
    let priceSlideOptions = {
        force_edges:true,
        max_postfix:"+",
        prefix:"$",
        grid:true,
        max:200,
        step:25,
        from:maxPriceEl.dataset.value || 200,
        min:0
    };

    // Initialize the Max Price Slider and set the variable
    $("#max_price").ionRangeSlider(priceSlideOptions);
    return $("#max_price").data("ionRangeSlider");
}


/**
 * Min Download Slider function
 */
function setMinDownloadSlider()
{

    // Get the Min Download Element
    let minDownloadEl = document.getElementById('min_download');

    // Create Min Download Values array (strings, not integers)
    let minDownloadValues = [ "1mbps", "3mbps", "5mbps", "7mbps", "10mbps" ];

    // Set the Min Download Slider options
    let downloadSlideOptions = {
        values:minDownloadValues,
        force_edges:true,
        max_postfix:"+",
        grid_snap:true,
        grid:true,
        from:minDownloadValues.indexOf(minDownloadEl.dataset.value) || 0
    };

    // Initialize the Min Download Slider and set the variable
    $("#min_download").ionRangeSlider(downloadSlideOptions);
    return $("#min_download").data("ionRangeSlider");

}


