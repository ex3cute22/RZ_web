const ROOT_URL = 'http://127.0.0.1:8080/api';

let nameSearch = '';

const fetchStartData = async (page = 0) => {
  console.log(nameSearch);
  let response = await fetch(
    `http://localhost:8080/api/all_minerals?` +
      new URLSearchParams({
        page: 1,
        name: nameSearch,
      }),
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    },
  );
  let result = await response.json();
  const minerals = result.data;//;
  const totalPage = result.last_page;


  const items = [];
  for (let mineral of minerals) {
    const newItem = document.createElement('div');
    newItem.classList.add('item');
    const itemImg = document.createElement('img');
    itemImg.src = mineral?.photo;
    itemImg.alt = 'item img';
    const pItem = document.createElement('p');
    pItem.textContent = mineral.name;
    newItem.appendChild(itemImg);
    newItem.appendChild(pItem);
    const btn = document.createElement('button');
    btn.onclick = () => {
      window.location.href =
        'http://127.0.0.1:5500/pages/product.html?id=' + mineral.id;
    };
    btn.textContent = 'Подробнее';
    newItem.appendChild(btn);
    items.push(newItem);
  }
  document.getElementById('item-list').innerHTML = '';

  fillPage(items, totalPage);
};

const fetchMinerals = async () => {

};

const clearSelectedButtons = () => {
  const pages = document.getElementById('pages-list').childNodes;
  for (let page of pages) {
    page.classList.remove('selected');
  }
};

const changePage = async (e, page) => {
  clearSelectedButtons();
  e.target.classList.add('selected');
  let response = await fetch(
    `${ROOT_URL}/all_minerals?` +
      new URLSearchParams({
        page: page,
        name: '',
      }),
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    },
  );
  let result = await response.json();
  const minerals = result.data;
  const items = [];
  for (let mineral of minerals) {
    const newItem = document.createElement('div');
    newItem.classList.add('item');
    const itemImg = document.createElement('img');
    itemImg.src = mineral?.photo;
    itemImg.alt = 'item img';
    const pItem = document.createElement('p');
    pItem.textContent = mineral.name;
    newItem.appendChild(itemImg);
    newItem.appendChild(pItem);
    const btn = document.createElement('button');
    btn.onclick = () => {
      window.location.href =
        'http://127.0.0.1:5500/pages/product.html?id=' + mineral.id;
    };
    btn.textContent = 'Подробнее';
    newItem.appendChild(btn);
    items.push(newItem);
  }
  fillPage(items);
};

const searchByName = () => {

  nameSearch = document.getElementById('search-input').value;
  console.log(nameSearch);
  fetchStartData(0);
  //fetchMinerals(0);
};

const fillPage = (items, totalPages) => {
  const list = document.getElementById('item-list');
  list.innerHTML = '';
  for (let item of items) {
    list.appendChild(item);
  }
  const pagesWrapper = document.getElementById('pages-list');
  if (totalPages) {
    pagesWrapper.innerHTML = '';
    new Array(totalPages).fill(0).map((v, i) => {
      //console.log(i);
      const page = document.createElement('button');
      page.textContent = i + 1;
      if (i === 0) {
        page.classList.add('selected');
      }
      page.onclick = (e, page) => {
        changePage(e, i + 1);

      };

      pagesWrapper.appendChild(page);
    });
  }
};

  fetchStartData();

const loadHandler = () => {
  document.getElementById('search-btn').onclick = (e) => {
    searchByName();
  };
};

document.addEventListener('DOMContentLoaded', loadHandler);
