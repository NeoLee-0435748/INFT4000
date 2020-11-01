// Ref: https://www.electronjs.org/docs/api/accelerator
//      https://medium.com/fantageek/changing-electron-app-icon-acf26906c5ad
//      https://www.codota.com/code/javascript/functions/electron/WebContents/insertCSS
// Image source: This Photo by Unknown Author is licensed under CC BY-SA
// Image source for theme: https://pixabay.com/

//imports
const fs = require('fs');
const path = require('path');
const url = require('url');
const Settings = require('./settings');

//deconstruct imports
const { app, BrowserWindow, Menu, ipcMain, globalShortcut } = require('electron');
const { create } = require('domain');

//variables for windows
let mainWindow;
let addWindow;
let updateWindow;
let updateItems;

// css key
let cssKey;

//object for username
const userNames = {
  user1: 'Neo Lee',
  user2: 'Eun Ha',
  user3: 'Jin Wie',
}

//object for theme
const themes = {
  default: {
    name: 'default',
    styleFile: '../styles/theme_default.css',
  },
  spring: {
    name: 'spring',
    styleFile: '../styles/theme_spring.css',
  },
  summer: {
    name: 'summer',
    styleFile: '../styles/theme_summer.css',
  },
  fall: {
    name: 'fall',
    styleFile: '../styles/theme_fall.css',
  },
  winter: {
    name: 'winter',
    styleFile: '../styles/theme_winter.css',
  },
}

//Create the settings class
const settings = new Settings({
  configName: 'user-preferences', //data file in app system folder
  defaults: {
    windowBounds: {
      width: 1080,
      height: 720
    },
    userName: userNames.user1,
    windowTheme: {
      theme: themes.default
    }
  }
});

//function to create main window
function createMainWindow() {
  let { width, height } = settings.get('windowBounds');// GET dimensions from settings

  mainWindow = new BrowserWindow(
    {
      width: width,
      height: height,
      icon: './icons/favicon.ico',
      webPreferences: {
        nodeIntegration: true
      }
    }
  );
  // mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.loadFile('./screens/main.html');

  mainWindow.webContents.once(
    'dom-ready',
    () => {
      const themeStored = settings.get('windowTheme');
      applyTheme(themeStored);
      const username = settings.get('userName');
      mainWindow.webContents.send('username:update', username);
    }
  );

  mainWindow.on(
    'closed',
    () => {
      app.quit();
    }
  );

  mainWindow.on(
    'resize',
    () => { //handler for resize event - the BrowserWindow class extends EventEmitter
      let { width, height } = mainWindow.getBounds();//getBounds gets object with dimensions
      settings.set('windowBounds', { width, height });//save dimensions
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
      // console.log(items);//data got here to main
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
      // console.log(items);//data got here to main
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
  createMainWindow();
}

//function to create window for Adding
function createAddWindow() {
  addWindow = new BrowserWindow(
    {
      parent: mainWindow,
      width: 420,
      height: 300,
      icon: './icons/favicon.ico',
      title: 'Add Item',
      modal: true,
      webPreferences: {
        nodeIntegration: true
      },
    }
  );
  // addWindow.webContents.openDevTools({mode: 'detach'});

  addWindow.menuBarVisible = false;

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
      parent: mainWindow,
      width: 420,
      height: 300,
      icon: './icons/favicon.ico',
      title: 'Update Item',
      modal: true,
      webPreferences: {
        nodeIntegration: true
      },
    }
  );
  // updateWindow.webContents.openDevTools({mode: 'detach'});

  updateWindow.menuBarVisible = false;

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

//functions for usernames
function applyUsername(username) {
  settings.set('userName', username);
  mainWindow.webContents.send('username:update', username);
}

//functions for themes

async function applyTheme(theme) {
  settings.set('windowTheme', theme);//save theme name
  if (cssKey) {
    mainWindow.webContents.removeInsertedCSS(cssKey);
  }
  const themeFile = fs.readFileSync(path.join(__dirname, theme.styleFile), 'utf8');
  cssKey = await mainWindow.webContents.insertCSS(themeFile);
}

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
        label: 'Setting',
        submenu: [
          {
            label: 'Username',
            submenu: [
              {
                label: 'User1',
                click() { applyUsername(userNames.user1) }
              },
              {
                label: 'User2',
                click() { applyUsername(userNames.user2) }
              },
              {
                label: 'User3',
                click() { applyUsername(userNames.user3) }
              }
            ]
          },
          {
            label: 'Theme',
            submenu: [
              {
                label: 'Default',
                click() { applyTheme(themes.default) }
              },
              {
                label: 'Spring',
                click() { applyTheme(themes.spring) }
              },
              {
                label: 'Summer',
                click() { applyTheme(themes.summer) }
              },
              {
                label: 'Fall',
                click() { applyTheme(themes.fall) }
              },
              {
                label: 'Winter',
                click() { applyTheme(themes.winter) }
              },
            ]
          },
        ],
      },
      {
        label: 'Quit(Ctrl-q)',
        click() {
          app.quit()
        }
      }
    ]
  },
];

// Start the program
app.on('ready', init);
