(() => {
  //functions for CRUD with purchases
  //for screen ----------------------------------------------------------------
  //select report data
  function selectReport(knex, reportYM, cb) {
    let query = knex("purchases")
      .whereRaw("purchase_date like ?", [reportYM + "%"])
      .where({
        delete_yn: "N",
      })
      .join("stores", "purchases.store_id", "=", "stores.store_id")
      .join("purposes", "purchases.purpose_id", "=", "purposes.purpose_id")
      .select(
        "purchases.purchase_id as id",
        "purchases.purchase_date as date",
        "stores.store_name as store_name",
        "purposes.purpose_name as purpose_name",
        "purchases.amount as amount",
        "purchases.receipt_yn as receipt_yn"
      );

    query
      .then((rows) => {
        console.log(rows);
        cb(rows, null);
      })
      .catch((error) => cb(null, error));
  }

  //for printing --------------------------------------------------------------
  //insert report_master
  function selectNewMaster(knex, reportYM, cb) {
    const subQuery1 = knex("reports_master")
      .where({ report_ym: reportYM })
      .select("report_ym", knex.raw(`max(report_seq) as report_seq`));
    // console.log(subQuery1.toSQL());

    const subQuery2 = knex("purchases")
      .where("purchase_date", "like", `${reportYM}%`)
      .groupBy(knex.raw(`substr(purchase_date, 1, 7)`))
      .select(knex.raw(`substr(purchase_date, 1, 7) as report_ym, sum(amount) as total`));
    // console.log(subQuery2.toSQL());

    const query = knex(subQuery1.as("t1"))
      .join(subQuery2.as("t2"))
      .select(
        knex.raw(`ifnull(t1.report_ym, t2.report_ym) as report_ym`),
        knex.raw(`ifnull(t1.report_seq + 1, 1) as report_seq`),
        "t2.total as total"
      );
    // console.log(query.toSQL());

    query
      .then((row) => {
        //   console.log(row);
        cb(row, null);
      })
      .catch((error) => cb(null, error));
  }

  //insert
  function createMaster(knex, data, cb) {
    const query = knex("reports_master").insert({
      report_ym: data.report_ym,
      report_seq: data.report_seq,
      total: data.total,
    });

    query
      .then(() => {
        console.log("new report master inserted");
        cb(null);
      })
      .catch((error) => cb(error));
  }

  module.exports = {
    selectReport: selectReport,
    selectNewMaster: selectNewMaster,
    createMaster: createMaster,
  };
})();
