chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (!sender.tab?.windowId) return;

  if (msg.type === "OPEN_SIDE_PANEL") {
    await chrome.sidePanel.open({
      windowId: sender.tab.windowId,
    });
  }
  if (msg.type === "CLOSE_SIDE_PANEL") {
    await chrome.sidePanel.close({
      windowId: sender.tab.windowId,
    });
  }
});
