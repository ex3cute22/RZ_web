import { fetchData, stonesData, territoriesData } from './fetchData.js';

const ROOT_URL = 'http://127.0.0.1:8080/';
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const MAX_FILE_COUNT = 4;

let files = [];
let deletedUrls = [];

let photos = [];

let buttonAddTerritory;

fetchData();

const fetchMineral = async () => {
  let response = await fetch(
    `${ROOT_URL}api/get_mineral_edit?` +
      new URLSearchParams({
        id_mineral: id,
      }),
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    },
  );

  let result = await response.json();
  console.log(result);
  fetchPhotos(result.photos);
  fillData(result.mineral, result.territories);
};
fetchMineral();

const fetchPhotos = (photoUrls) => {
  console.log('fetching photos...', photoUrls);
  const thumbnails = document.getElementById('thumbnails');
  for (let [index, url] of photoUrls.entries()) {
    const wrapper = document.createElement('div');
    wrapper.id = 'img' + index;
    wrapper.onclick = () => {
      onDeleteUrl(url, wrapper.id);
    };
    wrapper.classList.add('thumb-img');
    const deleteBtn = document.createElement('img');
    deleteBtn.src = '/assets/images/trash.svg';
    deleteBtn.alt = 'delete';
    deleteBtn.classList.add('delete-img');
    wrapper.appendChild(deleteBtn);
    const image = document.createElement('img');
    image.src = url;
    image.alt = 'img';
    image.classList.add('image-prod');
    wrapper.appendChild(image);
    thumbnails.appendChild(wrapper);
  }

  // fetch(photoUrls[0]).then((response) => console.log(response));
  // for (let url of urls) {
  //   fetch(url);
  //   console.log(response);
  // }
};

const onDeleteUrl = (url, id) => {
  deletedUrls.push(url);
  document.getElementById(id).remove();
  console.log(deletedUrls);
};

const onDeleteImg = (id) => {
  files = files.filter((file) => file.name != id);
  document.getElementById(id).remove();
  console.log(files);
};

const deleteMineral = async () => {
  console.log('deleted');
  let response = await fetch(
    `${ROOT_URL}api/delete_mineral?` +
      new URLSearchParams({
        id_mineral: id,
      }),
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    },
  );
  window.location.href = 'http://127.0.0.1:5500/';
  console.log(response);
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

const saveMineral = async () => {
  console.log('save mineral');
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
  const base64Files = [];
  for (let file of files) {
    base64Files.push(await readFileAsync(file));
  }
  const newMineral = {
    id_mineral: id,
    name: nameInput.value,
    weight: weightInput.value,
    width: widthInput.value,
    length: lengthInput.value,
    height: heightInput.value,
    territories: selectValues,
    stone: stoneSelect.value,
    description: descriptionTextArea.value,
    delete_photos: deletedUrls,
    photos: base64Files,
  };
  console.log(newMineral);
  let response = await fetch(`${ROOT_URL}api/change_mineral`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(newMineral),
  });
  window.location.href = 'http://127.0.0.1:5500/pages/product.html?id=' + id;
  console.log(response);
};

const fillData = (mineral, territories) => {
  console.log(mineral);
  document.getElementById('input-name').value = mineral.name;
  document.getElementById('input-width').value = mineral.width;
  document.getElementById('input-height').value = mineral.height;
  document.getElementById('input-length').value = mineral.length;
  document.getElementById('input-weight').value = mineral.weight;
  document.getElementById('description').value = mineral.description;
  for (let territory of territories) {
    const newSelect = fillSelectWithOptions(territoriesData);
    newSelect.value = territory;
    console.log(newSelect);
    buttonAddTerritory.insertAdjacentElement('beforeBegin', newSelect);
  }
  const selectStone = document.getElementById('select-stone');
  selectStone.value = mineral.id_stone;
};

const fillSelectWithOptions = (options) => {
  const newSelect = document.createElement('select');
  newSelect.id = 'select-territory';
  console.log(options);
  for (let value of options) {
    console.log(value);
    const newOption = document.createElement('option');
    newOption.value = value.id;
    newOption.text = value.name;
    newSelect.appendChild(newOption);
  }
  console.log(newSelect);
  return newSelect;
};

const onLoadHandler = () => {
  document.getElementById('save-btn').onclick = saveMineral;
  buttonAddTerritory = document.getElementById('add-territory');
  buttonAddTerritory.onclick = () => handleAddTerritory(buttonAddTerritory);
  document.getElementById('del-btn').onclick = deleteMineral;
  document.getElementById('formFileLg').onchange = (e) => onFileLoad(e);
};

const handleAddTerritory = () => {
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
  console.log(buttonAddTerritory);
  buttonAddTerritory.insertAdjacentElement('beforeBegin', newSelect);
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

document.addEventListener('DOMContentLoaded', onLoadHandler);
