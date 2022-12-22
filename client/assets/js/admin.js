// console.log('hello');
import { fetchData, stonesData, territoriesData } from './fetchData.js';

//const ROOT_URL = 'http://vinokurovandrey.site/';
const ROOT_URL = 'http://127.0.0.1:8080/';

const MAX_FILE_COUNT = 4;

let files = [];

const submitMineralData = async () => {
  const nameInput = document.getElementById('input-name');
  const weightInput = document.getElementById('input-weight');
  const widthInput = document.getElementById('input-width');
  const lengthInput = document.getElementById('input-length');
  const heightInput = document.getElementById('input-height');

  const territorySelect = document.querySelectorAll('[id=select-territory]');
  const selectValues = [];
  for (let select of territorySelect) {
    selectValues.push(select.value);
  }
  const stoneSelect = document.getElementById('select-stone');
  const descriptionTextArea = document.getElementById('description');
  console.log(files);

  const base64Files = [];
  for (let file of files) {
    base64Files.push(await readFileAsync(file));
  }
  // console.log('done' + base64Files);
  // console.log(base64Files);
  const newMineral = {
    name: nameInput.value,
    weight: weightInput.value,
    width: widthInput.value,
    length: lengthInput.value,
    height: heightInput.value,
    territories: selectValues,
    stone: stoneSelect.value,
    description: descriptionTextArea.value,
    photos: base64Files,
  };
  const response = await fetch(`${ROOT_URL}api/create_mineral`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newMineral),
  });

  let result = await response.json();
  console.log(result);
};

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      console.log('readed');
      resolve(reader.result.toString().replace(/^data:(.*,)?/, ''));
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

const submitStoneData = async () => {
  const name = document.getElementById('new-stone-input').value;
  let response = await fetch(`${ROOT_URL}api/create_stone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ name: name }),
  });

  let result = await response.json();
  stonesData.push(result);
  let option = document.createElement('option');
  option.value = result.id;
  option.text = result.name;
  document.getElementById('select-stone').append(option);
};

const submitTerritoryData = async () => {
  const name = document.getElementById('new-territory-input').value;
  let response = await fetch(`${ROOT_URL}api/create_territory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ name: name }),
  });

  let result = await response.json();
  territoriesData.push(result);
  let option = document.createElement('option');
  option.value = result.id;
  option.text = result.name;
  document.getElementById('select-territory').append(option);
};

const onLoadHandler = () => {
  fetchData();
  document.getElementById('send-mineral').onclick = submitMineralData;
  const addTerritoryBtn = document.getElementById('add-territory');
  addTerritoryBtn.onclick = () => handleAddTerritoryClick(addTerritoryBtn);
  document.getElementById('new-stone-btn').onclick = submitStoneData;
  document.getElementById('new-territory-btn').onclick = submitTerritoryData;
  document.getElementById('formFileLg').onchange = (e) => onFileLoad(e);
};

const onDeleteImg = (id) => {
  files = files.filter((file) => file.name != id);
  document.getElementById(id).remove();
  console.log(files);
};

const onFileLoad = async (e) => {
  if (e.target.files.length + files.length > MAX_FILE_COUNT) {
    alert('MAX FILES COUNT ' + MAX_FILE_COUNT);
    return;
  }
  const thumbnails = document.getElementById('thumbnails');

  for (let file of e.target.files) {
    files.push(file);
    let reader = new FileReader();
    reader.onload = function () {
      const wrapper = document.createElement('div');
      wrapper.id = file.name;
      wrapper.onclick = () => {
        onDeleteImg(file.name);
      };
      wrapper.classList.add('thumb-img');
      const deleteBtn = document.createElement('img');
      deleteBtn.src = '/assets/images/trash.svg';
      deleteBtn.alt = 'delete';
      deleteBtn.classList.add('delete-img');
      wrapper.appendChild(deleteBtn);
      const image = document.createElement('img');
      image.src = reader.result;
      image.alt = 'delete';
      image.classList.add('image-prod');
      wrapper.appendChild(image);
      thumbnails.appendChild(wrapper);
    };
    reader.readAsDataURL(file);
  }
  console.log(files);
};

const handleAddTerritoryClick = (addTerritoryBtn) => {
  const newSelect = document.createElement('select');
  newSelect.id = 'select-territory';
  const placeHolder = document.createElement('option');
  placeHolder.value = '';
  placeHolder.text = 'Выберите страну';
  placeHolder.disabled = true;
  placeHolder.selected = true;
  newSelect.appendChild(placeHolder);
  for (let territory of territoriesData) {
    let option = document.createElement('option');
    option.value = territory.id;
    option.text = territory.name;
    newSelect.appendChild(option);
  }
  console.log(addTerritoryBtn);
  addTerritoryBtn.insertAdjacentElement('beforeBegin', newSelect);
};

document.addEventListener('DOMContentLoaded', onLoadHandler);
