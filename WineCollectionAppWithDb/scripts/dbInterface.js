//functions for CRUD
//select all data
function selectAllWines(knex) {
    let query = knex.select("id", "name", "category", "type", "year", "winery", "purchased_year", "rating").from(tblName);
    query.then((rows) => {
        console.log(rows);
        rows.forEach(items => {
            addTableRow(items);
        });
    });

}

//select by id
function selectWineById(knex, wineId) {
    let query = knex(tblName)
        .select()
        .where({
            id: wineId
        });

    result = query.then(row => {
        console.log(row);
        return row;
    })
        .catch(err => {
            console.log(err)
        })
        .then(() => {
            console.log("select data")
        });

    return result;
}

//insert
function insertWine(knex, wineData) {
    let query = knex(tblName)
        .insert({
            "name": wineData[0],
            "category": wineData[1],
            "type": wineData[2],
            "year": wineData[3],
            "winery": wineData[4],
            "purchased_year": wineData[5],
            "rating": wineData[6]
        });

    query.then(() => console.log("wine item inserted"))
        .catch(err => console.log(err))
        .then(() => console.log("insert finished!!!"));
}

//update
function updateWine(knex, wineData) {
    let query = knex(tblName)
        .where('id', wineData[7])
        .update({
            "name": wineData[0],
            "category": wineData[1],
            "type": wineData[2],
            "year": wineData[3],
            "winery": wineData[4],
            "purchased_year": wineData[5],
            "rating": wineData[6]
        });

    query.then(() => console.log("wine item updated"))
        .catch(err => console.log(err))
        .then(() => console.log("update finished!!!"));
}

//delete
function deleteWine(knex, wineId) {
    let query = knex(tblName)
        .where("id", wineId)
        .del();

    query.then(() => console.log("wine item deleted"))
        .catch(err => console.log(err))
        .then(() => console.log("delete finished!!!"));
}

//delete
function deleteAllWines(knex) {
    let query = knex(tblName)
        .del();

    query.then(() => console.log("all wine item deleted"))
        .catch(err => console.log(err))
        .then(() => console.log("delete finished!!!"));
}

module.exports = {
    selectAllWines: selectAllWines,
    selectWineById: selectWineById,
    insertWine: insertWine,
    updateWine: updateWine,
    deleteAllWines: deleteAllWines,
    deleteWine: deleteWine,
}