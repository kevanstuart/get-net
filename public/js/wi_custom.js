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
    var sliderOptions = {
        force_edges:true,
        max_postfix:"+",
        grid:true
    };

    // Init sliders
    $("#min_download").ionRangeSlider( sliderOptions );
    $("#max_price").ionRangeSlider( sliderOptions );

    // Custom configuration
    var minDownload = $("#min_download").data("ionRangeSlider");
    minDownload.update({ grid_snap: true, postfix: 'mbps' });

    // Custom configuration
    var maxPrice = $("#max_price").data("ionRangeSlider");
    maxPrice.update({ prefix: "$" });

}
