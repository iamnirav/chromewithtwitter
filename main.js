function navigate(url) {
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.update(tab.id, {url: url});
  });
}

chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
  if (text.match(/^@/)) {
    chrome.omnibox.setDefaultSuggestion( { description: "View " + text + " on Twitter" } );
  } else {
    chrome.omnibox.setDefaultSuggestion( { description: "Search " + text + " on Twitter" } );
  }
});

chrome.omnibox.onInputEntered.addListener(function (text) {
  if (text.match(/^@/)) {
    navigate('http://twitter.com/#!/' + text.substring(1));
    return;
  }
  navigate('http://twitter.com/#!/search/' + text);
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
      try {
        var url = $.url(details.url);
        if (url.attr('host') == 'www.google.com' && url.param('sourceid') == 'chrome') {
          if (url.param('q').match(/^%40/)) {
            navigate('http://twitter.com/#!/' + url.param('q').substring(3));
            return;
          } else if (url.param('q').match(/^%23/)) {
            navigate('http://twitter.com/#!/search/' + url.param('q').substring(3));
            return;
          }
        }
      } catch (e) {
      }
  },
  {urls: []},
  ["blocking"]
);
