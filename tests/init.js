Picker.route('/', function(params, req, res, next) {
  res.pushData("hello", {meteorhacks: "rocks"});
  next();
});