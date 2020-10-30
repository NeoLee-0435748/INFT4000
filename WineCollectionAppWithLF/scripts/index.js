// Ref: https://www.electronjs.org/docs/api/accelerator
//      https://medium.com/fantageek/changing-electron-app-icon-acf26906c5ad
// Image source: This Photo by Unknown Author is licensed under CC BY-SA

//imports
const path = require('path');
const url = require('url');

//deconstruct imports
const { app, BrowserWindow, Menu, ipcMain, globalShortcut } = require('electron');
const { create } = require('domain');

//variables for windows
let mainWindow;
let addWindow;
let updateWindow;
let updateItems;

//function to create main window
function createWindow() {
  mainWindow = new BrowserWindow(
    {
      width: 1080,
      height: 720,
      icon: './icons/favicon.ico',
      webPreferences: {
        nodeIntegration: true
      }
    }
  );
  // mainWindow.webContents.openDevTools()

  mainWindow.loadFile('./screens/main.html');

  mainWindow.on(
    'closed',
    function () {
      app.quit();
    }
  );

  // event handlers
  ipcMain.on(
    'open:addWindow',
    function (e) {
      createAddWindow();
    }
  );

  ipcMain.on(
    'item:add',
    function (e, items) {
      console.log(items);//data got here to main
      mainWindow.webContents.send('item:add', items);
      addWindow.close();
    }
  );

  ipcMain.on(
    'open:updateWindow',
    function (e, items) {
      createUpdateWindow(items);
    }
  );

  ipcMain.on(
    'item:update',
    function (e, items) {
      console.log(items);//data got here to main
      mainWindow.webContents.send('item:update', items);
      updateWindow.close();
    }
  );

  ipcMain.on(
    'clear:items',
    function (e) {
      clearWindow();
    }
  );

  ipcMain.on(
    'data:items',
    function (e) {
      updateWindow.webContents.send('data:items', updateItems);
    }
  );


  let menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu);
}//end createWindow

function init() {
  createWindow();
}

//function to create window for Adding
function createAddWindow() {
  addWindow = new BrowserWindow(
    {
      width: 420,
      height: 300,
      icon: './icons/favicon.ico',
      title: 'Add Item',
      webPreferences: {
        nodeIntegration: true
      }
    }
  );
  // addWindow.webContents.openDevTools()

  addWindow.loadURL(
    url.format(
      {
        pathname: path.join(__dirname, '../screens/addWineInfo.html'),
        protocol: 'file:',
        slashes: true
      }
    )
  );

  addWindow.on(
    'close',
    function () {
      addWindow = null;
    }
  );
}//end create addWindow

//function to create window for updating
function createUpdateWindow(items) {
  updateItems = items;
  updateWindow = new BrowserWindow(
    {
      width: 420,
      height: 300,
      icon: './icons/favicon.ico',
      title: 'Update Item',
      webPreferences: {
        nodeIntegration: true
      }
    }
  );
  // updateWindow.webContents.openDevTools()

  updateWindow.loadURL(
    url.format(
      {
        pathname: path.join(__dirname, '../screens/updateWineInfo.html'),
        protocol: 'file:',
        slashes: true
      }
    )
  );

  updateWindow.on(
    'close',
    function () {
      updateWindow = null;
    }
  );
}//end create updateWindow

function clearWindow() {
  mainWindow.webContents.send('item:clear');
}//end function clearWindow

//function for an accelerator
app.whenReady().then(() => {
  // Register a 'CommandOrControl+Q' shortcut listener.
  globalShortcut.register('CommandOrControl+Q', () => {
    // Do stuff when q and either Command/Control is pressed.
    app.quit();
  });

  // Register a 'Q' shortcut listener.
  // globalShortcut.register('Q', () => {
  //   // Do stuff when Q and either Command/Control is pressed.
  //   app.quit();
  // });
})

//template for menu
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add',
        click() {
          createAddWindow()
        }
      },
      {
        label: 'Clear',
        click() {
          clearWindow()
        }
      },
      {
        label: 'Quit(Ctrl-q | q)',
        click() {
          app.quit()
        }
      }
    ]
  }
];

// Start the program
app.on('ready', init);
