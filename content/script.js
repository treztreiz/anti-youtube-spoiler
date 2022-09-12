(() => {

    // Storage local values
    let ENABLED = false
    let ONLY_WHITE_LIST = false
    let WHITE_LIST = {}
    
    // Params
    let buttonsLoaded = false
    let channel = null

    // Update body class
    const updateAntiSpoil = () => {

        if (ENABLED) {

            if (null == channel) {
                // Channel infos are lazy loaded
                channel = document.querySelector('#owner #channel-name a.yt-simple-endpoint')
                setTimeout(updateAntiSpoil, 300)
                return
            }

            // Update class
            if (!ONLY_WHITE_LIST || (ONLY_WHITE_LIST && WHITE_LIST.hasOwnProperty(channel.href))) {

                if (!buttonsLoaded) createButtons()

                document.body.classList.add('anti-spoil-enabled')
                document.body.classList.remove('anti-spoil-disabled')

                return

            }
            
        }
        
        // Update class
        document.body.classList.remove('anti-spoil-enabled')
        document.body.classList.add('anti-spoil-disabled')
        
    }

    // Initialize
    chrome.storage.sync.get(['enabled', 'onlyWhiteList', 'whiteList'], ({enabled, onlyWhiteList, whiteList}) => {
        ENABLED = enabled
        ONLY_WHITE_LIST = onlyWhiteList
        WHITE_LIST = whiteList

        updateAntiSpoil()
    })

    // Listen to changes
    chrome.storage.onChanged.addListener((changes) => {
        if ('enabled' in changes || 'onlyWhiteList' in changes || 'whiteList' in changes) {
            if ('enabled' in changes) ENABLED = changes.enabled.newValue
            if ('onlyWhiteList' in changes) ONLY_WHITE_LIST = changes.onlyWhiteList.newValue
            if ('whiteList' in changes) WHITE_LIST = changes.whiteList.newValue

            updateAntiSpoil()
        } 
    })

    // Add curent creator to white list
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === "ADD_CURRENT") {
            
            channel = document.querySelector('#owner #channel-name a.yt-simple-endpoint')
            const name = channel.innerHTML
            const url = channel.href
            const img = document.querySelector('#owner #avatar img').src

            const creator = {name: name, url: url, img: img}

            sendResponse(creator)
        }
    })

    // Add time buttons
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

})()

document.body.classList.add('anti-spoil-enabled')