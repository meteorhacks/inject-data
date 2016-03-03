var http = Npm.require('http');

// custom API
InjectData.pushData = function pushData(res, key, value) {
  if(!res._injectPayload) {
    res._injectPayload = {};
  }

  res._injectPayload[key] = value;
  InjectData._hijackWriteIfNeeded(res);
};

InjectData.getData = function getData(res, key) {
  if(res._injectPayload) {
    var data = res._injectPayload[key];
    var clonedData = EJSON.parse(EJSON.stringify(data));
    return clonedData;
  } else {
    return null;
  }
};

InjectData._hijackWriteIfNeeded = function(res) {
  if(res._writeHijacked) {
    return;
  }
  res._writeHijacked = true;

  var originalWrite = res.write;
  res.write = function(chunk, encoding) {
    var condition =
      res._injectPayload && !res._injected &&
      encoding === undefined &&
      /<!DOCTYPE html>/.test(chunk);

    if(condition) {
      // if cors headers included if may cause some security holes
      // so we simply turn off injecting if we detect an cors header
      // read more: http://goo.gl/eGwb4e
      if(res._headers['access-control-allow-origin']) {
        var warnMessage =
          'warn: injecting data turned off due to CORS headers. ' +
          'read more: http://goo.gl/eGwb4e';

        console.warn(warnMessage);
        originalWrite.call(res, chunk, encoding);
        return;
      }

      // inject data
      var data = InjectData._encode(res._injectPayload);
      var injectHtml = '<script type="text/inject-data">' + data + '</script>';

      // if this is a buffer, convert it to string
      chunk = chunk.toString();
      chunk = chunk.replace('<script', injectHtml + '<script');

      res._injected = true;
    }

    originalWrite.call(res, chunk, encoding);
  };
};
