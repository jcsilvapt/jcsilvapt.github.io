"use strict";

var app = null;
var ctx = null;
var cnv = null;
var bgColor = null;

function main() {
  cnv = document.getElementById("canvas");
  ctx = cnv.getContext("2d");
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  drawCanvasRect(cnv);
  app = new FotoPrint();
  cnv.addEventListener("mousedown", drag, false);
  cnv.addEventListener("dblclick", makenewitem, false);
  loadInitImg();
}

function drawCanvasRect(cnv) {
  let ctx = cnv.getContext("2d");

  ctx.clearRect(0, 0, cnv.width, cnv.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, cnv.width, cnv.height);
}

//Drag & Drop operation
//drag
function drag(ev) {
  let mx = null;
  let my = null;
  let cnv = document.getElementById("canvas");

  let xPos = 0;
  let yPos = 0;
  [xPos, yPos] = getMouseCoord(cnv);
  mx = ev.x - xPos;
  my = ev.y - yPos;

  if (app.dragObj(mx, my)) {
    cnv.style.cursor = "pointer";
    cnv.addEventListener("mousemove", move, false);
    cnv.addEventListener("mouseup", drop, false);
  }
}

//Drag & Drop operation
//move
function move(ev) {
  let mx = null;
  let my = null;
  let cnv = document.getElementById("canvas");

  let xPos = 0;
  let yPos = 0;
  [xPos, yPos] = getMouseCoord(cnv);
  mx = ev.x - xPos;
  my = ev.y - yPos;

  app.moveObj(mx, my);
  drawCanvasRect(cnv);
  app.drawObj(cnv);
}

//Drag & Drop operation
//drop
function drop() {
  let cnv = document.getElementById("canvas");

  cnv.removeEventListener("mousemove", move, false);
  cnv.removeEventListener("mouseup", drop, false);
  cnv.style.cursor = "crosshair";
}

//Insert a new Object on Canvas
//dblclick Event
function makenewitem(ev) {
  let mx = null;
  let my = null;
  let cnv = document.getElementById("canvas");

  let xPos = 0;
  let yPos = 0;
  [xPos, yPos] = getMouseCoord(cnv);
  mx = ev.x - xPos;
  my = ev.y - yPos;

  if (app.insertObj(mx, my)) {
    drawCanvasRect(cnv);
    app.drawObj(cnv);
  }
}

//Delete button
//Onclick Event
function remove() {
  let cnv = document.getElementById("canvas");

  app.removeObj();
  drawCanvasRect(cnv);
  app.drawObj(cnv);
}

//Save button
//Onclick Event
function saveasimage() {
  try {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.fill();
    app.drawObj(cnv);
    var img = cnv.toDataURL("images/png");
    var win = window.open();
    win.document.write('<img src="' + img + '"/>');
  } catch (err) {
    alert("You need to change browsers OR upload the file to a server.");
  }
}

//Mouse Coordinates for all browsers
function getMouseCoord(el) {
  let xPos = 0;
  let yPos = 0;

  while (el) {
    if (el.tagName === "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      let xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      let yScroll = el.scrollTop || document.documentElement.scrollTop;

      xPos += el.offsetLeft - xScroll + el.clientLeft;
      yPos += el.offsetTop - yScroll + el.clientTop;
    } else {
      // for all other non-BODY elements
      xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
      yPos += el.offsetTop - el.scrollTop + el.clientTop;
    }

    el = el.offsetParent;
  }
  return [xPos, yPos];
}

function writeText() {
  let path = document.getElementById("textinput");
  let button = document.getElementById("txtbtnSub");
  let color = document.getElementById("colorPicker");
  console.log(color);
  if (path.value != "") {
    let text = new insertText(
      window.innerWidth / 2,
      window.innerHeight / 2,
      24,
      color.value,
      path.value
    );
    app.insertOnPoll(text);
    app.drawObj(cnv);
    path.value = "";
    path.classList.remove("cenas2");
    button.classList.remove("textSubmitOn");
  } else {
    alert("Erro :'(");
  }
}

function loadInitImg() {
  var canvas = document.getElementById("secretCanvas");
  let r = new Rect(0, 10, 100, 100, "red");
  let o = new Oval(canvas.width / 2, canvas.height / 2, 15, 3, 1, "blue");
  let h = new Heart(canvas.width / 2, canvas.height / 2 - 10, 80, "pink");
  /* let dad = new Picture(0, 10, 100, 100, ".   /imgs/allison1.jpg");*/
  let bear = new Bear(0, 10, 100, 100, "black");
  let ghost = new Ghost(0, 30, 100, 100, "black");

  let cenasfixes = [r, o, h, bear, ghost];

  for (let i = 0; i < cenasfixes.length; i++) {
    convImg(cenasfixes[i], canvas);
  }
}

function convImg(obj, canvas) {
  let context = canvas.getContext("2d");
  obj.draw(canvas);
  var img = canvas.toDataURL("image/png");

  let initialPath = document.getElementById("imagePosition");
  let path = document.createElement("div");
  let image = document.createElement("img");
  image.onclick = function() {
    imageCreator(obj);
  };
  image.setAttribute("src", img);
  path.appendChild(image);
  path.id = "tryout";
  1;
  initialPath.appendChild(path);
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function imageCreator(obj) {
  let defaultSizeWH = 200;
  let defaultX = cnv.width / 2.5;
  let defaultY = cnv.width / 8;
  let color = document.getElementById("colorPicker");
  let toPut = null;
  console.log(color.value);
  switch (obj.name) {
    case "R":
      toPut = new Rect(
        defaultX,
        defaultY,
        defaultSizeWH,
        defaultSizeWH,
        color.value
      );
      break;

    case "P":
      toPut = new Picture(defaultX, defaultY, 800, 600, obj.impath);
      break;

    case "O":
      toPut = new Oval(defaultX, defaultY, 50, 1, 1, color.value);
      break;

    case "H":
      toPut = new Heart(defaultX, defaultY, 80, color.value);
      break;
    case "B":
      toPut = new Bear(
        defaultX,
        defaultY,
        defaultSizeWH,
        defaultSizeWH,
        color.value
      );
      break;
    case "G":
      toPut = new Ghost(
        defaultX,
        defaultY,
        defaultSizeWH,
        defaultSizeWH,
        color.value
      );
      break;
    default:
      throw new TypeError("Can not create this type of object");
  }
  app.insertOnPoll(toPut);
  app.drawObj(cnv);
}

function insertImage() {
  let imagePath = document.getElementById("browseImg");
  let imgobj = window.URL.createObjectURL(imagePath.files[0]);
  let pic = new Picture(0, 0, 400, 400, imgobj);
  imageCreator(pic);
  console.log(imgobj.width);
}

function changeBackgroundColor() {
  let color = document.getElementById("colorPicker").value;
  let canvas = document.getElementById("canvas");
  canvas.style.backgroundColor = color;
  bgColor = color;
}
