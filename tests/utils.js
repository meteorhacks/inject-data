Tinytest.add('Utils - encode decode', function(test) {
  var data = {aa: 10, date: new Date()};
  var str = EncodeEJSON(data);
  var decoded = DecodeEJSON(str);

  test.equal(decoded.aa, data.aa);
  test.equal(decoded.date.getTime(), data.date.getTime());
});

Tinytest.add('Utils - encode decode special chars', function(test) {
  var data = {special: "#://"};
  var str = EncodeEJSON(data);

  test.isFalse(/#/.test(str));
});