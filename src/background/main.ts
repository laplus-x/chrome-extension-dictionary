chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.type === "OPEN_SIDE_PANEL" && sender.tab?.windowId) {
    await chrome.sidePanel.open({
      windowId: sender.tab.windowId,
    });
  }
});
