InjectData = {};
Meteor.startup(function() {
  var dom = $('script[type="text/inject-data"]', document.head);
  var injectedDataString = dom.text().trim();
  InjectData._data = DecodeEJSON(injectedDataString) || {};
});

InjectData.getData = function(key, callback) {
  Meteor.startup(function() {
    callback(InjectData._data[key]);
  });
};