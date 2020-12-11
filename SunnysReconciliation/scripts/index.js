(() => {
  //imports ---------------------------------------------------------------------
  const path = require("path");
  const url = require("url");
  const { app, BrowserWindow, Menu, ipcMain } = require("electron"); //deconstruct imports
  // const { windowsStore } = require("process");

  //variables for windows
  let mainWindow;
  let reportWindow;
  let purchaseWindow;
  let settingsWindow;
  let printWindow;

  // Decalre windows ------------------------------------------------------------
  //function to create main window
  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1080,
      height: 720,
      icon: "./assets/icons/sc_logo.png",
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
      icon: "./assets/icons/sc_logo.png",
      title: "Purchase Add/Edit",
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        preload: path.join(__dirname, "../preloads/preload.js"),
      },
      show: false,
    });
    // reportWindow.webContents.openDevTools();

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

    // let menu = Menu.buildFromTemplate(mainMenuTemplate);
    // Menu.setApplicationMenu(menu);
    Menu.setApplicationMenu(null);

    //handling IPC events -------------------------------------------------------
    //<<< From Main window >>>
    ipcMain.on("open:purchaseWindow", function (e) {
      createPurchaseWindow(null);
    });

    ipcMain.on("open:settingsWindow", function (e) {
      createSettingsWindow();
    });

    ipcMain.on("quit:theApp", function (e) {
      app.quit();
    });

    // to Report Window
    ipcMain.on("delete:purchase:result", function (e, reportData, totalData, error) {
      reportWindow.webContents.send("delete:purchase:result", reportData, totalData, error);
    });

    ipcMain.on("get:report:result", function (e, reportData, totalData, error) {
      reportWindow.webContents.send("get:report:result", reportData, totalData, error);
    });

    ipcMain.on("create:report:result", function (e, data, error) {
      reportWindow.webContents.send("create:report:result", data, error);
    });

    ipcMain.on("open:print", function (e, searchYM) {
      createPrintWindow(searchYM);
    });

    // to Purchase Window
    ipcMain.on("get:purchase:result", function (e, data, error) {
      purchaseWindow.webContents.send("get:purchase:result", data, error);
    });

    ipcMain.on("add:purchase:result", function (e, error) {
      purchaseWindow.webContents.send("add:purchase:result", error);
    });

    ipcMain.on("edit:purchase:result", function (e, error) {
      reportWindow.webContents.send("edit:purchase:result", error);
      purchaseWindow.webContents.send("edit:purchase:result", error);
    });

    // to Settings Window
    ipcMain.on("add:store:result", function (e, error) {
      settingsWindow.webContents.send("add:store:result", error);
    });

    ipcMain.on("delete:store:result", function (e, error) {
      settingsWindow.webContents.send("delete:store:result", error);
    });

    ipcMain.on("add:purpose:result", function (e, error) {
      settingsWindow.webContents.send("add:purpose:result", error);
    });

    ipcMain.on("delete:purpose:result", function (e, error) {
      settingsWindow.webContents.send("delete:purpose:result", error);
    });

    // shared
    ipcMain.on("get:all:settings:result", function (e, data, sender, error) {
      if (sender === "purchase") {
        purchaseWindow.webContents.send("get:all:settings:result", data, error);
      } else {
        settingsWindow.webContents.send("get:all:settings:result", data, error);
      }
    });

    //<<< From Report window >>>
    ipcMain.on("open:edit:purchase", function (e, purchaseId) {
      createPurchaseWindow(purchaseId);
    });

    ipcMain.on("delete:purchase", function (e, purchaseId, searchYM) {
      mainWindow.webContents.send("delete:purchase", purchaseId, searchYM);
    });

    ipcMain.on("get:report", function (e, searchYM) {
      mainWindow.webContents.send("get:report", searchYM);
    });

    ipcMain.on("create:report", function (e, searchYM) {
      mainWindow.webContents.send("create:report", searchYM);
    });

    //<<< From Purchase window >>>
    ipcMain.on("close:thePurchaseWindow", function (e) {
      purchaseWindow.close();
      purchaseWindow = null;
    });

    ipcMain.on("get:purchase", function (e, purchaseId) {
      mainWindow.webContents.send("get:purchase", purchaseId);
    });

    ipcMain.on("add:purchase", function (e, purchaseData) {
      mainWindow.webContents.send("add:purchase", purchaseData);
    });

    ipcMain.on("edit:purchase", function (e, purchaseId, purchaseData) {
      mainWindow.webContents.send("edit:purchase", purchaseId, purchaseData);
    });

    //<<< From Settings window >>>
    ipcMain.on("close:theSettingsWindow", function (e) {
      settingsWindow.close();
      settingsWindow = null;
    });

    ipcMain.on("add:store", function (e, storeName) {
      mainWindow.webContents.send("add:store", storeName);
    });

    ipcMain.on("delete:store", function (e, storeId) {
      mainWindow.webContents.send("delete:store", storeId);
    });

    ipcMain.on("add:purpose", function (e, purposeName) {
      mainWindow.webContents.send("add:purpose", purposeName);
    });

    ipcMain.on("delete:purpose", function (e, purposeId) {
      mainWindow.webContents.send("delete:purpose", purposeId);
    });

    //<<< Shared >>>
    ipcMain.on("get:all:settings", function (e, sender) {
      mainWindow.webContents.send("get:all:settings", sender);
    });
  }

  //function to create window for Purchasing
  function createPurchaseWindow(purchaseId) {
    purchaseWindow = new BrowserWindow({
      parent: purchaseId === null ? mainWindow : reportWindow,
      modal: true,
      width: 820,
      height: 550,
      icon: "./assets/icons/sc_logo.png",
      title: "Purchase Add/Edit",
      webPreferences: {
        nodeIntegration: true,
      },
    });
    // purchaseWindow.webContents.openDevTools();

    purchaseWindow.loadFile(path.join(__dirname, "../screens/purchase.html"), {
      query: { data: JSON.stringify({ id: purchaseId }) },
    });

    purchaseWindow.on("close", function () {
      purchaseWindow = null;
    });
  }

  //function to create window for Settings
  function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
      parent: mainWindow,
      modal: true,
      width: 600,
      height: 350,
      icon: "./assets/icons/sc_logo.png",
      title: "Settings",
      webPreferences: {
        nodeIntegration: true,
      },
    });
    // settingsWindow.webContents.openDevTools();

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

  //function to create window for Printing
  function createPrintWindow(searchYM) {
    printWindow = new BrowserWindow({
      parent: mainWindow,
      modal: true,
      width: 1024,
      height: 768,
      icon: "./assets/icons/sc_logo.png",
      title: "Print Report",
      webPreferences: {
        nodeIntegration: true,
      },
    });
    // printWindow.webContents.openDevTools();

    printWindow.loadFile(path.join(__dirname, "../screens/print.html"), {
      query: { data: JSON.stringify({ id: searchYM }) },
    });

    printWindow.on("close", function () {
      printWindow = null;
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
})();
