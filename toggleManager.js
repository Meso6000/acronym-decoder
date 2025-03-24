class ToggleManager {
    constructor() {
        this.toggleElement = document.getElementById('contentUpdateToggle');
        this.init();
    }

    init() {
        // Load saved state from Chrome storage
        chrome.storage.local.get(['contentUpdateEnabled'], (result) => {
            this.toggleElement.checked = result.contentUpdateEnabled === true;
        });

        // Add event listener
        this.toggleElement.addEventListener('change', () => {
            this.saveState();
        });
    }

    saveState() {
        chrome.storage.local.set({
            contentUpdateEnabled: this.toggleElement.checked
        });
    }

    static isContentUpdateEnabled() {
        // This method would need to be used with callbacks/promises
        // since Chrome storage is asynchronous
        return new Promise((resolve) => {
            chrome.storage.local.get(['contentUpdateEnabled'], (result) => {
                resolve(result.contentUpdateEnabled === true);
            });
        });
    }
}