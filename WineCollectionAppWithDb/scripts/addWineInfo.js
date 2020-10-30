const electron = require('electron');
const { ipcRenderer } = electron;
const validations = require('../scripts/validation');

const form = document.querySelector('form');
const selCategory = document.getElementById('category');

//add data
form.addEventListener('submit', submitForm);

function submitForm(e) {
  e.preventDefault();

  //get data
  const valCategory = document.querySelector('#category').options[document.querySelector('#category').selectedIndex].value;
  let valType = '';
  if (valCategory.valueOf() == 'Red') {
    valType = document.querySelector('#red_type').options[document.querySelector('#red_type').selectedIndex].value;
  }
  else if (valCategory.valueOf() == 'White') {
    valType = document.querySelector('#white_type').options[document.querySelector('#white_type').selectedIndex].value;
  }
  else {
    valType = document.querySelector('#dessert_type').options[document.querySelector('#dessert_type').selectedIndex].value;
  }

  const items = [
    document.querySelector('#name').value,
    valCategory,
    valType,
    document.querySelector('#year').value,
    document.querySelector('#winery').value,
    document.querySelector('#purch').value,
    document.querySelector('#rating').value
  ];

  //check validations
  const errors = validations.submitErrors(items);
  if (errors.length === 0) {
    ipcRenderer.send('item:add', items);//send to index.js
  } else {
    validations.clearErrors()
    errors.forEach(error => {
      const key = Object.keys(error)[0];
      document.getElementById(key).innerText = error[key];
      document.getElementById(key).hidden = false;
    });
  }
}

//category selected
selCategory.addEventListener('change', selectedCategory);

function selectedCategory(e) {
  const selCat = document.getElementById('category');
  const selType1 = document.getElementById('red_type');
  const selType2 = document.getElementById('white_type');
  const selType3 = document.getElementById('dessert_type');
  const selValue = selCat.options[selCat.selectedIndex].value;

  if (selValue.valueOf() == 'Red') {
    selType1.style.display = 'block';
    selType2.style.display = 'none';
    selType3.style.display = 'none';
  }
  else if (selValue.valueOf() == 'White') {
    selType1.style.display = 'none';
    selType2.style.display = 'block';
    selType3.style.display = 'none';
  }
  else {
    selType1.style.display = 'none';
    selType2.style.display = 'none';
    selType3.style.display = 'block';
  }
}