/*
    References:
    - https://github.com/mapbox/node-sqlite3/issues/441
*/
const electron = require('electron');
const { ipcRenderer } = electron;

const btnAdd = document.getElementById('add');
const btnClear = document.getElementById('clear');
const tblList = document.getElementById('winelistbody');

const dbInterface = require('../scripts/dbInterface');
const path = require('path');
let sqlite3 = require("sqlite3");
const knexOptions = {
  client: "sqlite3",
  connection: { filename: path.resolve(__dirname, "../database/wine.db") },
  useNullAsDefault: true,
  debug: true
};
let knex = require("knex")(knexOptions);
const tblName = 'wine_list';

//IPC event functions
//catch add item (caller: index.js)
ipcRenderer.on('item:add', (e, items) => {
  dbInterface.insertWine(knex, items);

  displayAllData();
});

//catch update item (caller: index.js)
ipcRenderer.on('item:update', (e, items) => {
  dbInterface.updateWine(knex, items);

  displayAllData();
});

//item clear (caller: index.js)
ipcRenderer.on('item:clear', () => {
  dbInterface.deleteAllWines(knex);

  tableInit();
});

//process functions
//display all data to the table
function displayAllData() {
  tableInit();

  dbInterface.selectAllWines(knex, addTableRow);
}

//table initialize
function tableInit() {
  tblList.innerHTML = '';
}

//add table row
function addTableRow(items) {
  const newTr = document.createElement('tr');
  let newTd;
  let newItem;

  //make columns using wine data from the input window
  //name
  newTd = document.createElement('td');
  newItem = document.createTextNode(items['name']);
  newTd.appendChild(newItem);
  newTr.appendChild(newTd);
  //category
  newTd = document.createElement('td');
  newItem = document.createTextNode(items['category']);
  newTd.appendChild(newItem);
  newTr.appendChild(newTd);
  //type
  newTd = document.createElement('type');
  newItem = document.createTextNode(items['type']);
  newTd.appendChild(newItem);
  newTr.appendChild(newTd);
  //year
  newTd = document.createElement('td');
  newItem = document.createTextNode(items['year']);
  newTd.style.textAlign = 'center';
  newTd.appendChild(newItem);
  newTr.appendChild(newTd);
  //winery
  newTd = document.createElement('td');
  newItem = document.createTextNode(items['winery']);
  newTd.appendChild(newItem);
  newTr.appendChild(newTd);
  //purchased_year
  newTd = document.createElement('td');
  newItem = document.createTextNode(items['purchased_year']);
  newTd.style.textAlign = 'center';
  newTd.appendChild(newItem);
  newTr.appendChild(newTd);
  //rating
  newTd = document.createElement('td');
  newItem = document.createTextNode(items['rating']);
  newTd.style.textAlign = 'center';
  newTd.appendChild(newItem);
  newTr.appendChild(newTd);
  //update button
  newTd = document.createElement('td');
  newImage = document.createElement('IMG');
  newImage.className = 'update_btn';
  newImage.src = '../images/update.jpg';
  newImage.width = 20;
  newImage.height = 20;
  newImage.onclick = function () { updateButtonClicked(items) };
  newTd.style.textAlign = 'center';
  newTd.appendChild(newImage);
  newTr.appendChild(newTd);
  //delete button
  newTd = document.createElement('td');
  newImage = document.createElement('IMG');
  newImage.className = 'delete_btn';
  newImage.src = '../images/delete.jpg';
  newImage.width = 20;
  newImage.height = 20;
  newImage.onclick = function () { deleteButtonClicked(items['id']) };
  newTd.style.textAlign = 'center';
  newTd.appendChild(newImage);
  newTr.appendChild(newTd);

  //change tr's background depends on a category
  switch (items['category']) {
    case 'Red':
      newTr.style.backgroundColor = '#ff0066';
      break;
    case 'Dessert':
      newTr.style.backgroundColor = '#ffcc00';
      break;
    case 'White':
      newTr.style.backgroundColor = 'White';
      break;
    default:
      break;
  }
  newTr.style.opacity = 0.8;

  tblList.appendChild(newTr);
}

//call add function in main.js
btnAdd.addEventListener('click', openAddWindow);

function openAddWindow(e) {
  ipcRenderer.send('open:addWindow');//send to index.js
}

//call clear items function in main.js
btnClear.addEventListener('click', clearItems);

function clearItems(e) {
  ipcRenderer.send('clear:items');//send to index.js
}

window.addEventListener('load', function () {
  dbInterface.selectAllWines(knex, addTableRow);
});

//add buttons events
function updateButtonClicked(items) {
  ipcRenderer.send('open:updateWindow', items);//send to index.js
}

function deleteButtonClicked(wineId) {
  result = confirm('Are you sure you want to delete this item?')

  if (result) {
    dbInterface.deleteWine(knex, wineId);

    displayAllData();
  }
}