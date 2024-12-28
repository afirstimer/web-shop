chrome.contextMenus.create({
    id: "addImage",
    title: "Thêm vào popup",
    contexts: ["image"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addImage") {
        chrome.tabs.sendMessage(tab.id, { action: "addImageToPopup", src: info.srcUrl });
    }
});
