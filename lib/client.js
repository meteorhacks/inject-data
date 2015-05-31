Meteor.startup(function() {
  var dom = $('script[type="text/inject-data"]', document.head);
  var injectedDataString = $.trim(dom.text());
  InjectData._data = InjectData._decode(injectedDataString) || {};
});

InjectData.getData = function(key, callback) {
  Meteor.startup(function() {
    callback(InjectData._data[key]);
  });
};