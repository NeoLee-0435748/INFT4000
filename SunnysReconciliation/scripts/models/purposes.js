(() => {
  //functions for CRUD with purchases
  let tblName = "purposes";

  //select all data
  function selectAll(knex, cb) {
    let query = knex(tblName).select("purpose_id as id", "purpose_name as name");

    query
      .then((rows) => {
        //   console.log(rows);
        cb(rows, null);
      })
      .catch((error) => cb(null, error));
  }

  //select by id
  function selectById(knex, purposeId, cb) {
    let query = knex(tblName).select().where({
      purpose_id: purposeId,
    });

    query
      .then((row) => {
        console.log(row);
        cb(row, null);
      })
      .catch((error) => cb(null, error));
  }

  //insert
  function create(knex, purposeName, cb) {
    let query = knex(tblName).insert({
      purpose_name: purposeName,
    });

    query
      .then(() => {
        console.log("new purpose inserted");
        cb(null);
      })
      .catch((error) => cb(error));
  }

  //update
  function modify(knex, purposeData, cb) {
    let query = knex(tblName).where({ purpose_id: purposeData[0] }).update({
      name: purposeData[1],
    });

    query
      .then(() => {
        console.log("purpose updated");
        cb(null);
      })
      .catch((error) => cb(error));
  }

  //delete
  function remove(knex, purposeId, cb) {
    let query = knex(tblName).where({ purpose_id: purposeId }).del();

    query
      .then(() => {
        console.log("purpose deleted");
        cb(null);
      })
      .catch((error) => cb(error));
  }

  //delete all
  function removeAll(knex, cb) {
    let query = knex(tblName).del();

    query
      .then(() => {
        console.log("all purpose deleted");
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
