(() => {
    
    const updateAntiSpoil = (enabled) => {
        if (enabled) {
            document.body.classList.add('anti-spoil-enabled')
            document.body.classList.remove('anti-spoil-disabled')
        } else {
            document.body.classList.remove('anti-spoil-enabled')
            document.body.classList.add('anti-spoil-disabled')
        }
    }

    chrome.storage.sync.get('enabled', ({enabled}) => {
        updateAntiSpoil(enabled)
    })

    chrome.storage.onChanged.addListener((changes) => {
        if ('enabled' in changes) updateAntiSpoil(changes.enabled.newValue)
    })

})()
