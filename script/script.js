let BASE_URL = "https://swapi.dev/api/people/?page=1";
let numberOfCharacters = 6;
let characterContainer = document.querySelector(".container.char-container");
let charInfoUl = document.getElementById("char-info");

async function getCharacters() {
  try {
    let response = await fetch(BASE_URL);
    let dataFromApi = await response.json();
    let characterArray = dataFromApi.results.slice(0, numberOfCharacters);
    console.log(characterArray);
    return characterArray;
  } catch (error) {
    console.error("ERROR MESSAGE", error);
  }
}

function createCharactersElements(characters) {
  const charUl = document.querySelector(".ul-of-characters");
  for (let individual of characters) {
    const characterLi = document.createElement("li");
    characterLi.innerText = individual.name;
    characterLi.setAttribute("json", JSON.stringify(individual));
    charUl.appendChild(characterLi);
    characterLi.addEventListener("click", () =>
      handleCharacterClick(characterLi)
    );
  }
}

async function handleCharacterClick(characterLi) {
  showSpinners();
  hidePreviousSelection();
  characterLi.classList.add("active");
  const characterObject = getCharacterObject(characterLi);
  const characterDetails = await fetchCharacterDetails(characterObject.url);
  setTimeout(() => {
    hideSpinner("spinner2");
  }, 1250);
  const homeworldData = await fetchHomeworldInformation(
    characterObject.homeworld
  );
  setTimeout(() => {
    hideSpinner("spinner3");
  }, 1000);
  showPlanetInfo(homeworldData);
  updateCharInfoUl(characterDetails, characterObject);
}

function showSpinners() {
  showSpinner("spinner2");
  showSpinner("spinner3");
}

function showSpinner(spinnerClass) {
  const spinner = document.querySelector(`.${spinnerClass}`);
  if (spinner) {
    spinner.style.display = "block";
  }
}

function hideSpinner(spinnerClass) {
  const spinner = document.querySelector(`.${spinnerClass}`);
  if (spinner) {
    spinner.style.display = "none";
  }
}

function hidePreviousSelection() {
  const previouslySelectedCharacter = document.querySelector(
    ".ul-of-characters .active"
  );
  if (previouslySelectedCharacter) {
    previouslySelectedCharacter.classList.remove("active");
  }
}

function getCharacterObject(characterLi) {
  const characterJson = characterLi.getAttribute("json");
  return JSON.parse(characterJson);
}

async function fetchCharacterDetails(characterUrl) {
  const response = await fetch(characterUrl);
  return await response.json();
}

function updateCharInfoUl(characterDetails, characterObject) {
  const infoNameH3 = document.querySelector(".info-container__name h3");
  infoNameH3.innerText = characterObject.name;
  charInfoUl.innerHTML = `
    <li>Height: ${characterDetails.height}cm</li>
    <li>Mass: ${characterDetails.mass}kg</li>
    <li>Hair color: ${characterDetails.hair_color}</li>
    <li>Skin color: ${characterDetails.skin_color}</li>
    <li>Eye color: ${characterDetails.eye_color}</li>
    <li>Birth year: ${characterDetails.birth_year}</li>
    <li>Gender: ${characterDetails.gender}</li>`;
}

async function fetchHomeworldInformation(homeworldURL) {
  try {
    const response = await fetch(homeworldURL);
    return await response.json();
  } catch (error) {
    console.error("", error);
  }
}

function showPlanetInfo(planet) {
  const planetNameHeading = document.querySelector(
    ".info-container__planet h3"
  );
  planetNameHeading.innerText = planet.name;
  const planetInfoUl = document.querySelector("#home-info");
  planetInfoUl.innerHTML = `
    <li>Rotation period: ${planet.rotation_period} hours</li>
    <li>Orbital period: ${planet.orbital_period} days</li>
    <li>Diameter: ${planet.diameter} kilometers</li>
    <li>Climate: ${planet.climate}</li>
    <li>Gravity: ${planet.gravity}</li>
    <li>Terrain: ${planet.terrain}</li>`;
}

async function handleCharacters() {
  const characters = await getCharacters();
  createCharactersElements(characters);
  hideSpinner("spinner");
  hideSpinner("spinner2");
  hideSpinner("spinner3");
}

handleCharacters();
