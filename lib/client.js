Meteor.startup(function() {
  var dom = '';
  
  _.each(document.getElementsByTagName("script"), (el) => {
    if (el.getAttribute('type') === 'text/inject-data') {
      dom = el.innerHTML;
    }
  });

  var injectedDataString = $.trim(dom.text());
  InjectData._data = InjectData._decode(injectedDataString) || {};
});

InjectData.getData = function(key, callback) {
  Meteor.startup(function() {
    callback(InjectData._data[key]);
  });
};
