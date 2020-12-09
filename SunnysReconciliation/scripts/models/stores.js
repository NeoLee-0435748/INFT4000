(() => {
  //functions for CRUD with purchases
  let tblName = "stores";

  //select all data
  function selectAll(knex, cb) {
    let query = knex(tblName).select("store_id as id", "store_name as name");

    query
      .then((rows) => {
        //   console.log(rows);
        cb(rows, null);
      })
      .catch((error) => cb(null, error));
  }

  //select by id
  function selectById(knex, storeId, cb) {
    let query = knex(tblName).select().where({
      store_id: storeId,
    });

    query
      .then((row) => {
        console.log(row);
        cb(row, null);
      })
      .catch((error) => cb(null, error));
  }

  //insert
  function create(knex, storeName, cb) {
    let query = knex(tblName).insert({
      store_name: storeName,
    });

    query
      .then(() => {
        console.log("new store inserted");
        cb(null);
      })
      .catch((error) => cb(error));
  }

  //update
  function modify(knex, storeData, cb) {
    let query = knex(tblName).where({ store_id: storeData[0] }).update({
      name: storeData[1],
    });

    query
      .then(() => {
        console.log("store updated");
        cb(null);
      })
      .catch((error) => cb(error));
  }

  //delete
  function remove(knex, storeId, cb) {
    let query = knex(tblName).where({ store_id: storeId }).del();

    query
      .then(() => {
        console.log("store deleted");
        cb(null);
      })
      .catch((error) => cb(error));
  }

  //delete all
  function removeAll(knex, cb) {
    let query = knex(tblName).del();

    query
      .then(() => {
        console.log("all store deleted");
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
