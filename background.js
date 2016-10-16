function inputChangedHandler(text, suggest) {
  suggest([
    {content: text + " one", description: "the first one"},
    {content: text + " number two", description: "the second entry"}
  ]);
}

chrome.omnibox.onInputChanged.addListener(inputChangedHandler);