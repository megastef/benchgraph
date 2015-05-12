'use strict';

var Flotr = window.Flotr
  , xhr = require('xhr')
  , BufferGraph = require('./buffer-graph')
  , versions = [ 'iojs-v2.0.1', 'node-v0.10.38', 'node-v0.12.2' ]

function urlsFor(topic) {
  return versions.map(function toUrl(v) {
    return 'data/' + topic + '-' + v + '.json';
  })
}

function getData(topic, cb) {
  var urls = urlsFor(topic);
  var tasks = urls.length;
  var data = [], abort;


  function xhrData(url, idx) {
    function onresponse(err, res, body) {
      if (abort) return;
      if (err) { abort = true; return cb(err) }
      var obj = JSON.parse(body);
      obj._version = versions[idx];
      data.push(obj);
      if (!--tasks) cb(null, data);
    }

    if (abort) return;
    xhr({ uri: url }, onresponse)
  }
  urls.forEach(xhrData);
}

var bufferEl = document.getElementById('buffer-graphs')
var bufferGraph = new BufferGraph(Flotr, bufferEl, getData);
bufferGraph.draw();
