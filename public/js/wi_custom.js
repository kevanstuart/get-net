/**
 * File: wi_custom.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 * 
 * Handles custom frontend code for the project
 */


/**
 * Setup basic slider configuration
 */
basicSliderSetup();
function basicSliderSetup()
{

    // Generic options
    let sliderOptions = {
        force_edges:true,
        max_postfix:"+",
        grid:true
    };

    // Init sliders
    $("#min_download").ionRangeSlider( sliderOptions );
    $("#max_price").ionRangeSlider( sliderOptions );

    // Custom configuration
    let minDownload = $("#minsdownload").data("ionRangeSlider");
    minDownload.update({ grid_snap: true });

    // Custom configuration
    let maxPrice = $("#max_price").data("ionRangeSlider");
    maxPrice.update({ prefix: "$" });

}



/**
 * Reset the sliders
 */
function resetSliders()
{}
