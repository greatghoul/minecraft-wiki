const BASE_URL = 'http://minecraft-zh.gamepedia.com/api.php';

function isBlank(text) {
  return /^\s*$/.test(text);
}

function suggestUrl(text) {
  let keyword = encodeURIComponent(text);
  return `${BASE_URL}?action=opensearch&format=json&formatversion=2&search=${keyword}&namespace=0&limit=10&suggest=true`
}

function navigate(url) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.create({ url: url, active: true, index: tab.index });
    chrome.tabs.remove(tab.id);
  });
}

function inputChangedHandler(text, suggest) {
  if (isBlank(text)) return;

  fetch(suggestUrl(text), { mode: 'cors' })
    .then(response => response.json())
    .then(result => {
      let suggestions = [];
      
      for (let i = 0; i < result[1].length; i++) {
        let title = result[1][i];
        let link = result[3][i];

        suggestions.push({
          content: link,
          description: `<match>${title}</match><dim> - </dim><url>${link}</url>`
        });
      }

      suggest(suggestions);
    });
}

function inputEnteredHandler(link) {
  navigate(link);
}

chrome.omnibox.onInputChanged.addListener(inputChangedHandler);
chrome.omnibox.onInputEntered.addListener(inputEnteredHandler);
