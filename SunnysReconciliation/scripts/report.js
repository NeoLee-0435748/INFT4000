(() => {
  /*Ref:
    - https://www.htmlgoodies.com/beyond/css/working_w_tables_using_jquery.html
  */

  //imports & variables ---------------------------------------------------------
  const { ipcRenderer } = require("electron"); //deconstruct imports

  //variables -------------------------------------------------------------------
  const reportTable = $("#report-table");
  const totalAmount = $("#total-amount");
  const dialogDelete = $("#dialog-delete");
  let searchYM;

  //declaration -----------------------------------------------------------------
  const btnPrint = $("#btn-print");
  const btnClose = $("#btn-close");

  //IPC event functions ---------------------------------------------------------
  //catch get report (caller: index.js)
  ipcRenderer.on("get:report:result", (e, reportData, totalData, err) => {
    console.log("get:report:result");
    console.log(reportData);
    console.log(totalData);

    initTableBody();
    $.each(reportData, (index, value) => {
      appendTableColumn(reportTable, value, index);
    });

    totalAmount.val(totalData[0].total);
  });

  //catch get report (caller: index.js)
  ipcRenderer.on("edit:purchase:result", (e, err) => {
    console.log("edit:purchase:result");

    ipcRenderer.send("get:report", searchYM); //send to index.js
  });

  //catch delete purchase (caller: index.js)
  ipcRenderer.on("delete:purchase:result", (e, reportData, totalData, err) => {
    console.log("delete:purchase:result");
    console.log(reportData);
    console.log(totalData);

    initTableBody();
    $.each(reportData, (index, value) => {
      appendTableColumn(reportTable, value, index);
    });

    totalAmount.val(totalData[0].total);

  });

  //local event functions (call index.js) ---------------------------------------
  btnPrint.click((e) => {
    ipcRenderer.send("create:report", searchYM); //send to index.js
  });

  btnClose.click((e) => {
    editPurchaseId = null;
    window.switchPage("main");
  });

  //functions for table ---------------------------------------------------------
  initTableBody = () => {
    reportTable.find("tbody").empty();
  };

  function makeTable(container, data) {
    var table = $("<table/>").addClass("CSSTableGenerator");
    $.each(data, function (rowIndex, r) {
      var row = $("<tr/>");
      $.each(r, function (colIndex, c) {
        row.append($("<t" + (rowIndex == 0 ? "h" : "d") + "/>").text(c));
      });
      table.append(row);
    });
    return container.append(table);
  }

  function appendTableColumn(table, rowData, rowIndex) {
    var colClass = ["col-1", "col-2", "col-2", "col-3", "col-1", "col-1", "col-1", "col-1"];
    var rowArray = $.map(rowData, (value, index) => [value]);
    var lastRow = $("<tr/>").appendTo(table.find("tbody:last"));

    lastRow.addClass("d-flex");
    $.each(rowArray, function (colIndex, cData) {
      lastRow.append(
        $("<td/>")
          .text(colIndex === 0 ? rowIndex + 1 : cData)
          .addClass(colClass[colIndex])
      );
    });

    //edit button
    const editButton = $("<button/>")
      .text("Edit")
      .addClass("btn btn-primary col-1 btn-edit-purchase")
      .click((e) => {
        console.log("edit button clicked with id: " + rowArray[0]);
        ipcRenderer.send("open:edit:purchase", rowArray[0]); //send to index.js
      });
    editButton.appendTo(lastRow);

    //delete button
    const deleteButton = $("<button/>")
      .text("Delete")
      .addClass("btn btn-warning col-1 btn-delete-purchase")
      .click((e) => {
        console.log("delete button clicked with id: " + rowArray[0]);
        dialogDelete.data("purchaseId", rowArray[0]).dialog("open");
      });
    deleteButton.appendTo(lastRow);

    return lastRow;
  }

  //Etc -------------------------------------------------------------------------
  $(document).ready(function () {
    //for datepicker
    let dateInput = $('input[name="report-date"]'); //our date input has the name "report-date"
    let container = $(".input-group.date").length > 0 ? $(".input-group.date").parent() : "body";
    let options = {
      format: "yyyy-mm",
      container: container,
      startView: 1,
      minViewMode: 1,
      maxViewMode: 2,
      // todayBtn: true,
      autoclose: true,
      // icons: {
      //   time: "fa fa-clock-o",
      //   date: "fa fa-calendar",
      //   up: "fa fa-arrow-up",
      //   down: "fa fa-arrow-down",
      //   previous: "fa fa-chevron-left",
      //   next: "fa fa-chevron-right",
      //   today: "fa fa-clock-o",
      //   clear: "fa fa-trash-o",
      // },
    };

    dateInput.datepicker(options);

    dateInput.datepicker().on("changeMonth", function (e) {
      console.log(e);
      console.log(e.date.getFullYear() + "-" + (e.date.getMonth() + 1));

      searchYM = `${e.date.getFullYear()}-${e.date.getMonth() + 1}`;
      ipcRenderer.send("get:report", searchYM); //send to index.js
    });
  });

  dialogDelete.dialog({
    autoOpen: false,
    buttons: {
      Yes: function () {
        let purchaseId = $(this).data("purchaseId");
        ipcRenderer.send("delete:purchase", purchaseId, searchYM); //send to index.js
        $(this).dialog("close");
      },
      No: function () {
        $(this).dialog("close");
      },
    },
  });
})();
