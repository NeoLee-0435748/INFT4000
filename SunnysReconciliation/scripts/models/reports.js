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
    console.log(subQuery1.toSQL());

    const subQuery2 = knex("purchases")
      .where("purchase_date", "like", `${reportYM}%`)
      .andWhere("delete_yn", "=", "N")
      .groupBy(knex.raw(`substr(purchase_date, 1, 7)`))
      .select(knex.raw(`substr(purchase_date, 1, 7) as report_ym, round(sum(amount),2) as total`));
    console.log(subQuery2.toSQL());

    const query = knex(subQuery1.as("t1"))
      .join(subQuery2.as("t2"))
      .select(
        knex.raw(`ifnull(t1.report_ym, t2.report_ym) as report_ym`),
        knex.raw(`ifnull(t1.report_seq + 1, 1) as report_seq`),
        "t2.total as total"
      );
    console.log(query.toSQL());

    query
      .then((row) => {
        console.log(row);
        cb(row, null);
      })
      .catch((error) => {
        console.log(error);
        cb(null, error);
      });
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
      .catch((error) => {
        console.log(error);
        cb(error);
      });
  }

  //insert
  function createDetail(knex, data, cb) {
    const query = knex("reports_detail").insert({
      report_ym: data.report_ym,
      report_seq: data.report_seq,
      seq_no: data.seq_no,
      store_name: data.store_name,
      purpose_name: data.purpose_name,
      amount: data.amount,
      receipt_yn: data.receipt_yn,
    });

    query
      .then(() => {
        console.log("new report detail inserted");
        cb(null);
      })
      .catch((error) => {
        console.log(error);
        cb(error);
      });
  }

  //select detail report data
  function selectDetail(knex, reportYM, reportSeq, cb) {
    let query = knex("reports_detail")
      .where({
        report_ym: reportYM,
        report_seq: reportSeq,
      })
      .select(
        knex.raw("seq_no || '. ' || store_name as store"),
        knex.raw("'$' || amount"),
        "purpose_name",
        "receipt_yn"
      );

    query
      .then((rows) => {
        console.log(rows);
        cb(rows, null);
      })
      .catch((error) => {
        console.log(error);
        cb(null, error);
      });
  }

  module.exports = {
    selectReport: selectReport,
    selectNewMaster: selectNewMaster,
    createMaster: createMaster,
    createDetail: createDetail,
    selectDetail: selectDetail,
  };
})();
