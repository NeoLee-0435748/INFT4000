(() => {
  //imports & variables ---------------------------------------------------------
  const { ipcRenderer } = require("electron"); //deconstruct imports

  //declaration -----------------------------------------------------------------
  const btnAdd = $("#btn-add");
  const btnClose = $("#btn-close");
  const datePurchase = $("#purchaseDate");
  const selectStore = $("#purchaseStore");
  const selectPurpose = $("#purchasePurpose");
  const inputAmount = $("#purchaseAmount");
  const radioReceiptYes = $("#purchaseReceiptYes");
  const radioReceiptNo = $("purchaseReceiptNo");

  //IPC event functions ---------------------------------------------------------
  //catch add item (caller: index.js)
  ipcRenderer.on("add:purchase", (e, items) => {});

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

  //local event functions (call index.js) ---------------------------------------
  btnAdd.click((e) => {
    const purchaseData = [
      datePurchase.val(),
      selectStore.val(),
      selectPurpose.val(),
      inputAmount.val(),
      radioReceiptYes.is(":checked") ? "Y" : "N",
    ];

    console.log(purchaseData);
    ipcRenderer.send("add:purchase", purchaseData);
  });

  btnClose.click((e) => {
    ipcRenderer.send("close:thePurchaseWindow"); //send to index.js
  });

  //Etc -------------------------------------------------------------------------
  $(document).ready(function () {
    getAllSettings();
  });

  function getAllSettings() {
    ipcRenderer.send("get:all:settings", "purchase");
  }
})();
