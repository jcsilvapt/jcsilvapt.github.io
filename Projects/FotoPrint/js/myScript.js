let butao = document.getElementById("txtbtnSub");

function extText(path) {
    let butao = document.getElementById("txtbtnSub");

    path.className += " cenas2";
    butao.className += " textSubmitOn";
}

function shrinkTxt(path) {
    let butao = document.getElementById("txtbtnSub");

    if(path.value == "") {
        path.classList.remove("cenas2");
        butao.classList.remove("textSubmitOn");

    }
}

/*
function insertImage(obj) {
    console.log(obj.value);
}*/
