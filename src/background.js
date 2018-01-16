import { attachHeadersListener } from 'chrome-sidebar'
import { url } from './constants'

chrome.browserAction.onClicked.addListener(tab => {
  console.log('Browser Action Triggered')
  // for the current tab, inject the 'inject.js' file & execute it
  chrome.tabs.executeScript(tab.id, {
    file: 'browser.js'
  })
})

function onHeadersReceived (details) {
  const headers = details.responseHeaders.map(header => {
    if (header.name.toLowerCase() !== 'content-security-policy' || header.name.toLowerCase() !== 'x-frame-options')  {
      return header
    }
  })

  console.log({headers})

  return {
    responseHeaders: headers
  }
}

const filter = {
  urls: ['*://*/*'],
  types: ['main_frame', 'sub_frame']
}

chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, filter, ['blocking', 'responseHeaders']);

chrome.browserAction.onClicked.addListener(function() {
  chrome.browsingData.remove({}, {
    'serviceWorkers': true
  }, function() {})
})
