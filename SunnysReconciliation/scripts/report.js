//imports ---------------------------------------------------------------------
const { ipcRenderer } = require("electron"); //deconstruct imports

//declaration -----------------------------------------------------------------
const btnPrint = document.getElementById("btn-print");
const btnClose = document.getElementById("btn-close");

//IPC event functions ---------------------------------------------------------
//catch add item (caller: index.js)
// ipcRenderer.on("item:", add(e, items) => {});

//catch add item (caller: index.js)
// ipcRenderer.on("item:", edit(e, items) => {});

//local event functions (call index.js) ---------------------------------------
// btnPrint.addEventListener("click", openPrintWindow);
btnClose.addEventListener("click", closeWindow);

function closeWindow(e) {
  window.switchPage("main");
}

//Etc -------------------------------------------------------------------------
$(document).ready(function () {
  var date_input = $('input[name="report-date"]'); //our date input has the name "date"
  var container = $(".input-group.date").length > 0 ? $(".input-group.date").parent() : "body";
  var options = {
    format: "yyyy-mm",
    container: container,
    startView: 1,
    minViewMode: 1,
    maxViewMode: 2,
    todayBtn: true,
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

  date_input.datepicker(options);
});
