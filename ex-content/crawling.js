
var insertedCodes = insertedCodes || false;


// reload loading div
var crawlerId = "crawler-loadding";
var loadingEl = document.getElementById(crawlerId);

// remove old loading div
if(loadingEl){
	loadingEl.parentNode.removeChild(loadingEl);
}

// create new loading div
loadingEl = document.createElement("div");
loadingEl.className = "loading-data";
loadingEl.id = crawlerId;
loadingEl.innerHTML = "Getting Data...";
document.body.appendChild(loadingEl);

// send body html
chrome.extension.sendMessage({cmd: "SEND_CRAWL_DOM", result: document.body.innerHTML});
