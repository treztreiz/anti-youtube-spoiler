let enabled = false
let onlyWhiteList = false
let whiteList = {}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabled })
  chrome.storage.sync.set({ onlyWhiteList })
  chrome.storage.sync.set({ whiteList })
})

chrome.tabs.onUpdated.addListener((tabId, tab) => {
    chrome.tabs.sendMessage(tabId, { type: "NEW" })
})
