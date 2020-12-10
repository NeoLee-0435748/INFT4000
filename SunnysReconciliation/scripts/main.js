(() => {
  //imports ---------------------------------------------------------------------
  const { ipcRenderer } = require("electron"); //deconstruct imports
  const modelPurchases = require("../scripts/models/purchases");
  const modelReports = require("../scripts/models/reports");
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
  const btnReport = $("#report");
  const btnPurchase = $("#purchase");
  const btnSettings = $("#settings");
  const btnQuit = $("#quit");

  //IPC event functions ---------------------------------------------------------
  //<<< Report window >>>
  //catch search report (caller: index.js)
  ipcRenderer.on("get:report", (e, searchYM) => {
    console.log("get:report => " + searchYM);
    modelReports.selectReport(knex, searchYM, (data, err) => {
      console.log(err);
      ipcRenderer.send("get:report:result", data, err);
    });
  });

  //catch make report for printing (caller: index.js)
  ipcRenderer.on("create:report", (e, searchYM) => {
    console.log("create:report => " + searchYM);
    modelReports.selectNewMaster(knex, searchYM, (data, err) => {
      console.log(err);
      if (data) {
        modelReports.createMaster(knex, data, (err) => {
          if (!err) {
            modelReports.createDetail();
          }
        });
      }
    });

    // ipcRenderer.send("create:report:result", data, err);
  });

  //<<< Purchase window >>>
  //catch add purchase (caller: index.js)
  ipcRenderer.on("add:purchase", (e, purchaseData) => {
    modelPurchases.create(knex, purchaseData, (error) => {
      ipcRenderer.send("add:purchase:result", error);
    });
  });

  //<<< Settings window >>>
  //catch get all settings (caller: index.js)
  ipcRenderer.on("get:all:settings", (e, sender) => {
    let allSettings = [];

    modelStores.selectAll(knex, (data, err) => {
      // console.log(data);
      allSettings.push(data);

      modelPurposes.selectAll(knex, (data, err) => {
        // console.log(data);
        allSettings.push(data);

        // console.log(allSettings);
        ipcRenderer.send("get:all:settings:result", allSettings, sender, err);
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
  btnReport.click(() => {
    window.switchPage("report");
  });

  btnPurchase.click(() => {
    ipcRenderer.send("open:purchaseWindow"); //send to index.js
  });

  btnSettings.click(() => {
    ipcRenderer.send("open:settingsWindow"); //send to index.js
  });

  btnQuit.click(() => {
    ipcRenderer.send("quit:theApp"); //send to index.js
  });

  //Etc -------------------------------------------------------------------------
})();
