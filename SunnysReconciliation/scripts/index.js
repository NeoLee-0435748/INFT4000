//imports ---------------------------------------------------------------------
const path = require("path");
const url = require("url");
const { app, BrowserWindow, Menu, ipcMain, remote, globalShortcut } = require("electron"); //deconstruct imports
const { windowsStore } = require("process");

//variables for windows
let mainWindow;
let reportWindow;
let purchaseWindow;
let settingsWindow;

// Decalre windows ------------------------------------------------------------
//function to create main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    icon: "./icons/favicon.ico",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "../preloads/preload.js"),
    },
    show: false,
  });
  // mainWindow.webContents.openDevTools();

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "../screens/main.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  reportWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    icon: "./icons/favicon.ico",
    title: "Purchase Add/Edit",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "../preloads/preload.js"),
    },
    show: false,
  });
  reportWindow.webContents.openDevTools();

  reportWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "../screens/report.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", function () {
    app.quit();
  });

  reportWindow.on("closed", function () {
    app.quit();
  });

  let menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu);

  //handling IPC events -------------------------------------------------------
  //from Main window
  ipcMain.on("open:purchaseWindow", function (e) {
    createPurchaseWindow();
  });

  ipcMain.on("open:settingsWindow", function (e) {
    createSettingsWindow();
  });

  ipcMain.on("quit:theApp", function (e) {
    app.quit();
  });

  //from Report window

  //from Purchase window
  ipcMain.on("close:thePurchaseWindow", function (e) {
    purchaseWindow = null;
  });

  //from Settings window
}

//function to create window for Purchasing
function createPurchaseWindow() {
  purchaseWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    width: 820,
    height: 600,
    icon: "./icons/favicon.ico",
    title: "Purchase Add/Edit",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // purchaseWindow.webContents.openDevTools()

  purchaseWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "../screens/purchase.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  purchaseWindow.on("close", function () {
    purchaseWindow = null;
  });
}

//function to create window for Settings
function createSettingsWindow() {
  settingsWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    width: 820,
    height: 600,
    icon: "./icons/favicon.ico",
    title: "Settings",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // settingsWindow.webContents.openDevTools()

  settingsWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "../screens/setting.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  settingsWindow.on("close", function () {
    settingsWindow = null;
  });
}

// Initialze and Menu part ----------------------------------------------------
// Start the program
app.on("ready", init);

function init() {
  createWindow();
}

//template for menu
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit(Ctrl-q | q)",
        click() {
          app.quit();
        },
      },
    ],
  },
];

function switchPage(page) {
  if (page == "main") {
    mainWindow.setSize(reportWindow.getSize()[0], reportWindow.getSize()[1]);
    mainWindow.setPosition(reportWindow.getPosition()[0], reportWindow.getPosition()[1]);
    mainWindow.show();
    reportWindow.hide();
  } else if (page == "report") {
    reportWindow.getSize(mainWindow.getSize()[0], mainWindow.getSize()[1]);
    reportWindow.setPosition(mainWindow.getPosition()[0], mainWindow.getPosition()[1]);
    reportWindow.show();
    mainWindow.hide();
  }
}

exports.switchPage = switchPage;
