
var xmlRowString = "<Questionario>";
var browserOptions = ["Chrome", "Edge", "Firefox", "Internet Explorer", "Opera", "Safari"];


// Funçao que altera o visibilidade da form activa
function nextForm(form) {
    var top = document.getElementById(form).offsetTop;
    window.scrollTo(0, top);
}

function validateForm(currentForm, nextID) {
    var formName = currentForm.parentNode.name;
    var formValue = document.forms[formName][currentForm.name].value;
    if(formValue.length > 0) {
        console.log(xmlRowString);
        xmlRowString += '<q id="' + currentForm.name +'">' +  formValue + "</q>";
        nextForm(nextID);
    } if (nextID == "end") {
        xmlRowString += "</Questionario>";
    } else {
        console.log("ERROR BITCH");
    }
    console.log(xmlRowString);
}

function validateList(currentList, nextID) {
    var c = currentList.parentNode;
    var value = c.getElementsByTagName("input");
    var tempText = "";
    var check = false;
    for(let i = 0 ; i < value.length-1; i++) {
        if(value[i].value.length > 0) {
            tempText += '<q id="' + value[i].name +'">' + value[i].value + "</q>";
            check = true;
        }
    }
    if(check) {
        xmlRowString += tempText;
        nextForm(nextID);
    }

}

function printData(){
    console.log(xmlRowString);
}

function changeDPS(value) {
    var loc = document.getElementById('dpText');
    if(value) {
        loc.disabled = false;
        loc.placeholder = "Indique aqui!";
    }else {
        loc.disabled = true;
        loc.placeholder = "";
        loc.value = "";
    }
}