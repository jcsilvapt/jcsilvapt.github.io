var currentValueSearch = "Imagens";
var searchPlace = document.getElementById("searchValue");

/**
 * Evento do teclado, caso seja a tecla enter, inicia a procura na base de dados.
 */
searchPlace.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        // Do the Search
        console.log("Searching for " + currentValueSearch + " : " + searchPlace.value);
    }
});

/**
 * Função que altera o "tipo" de procura a ser efectuado.
 * @param {string} value
 */
function setActiveSearch(value) {
    let valueText = value.innerHTML;
    if (valueText !== currentValueSearch) {
        currentValueSearch = valueText;
    }
    console.log("Current Search Type: " + currentValueSearch);
}

$(function() {
    $("#searchValue").blur();
});
