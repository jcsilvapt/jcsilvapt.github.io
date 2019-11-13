
var xmlRowString = "<Questionario>";
var browserOptions = ["Chrome", "Edge", "Firefox", "Internet Explorer", "Opera", "Safari"];

var currentActive = 0;
var precentage = 0;
var dividerTemp = 100.0/26;

// Funçao que altera o visibilidade da form activa
function nextForm(form) {
    var top = document.getElementById(form).offsetTop;
    window.scrollTo(0, top);
    if(form.includes("userField")) {
        currentActive++;
        updateLevel();
    }
}

function updateLevel() {
    var doc = document.getElementById("counter");
    precentage += dividerTemp;
    doc.innerHTML = currentActive+"/26";
    doc.style.width = precentage+"%";
}

function validateForm(currentForm, nextID) {
    var formName = currentForm.parentNode.name;
    var formValue = document.forms[formName][currentForm.name].value;
    if(formValue.length > 0) {
        console.log(xmlRowString);
        xmlRowString += '<q id="' + currentForm.name +'">' +  formValue + "</q>";
        nextForm(nextID);
    }
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

function validateTextArea(textAreaID, nextID){
    var value = document.getElementById(textAreaID.name).value;
    console.log(value);
    if(value.length > 0) {
        xmlRowString += '<q id="' + textAreaID.name +'">' + value + "</q>";
    } else {
        xmlRowString += '<q id="' + textAreaID.name + '"></q>';
    }
    nextForm(nextID);
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

function validateRandom(currentForm, nextID) {
    var formName = currentForm.parentNode;
    var t = formName.getElementsByTagName("form");
    var temp = "";
    console.log(formName);
    console.log(t);
    for(let i = 0; i < t.length; i++) {
        var formValue = document.forms[t[i].name][t[i].name].value;
        console.log(formValue);
        if(formValue.length > 0) {
            temp += '<q id="' + t[i].name + '">' + formValue + "</q>";
        }
    }
    xmlRowString += temp;
    nextForm(nextID);
}

function validateSUS(currentForm, nextID) {
    var formName = currentForm.parentNode;
    var formValue = document.forms[formName.name][formName.name].value;
    if(formValue.length > 0 ) {
        xmlRowString += '<q id="' + formName.name + '">' + formValue + "</q>";
        nextForm(nextID);
    }
}

function endForm(nextID) {
    xmlRowString += "</Questionario>";
    StoreToLocalStorage();
    nextForm(nextID);
}

function StoreToLocalStorage() {
    let date = new Date();
    window.localStorage.setItem(date.getTime(), xmlRowString);
}

function LoadDataFromLocalStorage() {
    console.log("I'm probably working");
    var index = window.localStorage.length;
    if(index > 0) {
        var place = document.getElementById("resultPlacer");
        for(let i = 0; i < index; i++) {
            var reader = window.localStorage.getItem(window.localStorage.key(i));
            if(window.DOMParser) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(reader, "application/xml");
            }
            var q = doc.getElementsByTagName("q");
            var card = document.createElement("div");
            card.classList.add("card");
            var html = `
                            <div class="card-header" id="heading{VALUE}">
                                <h2 class="mb-0">
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse{ID}" aria-expanded="true" aria-controls="collapse{ID}">
                                        RESULTADOS: {ID}
                                    </button>
                                </h2>
                            </div>

                            <div id="collapse{VALUE}" class="collapse show resultsColorFix" aria-labelledby="heading{VALUE}" data-parent="#resultPlacer">
                                <div class="card-body">
                                    {DATA}
                                </div>
                            </div>`;
            var inputs = "";
            for(let b = 0 ; b < q.length; b++) {
                let id = q[b];
                inputs += "<p>" + q[b].id + ": " + q[b].textContent + "</p>";
            }
            var finalHTML = "";
            if(i == 0) {
                finalHTML = html.replace(/{VALUE}|{ID}/g, i+1).replace("{DATA}", inputs);
            } else {
                finalHTML = html.replace(/{VALUE}|{ID}/g, i+1).replace("{DATA}", inputs).replace("show", "");
            }
            
            card.innerHTML = finalHTML;

            place.appendChild(card);

        }
    } else {
        console.log("NO DATA");
    }
}