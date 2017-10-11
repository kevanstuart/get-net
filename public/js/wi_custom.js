/**
 * File: wi_custom.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 * 
 * Handles custom frontend code for the project
 */

let maxPriceEl = document.getElementById('max_price');
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
$("#max_price").ionRangeSlider(priceSlideOptions);

let minDownloadEl = document.getElementById('min_download');
let minDownloadValues = [ "1mbps", "3mbps", "5mbps", "7mbps", "10mbps" ];
let downloadSlideOptions = {
	values:minDownloadValues,
	force_edges:true,
	max_postfix:"+",
	grid_snap:true,
	grid:true,
	from:minDownloadValues.indexOf(minDownloadEl.dataset.value) || 0
};
$("#min_download").ionRangeSlider(downloadSlideOptions);