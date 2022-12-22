export let stonesData = [];
export let territoriesData = [];

const ROOT_URL = 'http://127.0.0.1:8080/api';

const fetchStones = async () => {
  let response = await fetch(`${ROOT_URL}/all_stones`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });

  let result = await response.json();
  stonesData = result;
  const select = document.getElementById('select-stone');
  for (let stone of result) {
    if (!select) return;
    let option = document.createElement('option');
    option.value = stone.id;
    option.text = stone.name;
    select.appendChild(option);
  }
};

const fetchTerritories = async () => {
  let response = await fetch(`${ROOT_URL}/all_territories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });

  let result = await response.json();
  territoriesData = result;
  const select = document.getElementById('select-territory');
  for (let territory of result) {
    if (!select) return;
    let option = document.createElement('option');
    option.value = territory.id;
    option.text = territory.name;
    select.appendChild(option);
  }
};

export const fetchData = () => {
  fetchStones();
  fetchTerritories();
};

// export default fetchData;
