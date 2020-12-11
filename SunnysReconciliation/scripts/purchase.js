(() => {
  //imports & variables ---------------------------------------------------------
  const { ipcRenderer, remote } = require("electron"); //deconstruct imports
  const queryString = require("querystring");

  //declaration -----------------------------------------------------------------
  const btnAdd = $("#btn-add");
  const btnClose = $("#btn-close");
  const datePurchase = $("#purchaseDate");
  const selectStore = $("#purchaseStore");
  const selectPurpose = $("#purchasePurpose");
  const inputAmount = $("#purchaseAmount");
  const radioReceiptYes = $("#purchaseReceiptYes");
  const radioReceiptNo = $("#purchaseReceiptNo");
  let editPurchaseId = null;

  //IPC event functions ---------------------------------------------------------
  //catch get purchase (caller: index.js)
  ipcRenderer.on("get:purchase:result", (e, data, error) => {
    console.log("get:purchase:result");
    console.log(data);
    datePurchase.val(data[0].purchase_date);
    inputAmount.val(data[0].amount);
    selectStore.eq(data[0].store_id).prop("selected", true); // To select via value
    selectPurpose.eq(data[0].purpose_id).prop("selected", true); // To select via value
    (data[0].receipt_yn === "Y" ? radioReceiptYes : radioReceiptNo).prop("checked", true);
  });

  //catch add purchase (caller: index.js)
  ipcRenderer.on("add:purchase:result", (e, error) => {
    if (!editPurchaseId) {
      //todo: add message dialog for adding
      datePurchase.val("");
      inputAmount.val("");
      $("#purchaseStore :nth-child(1)").prop("selected", true); // To select via index
      $("#purchasePurpose :nth-child(1)").prop("selected", true); // To select via index
      radioReceiptYes.prop("checked", true);
    }
  });

  //catch edit purchase (caller: index.js)
  ipcRenderer.on("edit:purchase:result", (e, error) => {
    //todo: add message dialog for editing
  });

  //catch get all settings (caller: index.js)
  ipcRenderer.on("get:all:settings:result", (e, data, error) => {
    console.log("get:all:settings:result");
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

    if (editPurchaseId) {
      console.log("get:purchase");
      ipcRenderer.send("get:purchase", editPurchaseId);
    }
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
    if (editPurchaseId) {
      ipcRenderer.send("edit:purchase", editPurchaseId, purchaseData);
    } else {
      ipcRenderer.send("add:purchase", purchaseData);
    }
  });

  btnClose.click((e) => {
    ipcRenderer.send("close:thePurchaseWindow"); //send to index.js
  });

  //Etc -------------------------------------------------------------------------
  $(document).ready(function () {
    const queryResult = queryString.parse(global.location.search);
    const data = JSON.parse(queryResult["?data"]);
    editPurchaseId = data.id;
    console.log(data);
    console.log(editPurchaseId);

    getAllSettings();
  });

  function getAllSettings() {
    ipcRenderer.send("get:all:settings", "purchase");
  }
})();
