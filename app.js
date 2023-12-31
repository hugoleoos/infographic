let ALL_DINOSAURS;

/**
* @description Loanding dino.json into global variable ALL_DINOSAURS
* @returns {Array} dinosaurs array
*/
(async () => {
    await fetch('dino.json').then(res => res.json()).then(data => ALL_DINOSAURS = data)
})()

/**
* @description Represents a Dinosaur
* @constructor
* @param {object} dinoObject - dinosaur object data
*/
function Dinosaur(dinoObject) {
    const { species, weight, height, diet, fact, where, when } = dinoObject;
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.fact = fact;
    this.where = where;
    this.when = when;
}

function Human(name, feet, inches, weight, diet) {
    this.name = name;
    this.feet = feet;
    this.inches = inches;
    this.weight = weight;
    this.diet = diet;
}

Human.prototype.getHeightInInches = function (feet, inches) {
    return (+this.feet * 12 + +this.inches).toFixed(1);
};

/**
* @description Compare weight between dinosaur and human, and add to prototype of human
* @param {object} dinosaur
* @param {object} human 
* @returns {string} comparison of how many times the dinosaur is heavier or thinner than the human
*/
Human.prototype.compareWeight = function (dinosaur) {
    const weightRatio = (dinosaur.weight / this.weight).toFixed(1);
    return `The ${dinosaur.species} was ${weightRatio} ${weightRatio > 1 ? "havier" : "thinner"} than you.`
}

/**
* @description Compare height between dinosaur and human
* @param {object} dinosaur
* @param {object} human 
* @returns {string} comparison of how many times the dinosaur is taller or shorter than the human
*/
Human.prototype.compareHeight = function (dinosaur) {
    const heightRatio = (dinosaur.height / this.getHeightInInches()).toFixed(1);
    if (heightRatio === 1) {
        return `wow \o/. You are as tall as ${dinosaur.species}.`;
    }

    return `The ${dinosaur.species} was ${heightRatio} ${heightRatio > 1 ? "taller" : "shorter"} than you.`;
}

/**
* @description Compare diet between dinosaur and human
* @param {object} dinosaur
* @param {object} human 
* @returns {string} comparison of diet
*/
Human.prototype.compareDiet = function (dinosaur) {
    const isSameDiet = dinosaur.diet.toLowerCase === this.diet.toLowerCase;
    return isSameDiet ? `wow \o/. You are both ${dinosaur.diet}.` : `You are ${this.diet} but the ${dinosaur.species} is ${dinosaur.diet}.`;
}

/**
* @description Creates an array of dinosaur 
* @param {json} dinosaursData - json with dinosaur object data
* @returns {Array} an dinosaur array
*/
//Create Dino Objects
function getDinosaurs(dinosaursData) {
    const dinosaurs = dinosaursData["Dinos"].map(function (object) {
        return new Dinosaur(object)
    });
    return dinosaurs
}

// Create Human Object
// Use IIFE to get human data from form
/**
* @description Create an human object based on data from form
* @returns {object} - human
*/
function getHumanData() {
    const [name, feet, inches, weight] = document.querySelectorAll("input");
    const diet = document.querySelector("select");

    return new Human(name.value, Number(feet.value), Number(inches.value), Number(weight.value), diet.value)
}

/**
* @description randomize facts to show in the form
* @param {object} tile
* @param {object} human 
* @returns {string} a random fact or comparison 
*/
function randomizeFacts(tile, human) {
    if (tile.species === 'Pigeon') return tile.fact;
    if (tile.species === 'human') return;

    const randomFact = Math.floor(Math.random() * Math.floor(6));

    const data = {
        0: human.compareWeight(tile),
        1: human.compareHeight(tile),
        2: human.compareDiet(tile),
        3: tile.fact,
        4: `The ${tile.species} lived in ${tile.where}.`,
    }

    return data[randomFact] || `The ${tile.species} lived in the ${tile.when} era.`
}

/**
* @description Generate Tiles for each Dino in Array and Add tiles to DOM
* @param {Array} dinosaurs - dinosaur data array
* @param {object} human - human object with input from form
*/
function generateTiles(dinosaurs, human) {
    const grid = document.querySelector("#grid");
    const tiles = [...dinosaurs.slice(0, 4), human, ...dinosaurs.slice(4)];

    const tilesArray = tiles.map(function (object) {
        return `<div class="grid-item">
                    <h3>${object.species || object.name}</h3>
                    <img src="images/${object.species?.toLowerCase() || "human"}.png">
                    <p style="${typeof object.fact === "undefined" ? "display: none" : ""
            }">${randomizeFacts(object, human)}</p>
                </div>`;

    }).join("");

    grid.innerHTML = tilesArray;

}

/**
* @description Remove form from screen
*/
function hideForm() {
    const form = document.querySelector("#dino-compare");
    form.style.display = "none";
}

/**
* @description clear form inputs
*/
function clearForm() {
    const fields = document.querySelectorAll("input");
    fields.forEach((field) => (field.value = ""));
}

/**
* @description add a refresh button to the DOM 
*/
function refreshBtn() {
    const form = document.querySelector("#dino-compare");
    const btn = document.createElement("div");
    btn.innerHTML = `<h1>Compare Again</h1>`;
    btn.classList.add("start");
    btn.classList.add("btn");
    document.querySelector("footer").prepend(btn);

    btn.addEventListener("click", () => {
        grid.innerHTML = "";
        btn.style.display = "none";
        form.style.display = "block";
    });
}

/**
* @description On button click, prepare and compare data, and display infographic 
*/
(function () {
    const compareBtn = document.querySelector("#btn");
    clearForm();

    compareBtn.addEventListener("click", function () {
        const humanData = getHumanData();
        const dinoArray = getDinosaurs(ALL_DINOSAURS);

        hideForm();
        generateTiles(dinoArray, humanData);
        refreshBtn();
        clearForm();
    });
})();
