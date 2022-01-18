
//
// main.js is an electron wrapper written to load local pixijs game files.
// You develop your own game from an index.html, then drag and drop it onto the
// loader.
//
// Copyright 2022 Alpha Zoo LLC.
// Written by Matthew Carlin
//

// Modules to control application life and create native browser window
const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
const settings = require('electron-settings');

gameWindow = null;

function createWindow () {
  // Create the browser window.

    const mainWindow = new BrowserWindow({
      width: 1024,
      height: 576,
      fullscreen: false,
      backgroundColor: '#000000',
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        enableRemoteModule: true,
        contextIsolation: false,
      }
    })

    mainWindow.once('ready-to-show', () => {
      mainWindow.show()
    })

    console.log("Hi, hey");

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    ipcMain.on('synchronous-message', (event, arg) => {
      console.log(arg[0]);
      if (arg[0] == "newload") {
    
        console.log(arg[1]);

        if (gameWindow != null) gameWindow.destroy();

        gameWindow = new BrowserWindow({
          width: 1024,
          height: 605,
          fullscreen: false,
          backgroundColor: '#000000',
          show: false,
          webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true,
            contextIsolation: false,
          }
        })

        gameWindow.once('ready-to-show', () => {
          gameWindow.show()
        })

        // and load the index.html of the app.
        gameWindow.loadFile(arg[1])
      } else if (arg[0] == "resize") {
        gameWindow.setSize(arg[1], arg[2])
        gameWindow.show();
      }
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  // if (process.platform !== 'darwin') app.quit()
  app.quit();
})

