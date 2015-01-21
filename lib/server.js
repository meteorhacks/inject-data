var http = Npm.require('http');

var templateText = Assets.getText('lib/inject.html');
var injectDataTemplate = _.template(templateText);

// custome API
http.OutgoingMessage.prototype.pushData = function pushData(key, value) {
  if(!this._injectPayload) {
    this._injectPayload = {};
  }

  this._injectPayload[key] = value;
};

http.OutgoingMessage.prototype.getData = function getData(key) {
  if(this._injectPayload) {
    return _.clone(this._injectPayload[key]);
  } else {
    return null;
  }
};

// overrides
var originalWrite = http.OutgoingMessage.prototype.write;
http.OutgoingMessage.prototype.write = function(chunk, encoding) {
  var condition =
    this._injectPayload && !this._injected &&
    encoding === undefined &&
    /<!DOCTYPE html>/.test(chunk);

  if(condition) {
    // if cors headers included if may cause some security holes
    // so we simply turn off injecting if we detect an cors header
    // read more: http://goo.gl/eGwb4e
    if(this._headers['access-control-allow-origin']) {
      var warnMessage =
        'warn: injecting data turned off due to CORS headers. ' +
        'read more: http://goo.gl/eGwb4e';

      console.warn(warnMessage);
      originalWrite.call(this, chunk, encoding);
      return;
    }

    // inject data
    var data = InjectData._encode(this._injectPayload);
    var injectHtml = injectDataTemplate({data: data});
    chunk = chunk.replace('</head>', injectHtml + '\n</head>');

    this._injected = true;
  }

  originalWrite.call(this, chunk, encoding);
};