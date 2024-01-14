document.addEventListener('DOMContentLoaded', function () {
    var toggleButton = document.getElementById('toggle-btn');
    toggleButton.addEventListener('click', function () {
      chrome.runtime.sendMessage({ replace: true });
    });
  });