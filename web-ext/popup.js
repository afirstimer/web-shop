document.getElementById("crawl-now").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
});

document.getElementById("setting-now").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});