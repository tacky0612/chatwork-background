chrome.runtime.onInstalled.addListener(function(OnInstalledReason) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "https://www.chatwork.com/" }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "https://kcw.kddi.ne.jp/" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });

  if (OnInstalledReason.reason === "install") {
    chrome.runtime.onMessage.addListener(function(message) {
      if (message === "activate") {
        chrome.tabs.executeScript({
          file: "content.js"
        });
      }
    });
  }
});
