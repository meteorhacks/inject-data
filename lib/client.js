Meteor.startup(function() {
  var injectedDataString = ""
  var scriptTags = document.getElementsByTagName("script");

  for (var i = 0; i < scriptTags.length; i++) {
    if (scriptTags[i].getAttribute("type") == "text/inject-data") {
      injectedDataString = scriptTags[i].innerHTML.replace(/(^\s+|\s+$)/g, "");
      break;
    }
  }

  InjectData._data = InjectData._decode(injectedDataString) || {};
});

InjectData.getData = function(key, callback) {
  Meteor.startup(function() {
    callback(InjectData._data[key]);
  });
};