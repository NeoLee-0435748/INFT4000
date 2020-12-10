(() => {
  //functions for CRUD with purchases
  let tblName = "purchases";

  //select all data
  function selectAll(knex, cb) {
    let query = knex(tblName)
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
        //   console.log(rows);
        cb(rows, null);
      })
      .catch((error) => cb(null, error));
  }

  //select by id
  function selectById(knex, wineId, cb) {
    let query = knex(tblName).select().where({
      purchase_id: wineId,
    });

    query
      .then((row) => {
        // console.log(row);
        cb(row, null);
      })
      .catch((error) => cb(null, error));
  }

  //insert
  function create(knex, purchaseData, cb) {
    let query = knex(tblName).insert({
      purchase_date: purchaseData[0],
      store_id: purchaseData[1],
      purpose_id: purchaseData[2],
      amount: purchaseData[3],
      receipt_yn: purchaseData[4],
    });

    query
      .then(() => {
        console.log("new purchase inserted");
        cb(null);
      })
      .catch((error) => cb(error));
  }

  //update
  function modify(knex, purchaseId, purchaseData, cb) {
    let query = knex(tblName).where("id", purchaseId).update({
      purchase_date: purchaseData[0],
      store_id: purchaseData[1],
      purpose_id: purchaseData[2],
      amount: purchaseData[3],
      receipt_yn: purchaseData[4],
    });

    query
      .then(() => {
        console.log("purchase updated");
        cb(null);
      })
      .catch((error) => cb(error));
  }

  //delete
  function remove(knex, purchaseId) {
    let query = knex(tblName).where("id", purchaseId).update({
      delete_yn: "Y",
    });

    query
      .then(() => {
        console.log("purchase deleted");
        cb(null);
      })
      .catch((error) => cb(error));
  }

  //delete all
  function removeAll(knex, cb) {
    let query = knex(tblName).update({
      delete_yn: "Y",
    });

    query
      .then(() => {
        console.log("all purchase deleted");
        cb(null);
      })
      .catch((error) => cb(error));
  }

  module.exports = {
    selectAll: selectAll,
    selectById: selectById,
    create: create,
    modify: modify,
    remove: remove,
    removeAll: removeAll,
  };
})();
