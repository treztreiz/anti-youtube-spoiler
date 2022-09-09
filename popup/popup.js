const checkbox = document.getElementById('enabled')

chrome.storage.sync.get('enabled', ({enabled}) => {
    checkbox.checked = enabled
})

checkbox.addEventListener('change', () => {
    chrome.storage.sync.get('enabled', ({enabled}) => {
        chrome.storage.sync.set({enabled : !enabled})
    })
})