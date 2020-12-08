//imports ---------------------------------------------------------------------
const { ipcRenderer } = require("electron"); //deconstruct imports

//declaration -----------------------------------------------------------------
const btnReport = document.getElementById("report");
const btnPurchase = document.getElementById("purchase");
const btnSettings = document.getElementById("settings");
const btnQuit = document.getElementById("quit");

//IPC event functions ---------------------------------------------------------
//catch add item (caller: index.js)
// ipcRenderer.on("item:", add(e, items) => {});

//catch add item (caller: index.js)
// ipcRenderer.on("item:", edit(e, items) => {});

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
