chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		request = request || {};
		var cmd = request.cmd;
		var result = request.result;
		if(cmd == "CRAWL_DONE"){
			postCrawl(result);
		}
	}
);

function postCrawl(result){
	var crawlerId = "crawler-loadding";
	var loadingEl = document.getElementById(crawlerId);

	// remove old loadding div
	if(loadingEl){
		loadingEl.parentNode.removeChild(loadingEl);
	}

	// create new result ui
	var doneEl = document.createElement("div");
	doneEl.className = "done-crawl";
	doneEl.id = "done-crawl";
	doneEl.innerHTML = "<div class='main-content'><textarea id='done-crawl-value'></textarea></div> <div class='footer-toolbar'><button id='btn-cancel' class='btn-cancel'>Cancel</button><button id='btn-save' class='btn-save'>Save</button></div>";
	document.body.appendChild(doneEl);

	var textarea = document.getElementById("done-crawl-value");
	textarea.value = JSON.stringify(result);


	var btnCancel = document.getElementById("btn-cancel");
	btnCancel.onclick = function(){
		doneEl.parentNode.removeChild(doneEl);
	};

	var btnSave = document.getElementById("btn-save");
	btnSave.onclick = function(){
		doneEl.parentNode.removeChild(doneEl);
	};
}

if(typeof insertedCodes != "undefined" && !insertedCodes){
	insertedCodes = true;
}