const GET_ALL_COUNTRY_DETAILS = "https://restcountries.com/v3.1/all";
const GET_COUNTRY_DETAILS_BY_NAME = "https://restcountries.com/v3.1/name";
let maxLimit = 20;
let modal = document.querySelector(".modal");
let trigger = document.querySelector(".example");
let closeButton = document.querySelector(".close-button");
const errorMsgElement = document.getElementById("error-message");
const loaderElement = document.getElementById("loading");

let activeCountryDetails = {};
let data = [];

function toggleModal() {
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  }
}

window.addEventListener("click", windowOnClick);

async function updateCountryData(url) {
  showloader();
  const response = await fetch(url);
  const _response = await response.json();
  hideloader();
  if (_response && _response.length) {
    data = _response;
  } else {
    errorMsgElement.innerHTML = "No result found";
    errorMsgElement.classList.toggle("show-error-message");
  }
  show();
}

updateCountryData(GET_ALL_COUNTRY_DETAILS);

function hideloader() {
  loaderElement.style.display = "none";
}

function showloader() {
  loaderElement.style.display = "block  ";
}

function onClickShowMore(e) {
  maxLimit += 20;
  updateCountryData(GET_ALL_COUNTRY_DETAILS);
}

function onClickCard(index) {
  let countryDetails = data[index];
  let modalDetails = `
  <span class="close-button" onclick="toggleModal()">&times;</span>
  <h2>${countryDetails.name.common}</h2>
  <img src="${countryDetails.flags.png}" alt="${countryDetails.flags.alt}">
  <div class="country-details">
    <p class="title">Capital</p>
    <p class="description">${countryDetails.capital[0]}</p>
  </div>
  <div class="country-details">
    <p class="title">Continent</p>
    <p class="description">${countryDetails.region}</p>
  </div>
  <div class="country-details">
    <p class="title">Currency</p>
    <p class="description">${
      countryDetails.currencies[Object.keys(countryDetails.currencies)[0]].name
    }</p>
  </div>
  <div class="country-details">
    <p class="title">Languages</p>
    <p class="description">${
      countryDetails.languages[Object.keys(countryDetails.languages)[0]]
    }</p>
  </div>
  <div class="country-details">
    <p class="title">Population</p>
    <p class="description">${countryDetails.population}</p>
  </div>
  <div class="country-details">
    <p class="title">Timezone</p>
    <p class="description">${countryDetails.timezones[0]}</p>
  </div>
  `;
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = modalDetails;
  toggleModal();
}

function show() {
  let card;
  let element = document.getElementById("country-cards");
  element.innerHTML = "";

  console.log(data);
  for (let i = 0; i < data.length; i++) {
    if (i >= maxLimit) {
      break;
    }
    let r = data[i];
    if ((r.flags.png || r.flags.alt) && r.name.common && r.region) {
      if (card) {
        card += `<div class="country-card" onclick="onClickCard(${i})">
        <img src="${r.flags.png}" alt="${r.flags.alt}">
        <p class="country-name">${r.name.common}</p>
        <p class="country-region">${r.region}</p>
        </div>`;
      } else {
        card = `<div class="country-card" onclick="onClickCard(${i})">
        <img src="${r.flags.png}" alt="${r.flags.alt}">
        <p class="country-name">${r.name.official}</p>
        <p class="country-region">${r.region}</p>
      </div>`;
      }
    }
  }

  document.getElementById("country-cards").innerHTML = card;
}

function onClickSearch() {
  const searchValue = document.getElementById("search-text").value;
  console.log(searchValue);
  if (searchValue) {
    updateCountryData(`${GET_COUNTRY_DETAILS_BY_NAME}/${searchValue}`);
  }
}

function onInput() {
  errorMsgElement.innerHTML = "";
  if (document.getElementById("search-text").value === "") {
    document.getElementById("search-btn").disabled = true;
  } else {
    document.getElementById("search-btn").disabled = false;
  }
}
