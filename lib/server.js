var http = Npm.require('http');

var templateText = Assets.getText('lib/inject.html');
var injectDataTemplate = _.template(templateText);

// New injection method uses dynamicHead
Meteor.startup(function () {
    WebApp.connectHandlers.use((req, res, next) => {
        if (res._injectHtml && !res._injected) {
            req.dynamicHead = req.dynamicHead || '';
            req.dynamicHead += res._injectHtml;
        }
        next();
    });
});

// custome API
InjectData.pushData = function pushData(res, key, value) {
    if (!res._injectPayload) {
        res._injectPayload = {};
    }

    res._injectPayload[key] = value;

    // if cors headers included if may cause some security holes
    // so we simply turn off injecting if we detect an cors header
    // read more: http://goo.gl/eGwb4e
    if (res._headers && res._headers['access-control-allow-origin']) {
        var warnMessage =
            'warn: injecting data turned off due to CORS headers. ' +
            'read more: http://goo.gl/eGwb4e';
        console.warn(warnMessage);
        return;
    }

    // inject data
    var data = InjectData._encode(res._injectPayload);
    res._injectHtml = injectDataTemplate({ data: data });
    InjectData._hijackWriteIfNeeded(res);
};

InjectData.getData = function getData(res, key) {
    if (res._injectPayload) {
        return _.clone(res._injectPayload[key]);
    } else {
        return null;
    }
};

InjectData._hijackWriteIfNeeded = function (res) {
    if (res._writeHijacked) {
        return;
    }
    res._writeHijacked = true;

    var originalWrite = res.write;
    res.write = function (chunk, encoding) {
        var condition =
            res._injectHtml && !res._injected &&
            encoding === undefined &&
            /<!DOCTYPE html>/.test(chunk);

        if (condition) {
            // if this is a buffer, convert it to string
            chunk = chunk.toString();
            // Don't inject if we already have via the dynamicHead method
            if (/<script type="text\/inject-data">/.test(chunk) === false) {
                chunk = chunk.replace('<script', res._injectHtml + '<script');
            }

            res._injected = true;
        }

        originalWrite.call(res, chunk, encoding);
    };
};