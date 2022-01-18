
//
// preload.js is glue to allow the app's javascript environment to communicate with the
// electron wrapper's javascript environment in a sandboxed manner.
//
// Copyright 2022 Alpha Zoo LLC.
// Written by Matthew Carlin
//

const { ipcRenderer } = require('electron')

window.loaderNew = function(filename) {
  ipcRenderer.sendSync('synchronous-message', ["newload", filename]);
}

window.loaderResize = function(x, y) {
  ipcRenderer.sendSync('synchronous-message', ["resize", x, y]);
}