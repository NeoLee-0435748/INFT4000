//imports & variables ---------------------------------------------------------
const { ipcRenderer } = require("electron"); //deconstruct imports

//declaration -----------------------------------------------------------------
const btnAddStore = document.getElementById("btn-add-store");
const btnDelStore = document.getElementById("btn-delete-store");
const btnAddPurpose = document.getElementById("btn-add-purpose");
const btnDelPurpose = document.getElementById("btn-delete-purpose");
const btnClose = document.getElementById("btn-close");

//IPC event functions ---------------------------------------------------------
//catch add item (caller: index.js)
// ipcRenderer.on("item:", add(e, items) => {});

//catch add item (caller: index.js)
// ipcRenderer.on("item:", edit(e, items) => {});

//local event functions (call index.js) ---------------------------------------
// btnAddStore.addEventListener("click", addStore);
// btnDelStore.addEventListener("click", delStore);
// btnAddPurpose.addEventListener("click", addPurpose);
// btnDelPurpose.addEventListener("click", delPurpose);
btnClose.addEventListener("click", closeWindow);

function closeWindow(e) {
  ipcRenderer.send("close:theSettingsWindow"); //send to index.js
}
