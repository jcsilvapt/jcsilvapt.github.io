//Declaring a global variable which will be created in main function
var app = null;
var selectedColor = "none";
var numshownpic = 15;
var errorList = {
    color: "Atenção: Já tenho cor... mas não sei o que procurar :(",
    category: "Atenção: Não sei por onde deva começar... tenta escrever qualquer coisa!",
    noWord: "Erro: Não tenho essa palava na minha base de dados, tenta usar outra!"
};

/**
 *
 * @param {boolean} bool Value that determines if there's need to load LocalStorage or not
 */
function main(bool) {
    let canvas = document.getElementById("hidden");

    //Creating the instance of the application
    app = new ISearchEngine("xml/Image_database.xml", bool);

    // Initializing the app
    app.init(canvas);

    console.log("Project Initiated");
}

//Function that generates an artificial image and draw it in canvas
//Useful to test the image processing algorithms
function Generate_Image(canvas) {
    var ctx = canvas.getContext("2d");
    var imgData = ctx.createImageData(100, 100);

    for (var i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i + 0] = 204;
        imgData.data[i + 1] = 0;
        imgData.data[i + 2] = 0;
        imgData.data[i + 3] = 255;
        if ((i >= 8000 && i < 8400) || (i >= 16000 && i < 16400) || (i >= 24000 && i < 24400) || (i >= 32000 && i < 32400)) imgData.data[i + 1] = 200;
    }
    ctx.putImageData(imgData, 150, 0);
    return imgData;
}


/**
 * Função de controlo para display no browser
 * @param {boolean} True    - Move toda a informação para cima
 * @param {boolean} False   - Move toda a informação para Baixo
 */
function hasSearch(bool) {
    clearContent();
    if (bool) { // Go UP
        moveSearchBar(true);
    } else { // Go Down
        moveSearchBar(false);
    }
}

/**
 * Função que determina a animação do display da informação.
 * @param bool: True, sobe as barras. False, desce as barras
 */

function moveSearchBar(bool) {
    let place = document.getElementById("searchContent");
    let resultPlace = document.getElementById("resultsHolder");
    if (bool) {
        place.classList.add("container-middle-top");
        resultPlace.style.display = "block";
    } else {
        place.classList.remove("container-middle-top");
        resultPlace.style.display = "none";
    }
}

/**
 * Função que limpa as imagens actualmente a serem mostradas.
 */

function clearContent() {
    let node = document.getElementById("results");
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

/**
 * Função que retorna um valor no campo de procura, caso não existe retorna FALSE.
 * @returns {string|boolean}
 */

function getSearchValue() {
    let value = document.getElementById("searchValue").value.trim();
    if (value.length > 0) {
        return value;
    } else {
        return false;
    }
}


/**
 * Função que recebe um array com imagens e mostra-as na "tela"
 * @param values
 */
function displayResults(values) {
    let toPlace = document.getElementById("results");
    let showedIdx = [];
    let controlImagesShown = (values.length < numshownpic) ? values.length : numshownpic;
    for (let i = 0; i < controlImagesShown; i++) {
        let unique = true;
        let idxRandom = -1;
        while (unique) {
            idxRandom = Math.floor(Math.random() * values.length);
            let controlSrc = values[idxRandom].getAttribute("src");
            let control = true;
            for (let c = 0; c < showedIdx.length; c++) {
                if (controlSrc === showedIdx[c]) {
                    control = false;
                    break;
                } else {
                    control = true;
                }
            }
            if (control) {
                showedIdx.push(controlSrc);
                unique = !unique;
            }
        }
        let rDiv = document.createElement("div");
        rDiv.classList.add("result");
        rDiv.classList.add("shadow");
        let image = document.createElement("img");
        image.src = values[idxRandom].getAttribute("src");
        image.id = "img" + idxRandom;
        rDiv.appendChild(image);
        toPlace.appendChild(rDiv);
    }
    console.log(showedIdx);
}

/**
 * Função para procura por KeyWords
 */
function normalSearch() {
    let searchValue = getSearchValue();
    if (searchValue !== false) {
        let images = app.searchKeywords(searchValue);
        if (images.length > 0) {
            hasSearch(true);
            displayResults(images);
        } else {
            triggerAlert(errorList.noWord);
        }
    } else {
        triggerAlert(errorList.category);
    }
}

function colorSearch() {
    let searchValue = getSearchValue();
    if (searchValue !== false) {
        let images = app.searchColor(searchValue, selectedColor);
        if(images.length > 0) {
            hasSearch(true);
            displayResults(images);
        }else {
            triggerAlert(errorList.noWord);
        }
    } else {
        triggerAlert(errorList.color);
    }
}

function setColorSearch(value) {
    selectedColor = value;
    if (selectedColor !== "none") {
        colorSearch();
    } else {
        normalSearch();
    }
}

function resetSearch() {
    selectedColor = "none";
}


/**
 * Função que da trigger ao alert.
 * @param {string} text Recebe um texto para apresentar no alerta
 */
function triggerAlert(text) {
    let place = document.getElementById("alert");
    place.classList.add("alertTrigger");
    place.innerHTML = text;
    setTimeout(function () {
        place.classList.remove("alertTrigger");
    }, 4000);
}