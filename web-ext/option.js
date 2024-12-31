document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("settings-form");
    const statusMessage = document.getElementById("status-message");

    // Load existing settings
    chrome.storage.local.get(["apiToken", "webhookUrl"], (data) => {
        document.getElementById("api-token").value = data.apiToken || "";
        document.getElementById("webhook-url").value = data.webhookUrl || "";
    });

    // Save settings
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const apiToken = document.getElementById("api-token").value.trim();
        const webhookUrl = document.getElementById("webhook-url").value.trim();

        chrome.storage.local.set({ apiToken, webhookUrl }, () => {
            statusMessage.textContent = "Settings saved successfully!";
            statusMessage.className = "text-success";
        });
    });
});