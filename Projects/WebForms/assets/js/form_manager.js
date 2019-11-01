
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
    
}

function showOptions(value) {
    if(value) {
        var r = document.getElementById('opt1').style;
        r.display = "inline-block";
        r.animation = "fade-in .5s linear"
    } else {
        var r = document.getElementById('opt1').style;
        r.animation = "fade-out .5s linear"
        setTimeout(function() {
            r.display = "none";
        }, 500);
        
    }
}

function setFocus(value) {
    var c = value;
    console.log(c);
}