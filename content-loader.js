// Check if the feature is enabled before running the main content script
chrome.storage.local.get(['contentUpdateEnabled'], function(result) {
    if (result.contentUpdateEnabled === true) {
        // First execution
        injectScript().then(() => {
            console.log("First script execution complete");

            // Wait a bit before second execution
            setTimeout(() => {
                injectScript().then(() => {
                    console.log("Second script execution complete");
                });
            }, 500); // 500ms delay
        });
    }
});

// Function to inject the script and return a promise for completion
function injectScript() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('contentupdate.js');
        script.onload = function() {
            this.remove();
            resolve();
        };
        document.head.appendChild(script);
    });
}