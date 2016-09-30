var insertedCodes = insertedCodes || false;

chrome.extension.sendMessage({cmd: "CHECK_INSERT", result: insertedCodes});