(() => {
  //imports & variables ---------------------------------------------------------
  const { ipcRenderer } = require("electron"); //deconstruct imports

  //declaration -----------------------------------------------------------------
  const btnPrint = $("#btn-print");
  const btnClose = $("#btn-close");

  //IPC event functions ---------------------------------------------------------
  //catch get report (caller: index.js)
  ipcRenderer.on("get:report:result", (e, data, err) => {
    console.log("get:report:result");
    console.log(data);
  });

  //catch add item (caller: index.js)
  // ipcRenderer.on("item:", (e, items) => {});

  //local event functions (call index.js) ---------------------------------------
  btnPrint.click((e) => {
    ipcRenderer.send("create:report", searchYM); //send to index.js
  });

  btnClose.click((e) => {
    window.switchPage("main");
  });

  //Etc -------------------------------------------------------------------------
  $(document).ready(function () {
    let date_input = $('input[name="report-date"]'); //our date input has the name "report-date"
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

    date_input.datepicker(options);

    date_input.datepicker().on("changeMonth", function (e) {
      console.log(e);
      console.log(e.date.getFullYear() + "-" + (e.date.getMonth() + 1));

      let searchYM = `${e.date.getFullYear()}-${e.date.getMonth() + 1}`;
      ipcRenderer.send("get:report", searchYM); //send to index.js
    });
  });
})();
