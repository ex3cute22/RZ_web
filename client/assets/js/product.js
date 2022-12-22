const ROOT_URL = 'http://127.0.0.1:8080/api';

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

let mineral;

const fetchMineral = async () => {
  let response = await fetch(
    `${ROOT_URL}/get_mineral?` +
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
  console.log(result.photos[0]);
  mineral = result;
  fillData(mineral.mineral, mineral.territories, mineral.photos);
};
fetchMineral();

const handleChangePhoto = (src) => {
  document.getElementById('main-img').src = src;
};

const onImageClick = (e) => {
  console.log(e.target.src);
  const mainImg = document.getElementById('main-img');
  // document.getElementById('main-img').src = e.target.src;
  mainImg.src = e.target.src;
  console.log(mainImg);
};

const onLoadHandler = () => {};

const fillData = (mineral, territories, photos) => {
  const aEdit = document.getElementById('a-edit');
  aEdit.onclick = () => {
    window.location.href = 'http://127.0.0.1:5500/pages/redact.html?id=' + id;
  };
  console.log(mineral);
  console.log(territories);
  document.getElementById('span-weight').textContent = mineral.weight;
  document.getElementById('span-height').textContent = mineral.height;
  document.getElementById('span-width').textContent = mineral.width;
  document.getElementById('span-lenght').textContent = mineral.length;
  document.getElementById('span-stone').textContent = mineral.stone_name;
  document.getElementById('name').textContent = mineral.name;
  document.getElementById('description').textContent = mineral.description;
  document.getElementById('span-territory').textContent =
    territories.join(', ');
  //setting photos
  const mainImg = document.createElement('img');
  mainImg.src = photos[0];
  mainImg.classList.add('main-img');
  mainImg.id = 'main-img';
  mainImg.alt = 'main-img';
  // main img = files[0]

  const wrapper = document.createElement('div');
  wrapper.classList.add('thumbnails');
  wrapper.id = 'thumbnails';
  //add thumbs
  photos.map((photo, index) => {
    const thumbPhoto = document.createElement('img');
    thumbPhoto.src = photo;
    thumbPhoto.alt = 'thumb-photo';
    thumbPhoto.onclick = (e) => {
      onImageClick(e);
    };
    wrapper.appendChild(thumbPhoto);
  });

  const images = document.getElementById('images');
  images.appendChild(mainImg);
  images.appendChild(wrapper);

  for (let img of wrapper.children) {
    img.onclick = (e) => {
      onImageClick(e);
    };
  }
};

document.addEventListener('DOMContentLoaded', onLoadHandler);
