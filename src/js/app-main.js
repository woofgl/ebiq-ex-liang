
// init html
$(function(){
	$(".do-get-data").click(function(){
		// var bg = chrome.extension.getBackgroundPage();
		// bg.crawGlassdoorInterviews();
		crawGlassdoorInterviews();
	});
});

function crawGlassdoorInterviews(){
	var url = "https://www.glassdoor.com/Interview/Apple-Interview-Questions-E1138.htm";
	chrome.tabs.create({url:url, selected:false}, function(tab){
		chrome.tabs.executeScript(tab.id, {file: "js-content/crawler.js"});
	});
}


chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		var $doc = $(request);
		console.log($doc.find(".interviewStatsBody .toggleable .row:nth-child(2) .notranslate").html());
	}
);