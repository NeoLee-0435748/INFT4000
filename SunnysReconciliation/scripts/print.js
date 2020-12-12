/*
  Ref:
      https://www.geeksforgeeks.org/printing-in-electronjs/
*/
(() => {
  //imports & variables ---------------------------------------------------------
  const { ipcRenderer, remote } = require("electron"); //deconstruct imports
  const BrowserWindow = remote.BrowserWindow;
  const queryString = require("querystring");

  //declaration -----------------------------------------------------------------
  const purchaseTable = $("table[class='purchase-list']");
  const totalAmount = $(".total #amount");
  const yearMonth = $("#year-month");
  const printOptions = {
    silent: false,
    printBackground: true,
    color: false,
    margin: {
      marginType: "printableArea",
    },
    landscape: true,
    pagesPerSheet: 1,
    collate: false,
    copies: 1,
    header: "Header of the Page",
    footer: "Footer of the Page",
  };

  //IPC event functions ---------------------------------------------------------
  //catch get report (caller: index.js)
  ipcRenderer.on("create:report:result", (e, masterData, reportData, err) => {
    console.log("create:report:result");
    console.log(masterData);
    console.log(reportData);

    initTableBody();
    $.each(reportData, (index, value) => {
      appendTableColumn(purchaseTable, value, index);
    });

    totalAmount.html(`$ ${masterData[0].total}`);
    yearMonth.html(masterData[0].report_ym);

    //print out
    let win = BrowserWindow.getFocusedWindow();

    win.webContents.print(printOptions, (success, failureReason) => {
      if (!success) {
        console.log(failureReason);
      }

      console.log("Print Initiated");
    });
  });

  //functions for table ---------------------------------------------------------
  initTableBody = () => {
    purchaseTable.find("tbody").empty();
  };

  function appendTableColumn(table, rowData, rowIndex) {
    var rowArray = $.map(rowData, (value, index) => [value]);
    var lastRow = $("<tr/>").appendTo(table.find("tbody:last"));

    $.each(rowArray, function (colIndex, cData) {
      if (colIndex === 0) {
        lastRow.append($("<td/>").text(cData)).addClass("purchase-list");
      } else {
        lastRow.append($("<td/>").text(cData)).addClass("purchase-list td-align-center");
      }
    });
  }

  //Etc -------------------------------------------------------------------------
  $(document).ready(function () {
    const queryResult = queryString.parse(global.location.search);
    const data = JSON.parse(queryResult["?data"]);
    const searchYM = data.yyyymm;
    console.log(data);
    console.log(searchYM);

    ipcRenderer.send("create:report", searchYM); //send to index.js
  });
})();
