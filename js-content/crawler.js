
window.onload = function(){
	chrome.extension.sendMessage(document.body.innerHTML);
}