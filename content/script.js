(() => {

    let buttonsLoaded = false

    const createButton = (label, seconds, first = false) => {

        // Create button
        const button = document.createElement('button')
        button.innerHTML = label
        button.className = "ytp-button ytp-custom-button"
        if (first) button.style.marginLeft = "20px"

        button.addEventListener('click', () => {
            document.querySelector('video.video-stream').currentTime += seconds
        })

        return button
    }

    const createButtons = () => {

        buttonsLoaded = true

        const controlContainer = document.querySelector('.ytp-left-controls')

        controlContainer.append(createButton("-15m", -60 * 15, true))
        controlContainer.append(createButton("-1m", -60 ))
        controlContainer.append(createButton("-10s", -10))
        controlContainer.append(createButton("+10s", 10))
        controlContainer.append(createButton("+1m", 60 ))
        controlContainer.append(createButton("+15m", 60 * 15))
    
    }
    
    const updateAntiSpoil = (enabled) => {
        if (enabled) {

            if (!buttonsLoaded) createButtons()

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
