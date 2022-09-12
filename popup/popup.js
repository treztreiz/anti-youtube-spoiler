const enabledCheckbox = document.getElementById('enabled')
const onlyWhiteListCheckbox = document.getElementById('only-white-list')
const whiteListContainer = document.getElementById('white-list')
const addCurrentBtn = document.getElementById('add-current')

// Enabled checkbox
chrome.storage.sync.get('enabled', ({enabled}) => {
    enabledCheckbox.checked = enabled
})
enabledCheckbox.addEventListener('change', () => {
    chrome.storage.sync.get('enabled', ({enabled}) => {
        chrome.storage.sync.set({enabled : !enabled})
    })
})

// Only white list checkbox
chrome.storage.sync.get('onlyWhiteList', ({onlyWhiteList}) => {
    onlyWhiteListCheckbox.checked = onlyWhiteList
})
onlyWhiteListCheckbox.addEventListener('change', () => {
    chrome.storage.sync.get('onlyWhiteList', ({onlyWhiteList}) => {
        chrome.storage.sync.set({onlyWhiteList : !onlyWhiteList})
    })
})

// Update white list
updateWhiteList()
function updateWhiteList() {

    chrome.storage.sync.get('whiteList', ({whiteList}) => {

        whiteListContainer.innerHTML = ''

        const creators = Object.values(whiteList)
    
        if (!creators.length) {
            whiteListContainer.innerHTML = '<div class="form-text text-center">There are no channels in your white list.<br>Open a tab with a youtube video then click the "add current channel" button above.</div>'
            return 
        }
    
        for (let creator of creators) {
            console.log(creator)
            whiteListContainer.innerHTML += `<li class="list-group-item d-flex align-items-center"><img class="img-fluid me-2 avatar" src="${creator.img}"><span style="flex: 1">${creator.name}</span><button class="btn-close" data-id="${creator.url}"></button></li>`
        }
    
        const deleteBtns = whiteListContainer.querySelectorAll('.btn-close')
        for (let deleteBtn of deleteBtns) {
            deleteBtn.addEventListener('click', deleteCreator)
        }
        
    })

}
// Handle whitelist change
chrome.storage.onChanged.addListener((changes) => {
    if ('whiteList' in changes) updateWhiteList()
})

// Add Creator
addCurrentBtn.addEventListener('click', addCreator)
async function addCreator() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "ADD_CURRENT"}, function(response) {
            
            if(!response) return

            chrome.storage.sync.get('whiteList', ({whiteList}) => {
                whiteList[response.url] = response
                chrome.storage.sync.set({whiteList : whiteList})
            })

        })
    })
}

// Delete creator
function deleteCreator(e) {

    const id = e.currentTarget.dataset.id

    chrome.storage.sync.get('whiteList', ({whiteList}) => {
        delete whiteList[id]
        chrome.storage.sync.set({whiteList : whiteList})
    })
    
}