//imports & variables ---------------------------------------------------------
const { ipcRenderer } = require("electron"); //deconstruct imports

//declaration -----------------------------------------------------------------
const btnAdd = document.getElementById("btn-add");
const btnClose = document.getElementById("btn-close");

//IPC event functions ---------------------------------------------------------
//catch add item (caller: index.js)
ipcRenderer.on("item:add", (e, items) => {});

//local event functions (call index.js) ---------------------------------------
btnAdd.addEventListener("click", addPurchase);
btnClose.addEventListener("click", closeWindow);

function addPurchase(e) {}

function closeWindow(e) {
  ipcRenderer.send("close:thePurchaseWindow"); //send to index.js
}
