(() => {
  //imports ---------------------------------------------------------------------
  const { ipcRenderer } = require("electron"); //deconstruct imports
  const modelPurchases = require("../scripts/models/purchases");
  const modelStores = require("../scripts/models/stores");
  const modelPurposes = require("../scripts/models/purposes");
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
  //<<< Report window >>>
  //catch search report (caller: index.js)
  ipcRenderer.on("search:report", (e, searchYM) => {
    console.log("search:report => " + searchYM);
    modelPurchases.selectAll(knex, (data, err) => {
      // console.log(data);
      ipcRenderer.send("search:report:result", data, err);
    });
  });

  //<<< Settings window >>>
  //catch get all settings (caller: index.js)
  ipcRenderer.on("get:all:settings", (e) => {
    let allSettings = [];

    modelStores.selectAll(knex, (data, err) => {
      // console.log(data);
      allSettings.push(data);

      modelPurposes.selectAll(knex, (data, err) => {
        // console.log(data);
        allSettings.push(data);

        // console.log(allSettings);
        ipcRenderer.send("get:all:settings:result", allSettings, err);
      });
    });
  });

  //catch add store (caller: index.js)
  ipcRenderer.on("add:store", (e, storeName) => {
    modelStores.create(knex, storeName, (error) => {
      ipcRenderer.send("add:store:result", error);
    });
  });

  //catch delete store (caller: index.js)
  ipcRenderer.on("delete:store", (e, storeId) => {
    modelStores.remove(knex, storeId, (error) => {
      ipcRenderer.send("delete:store:result", error);
    });
  });

  //catch add purpose (caller: index.js)
  ipcRenderer.on("add:purpose", (e, purposeName) => {
    modelPurposes.create(knex, purposeName, (error) => {
      ipcRenderer.send("add:purpose:result", error);
    });
  });

  //catch delete purpose (caller: index.js)
  ipcRenderer.on("delete:purpose", (e, purposeId) => {
    modelPurposes.remove(knex, purposeId, (error) => {
      ipcRenderer.send("delete:purpose:result", error);
    });
  });

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
})();
