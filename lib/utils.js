EncodeEJSON = function(ejson) {
  var ejsonString = EJSON.stringify(ejson);
  return encodeURIComponent(ejsonString);
};

DecodeEJSON = function(encodedEjson) {
  var decodedEjsonString = decodeURIComponent(encodedEjson);
  return EJSON.fromJSONValue(JSON.parse(decodedEjsonString));
};
