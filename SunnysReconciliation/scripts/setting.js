(() => {
  //imports & variables ---------------------------------------------------------
  const { ipcRenderer } = require("electron"); //deconstruct imports

  //declaration -----------------------------------------------------------------
  const btnAddStore = $("#btn-add-store");
  const btnDelStore = $("#btn-delete-store");
  const btnAddPurpose = $("#btn-add-purpose");
  const btnDelPurpose = $("#btn-delete-purpose");
  const btnClose = $("#btn-close");
  const inputStore = $("#inputStore");
  const inputPurpose = $("#inputPurpose");
  const selectStore = $("#deleteStore");
  const dialogStore = $("#dialog-store");
  const selectPurpose = $("#deletePurpose");
  const dialogPurpose = $("#dialog-purpose");

  //IPC event functions ---------------------------------------------------------
  //catch all settings (caller: index.js)
  ipcRenderer.on("get:all:settings:result", (e, data, error) => {
    // console.log(data);
    //Stores
    selectStore.html("");
    $.each(data[0], function (key, value) {
      selectStore.append($("<option></option>").attr("value", value.id).text(value.name));
    });

    //Purposes
    selectPurpose.html("");
    $.each(data[1], function (key, value) {
      selectPurpose.append($("<option></option>").attr("value", value.id).text(value.name));
    });
  });

  //catch add store result (caller: index.js)
  ipcRenderer.on("add:store:result", (e, error) => {
    inputStore.val("");
    getAllSettings();
  });

  //catch delete store result (caller: index.js)
  ipcRenderer.on("delete:store:result", (e, error) => {
    getAllSettings();
  });

  //catch add purpose result (caller: index.js)
  ipcRenderer.on("add:purpose:result", (e, error) => {
    inputPurpose.val("");
    getAllSettings();
  });

  //catch delete pose result (caller: index.js)
  ipcRenderer.on("delete:purpose:result", (e, error) => {
    getAllSettings();
  });

  //local event functions (call index.js) ---------------------------------------
  btnAddStore.click((e) => {
    ipcRenderer.send("add:store", inputStore.val());
  });

  btnDelStore.click((e) => {
    dialogStore.dialog("open");
  });

  btnAddPurpose.click((e) => {
    ipcRenderer.send("add:purpose", inputPurpose.val());
  });

  btnDelPurpose.click((e) => {
    dialogPurpose.dialog("open");
  });

  btnClose.click((e) => {
    ipcRenderer.send("close:theSettingsWindow"); //send to index.js
  });

  //Etc -------------------------------------------------------------------------
  $(document).ready(function () {
    getAllSettings();
  });

  function getAllSettings() {
    ipcRenderer.send("get:all:settings", "settings");
  }

  dialogStore.dialog({
    autoOpen: false,
    buttons: {
      Yes: function () {
        ipcRenderer.send("delete:store", selectStore.val());
        $(this).dialog("close");
      },
      No: function () {
        $(this).dialog("close");
      },
    },
  });

  dialogPurpose.dialog({
    autoOpen: false,
    buttons: {
      Yes: function () {
        ipcRenderer.send("delete:purpose", selectPurpose.val());
        $(this).dialog("close");
      },
      No: function () {
        $(this).dialog("close");
      },
    },
  });
})();
