# meteorhacks:inject-data

### A way to inject data to the client with initial HTML

This is the project used by fast-render to push data to the client with the initial HTML.

## Installation

meteor add meteorhacks:fast-render

## Push Data

We need to use this package with a server side router. We've extended nodejs `http.OutgoingMessage` and provides an API like this.

```js
Picker.router("/", function(params, req, res, next) {
  var ejsonData = {aa: 10};
  res.pushData("some-key", ejsonData);
  // make sure to move the routing forward.
  next();
});
```

## Get Data

You can get data with the following API from the **client**.

```js
InjectData.get("some-key", function(data) {
  console.log(data);
});
```

