
// init html
$(function(){
	$(".do-get-data").click(function(){
		// var bg = chrome.extension.getBackgroundPage();
		// bg.crawGlassdoorInterviews();
		crawGlassdoorInterviews();
	});

	loadCompanies();
});

function loadCompanies(){
	var host = "http://localhost:8080";
	var glassdoorUrl = "https://www.glassdoor.com/Interview";
	return $.ajax({
		url: host + "/getCompanyInterviewsPages",
		dataType: "json",
		type: "get"
	}).done(function(data){
		var results = data.result || [];
		var $con = $(".glassdoors").empty();
		for(var i = 0; i < results.length; i++){
			var obj = results[i];
			var url = "";
			if(obj.glassdoor){
				url = glassdoorUrl+"/"+obj.glassdoor+".htm";
			}
			var $item = $("<div class='glassdoor-item' data-url='"+url+"'>"+obj.company+"<a href="+url+" target='view_window'>next >> </a></div>");
			$con.append($item);
		}
	});
}

function crawGlassdoorInterviews(){
	chrome.tabs.getSelected(null, function(tab){
		chrome.tabs.executeScript(tab.id, {file: "ex-content/crawlStart.js"});
	});

	// var url = "https://www.glassdoor.com/Interview/Apple-Interview-Questions-E1138.htm";
	// chrome.tabs.create({url:url, selected:false}, function(tab){
	// 	chrome.tabs.executeScript(tab.id, {file: "js-content/crawler.js"});
	// });
}


chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		request = request || {};
		var tab = sender.tab;
		var cmd = request.cmd;
		var result = request.result;
		if(cmd == "CHECK_INSERT"){
			doCrawl(result, tab);
		}else if(cmd == "SEND_CRAWL_DOM"){
			var parseResult = parse(result);
			chrome.tabs.sendMessage(tab.id,{cmd:"CRAWL_DONE", result: parseResult}); 
		}
	}
);

function doCrawl(inserted, tab){
	var dfd = $.Deferred();
	if(!inserted){
		var cssDfd = $.Deferred();
		chrome.tabs.insertCSS(tab.id, {file: "ex-content/main.css"}, function(){
			cssDfd.resolve();
		});

		var jsDfd = $.Deferred();
		chrome.tabs.executeScript(tab.id, {file: "ex-content/main.js"}, function(){
			jsDfd.resolve();
		});

		$.when(cssDfd, jsDfd).done(function(){
			dfd.resolve(true);
		})
	}else{
		dfd.resolve(false);
	}

	dfd.done(function(result){
		chrome.tabs.executeScript(tab.id, {file: "ex-content/crawling.js"});
	});
}


function parse(result){
	var $doc = $(result);
	// for starts
	var $allStats = $doc.find(".interviewStats #AllStats");
	var $experience = $allStats.find(".experience");
	var $obtained = $allStats.find(".obtained");
	var $difficulty = $allStats.find(".difficulty");

	// for Interview Experience
	var experience = [];
	$experience.find(".tbl.dataTbl .row:gt(0)").each(function(idx, row){
		var $row = $(row);
		var label = $row.find(".heading .minor").html();
		var value = $row.find(".alignRt .notranslate").html();
		experience.push({"label":label, "value": value});
	});

	// for Getting an Interview
	var obtained = [];
	$obtained.find(".tbl.dataTbl .row:gt(0)").each(function(idx, row){
		var $row = $(row);
		var label = $row.find(".heading .minor").html();
		var value = $row.find(".alignRt .notranslate").html();
		obtained.push({"label":label, "value": value});
	});

	// for Interview Difficulty
	var difficulty = $difficulty.find(".tbl.dataTbl .difficultyLabel").html();


	// for Candidate Interview Reviews
	var reviews = [];
	$doc.find(".interviewsAndFilter #EmployerInterviews .empReviews .empReview").each(function(idx, li){
		var $li = $(li);
		var label = $li.find(".padTop .row .tightTop .reviewer").text() + " Interview";
		var value = $li.find(".padTopSm .reviewBodyCell .description .interviewDetails").html();
		reviews.push({"label":label, "value": value});
	});
	var parseObj = {"experience":experience, "obtained":obtained, "difficulty":difficulty, "reviews": reviews};

	return parseObj;
}