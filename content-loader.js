
// Check if the feature is enabled before running the main content script
chrome.storage.local.get(['contentUpdateEnabled'], function(result) {
    if (result.contentUpdateEnabled === true) {
        // Feature is enabled, so run the acronym processing
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('contentupdate.js');
        script.onload = function() { this.remove(); };
        document.head.appendChild(script);
    }
});