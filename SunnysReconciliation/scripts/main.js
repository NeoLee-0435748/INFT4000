//imports ---------------------------------------------------------------------
const { ipcRenderer } = require("electron"); //deconstruct imports
const dbInterface = require("../scripts/dbInterface");
const path = require("path");
let sqlite3 = require("sqlite3");
const knexOptions = {
  client: "sqlite3",
  connection: { filename: path.resolve(__dirname, "../database/SunnyRecon.db") },
  useNullAsDefault: true,
  debug: true,
};
let knex = require("knex")(knexOptions);

//declaration -----------------------------------------------------------------
const btnReport = document.getElementById("report");
const btnPurchase = document.getElementById("purchase");
const btnSettings = document.getElementById("settings");
const btnQuit = document.getElementById("quit");

//IPC event functions ---------------------------------------------------------
//catch search report (caller: index.js)
ipcRenderer.on("search:report", (e, searchYM) => {
  console.log("search:report => " + searchYM);
  dbInterface.selectAllPurchases(knex, (data, err) => {
    console.log(data);
  });
});

//catch add item (caller: index.js)
// ipcRenderer.on("item:", (e, items) => {});

//local event functions (call index.js) ---------------------------------------
btnReport.addEventListener("click", openReportWindow);
btnPurchase.addEventListener("click", openPurchaseWindow);
btnSettings.addEventListener("click", openSettingsWindow);
btnQuit.addEventListener("click", quitTheApp);

function openReportWindow(e) {
  window.switchPage("report");
}

function openPurchaseWindow(e) {
  ipcRenderer.send("open:purchaseWindow"); //send to index.js
}

function openSettingsWindow(e) {
  ipcRenderer.send("open:settingsWindow"); //send to index.js
}

function quitTheApp(e) {
  ipcRenderer.send("quit:theApp"); //send to index.js
}

//Etc -------------------------------------------------------------------------
