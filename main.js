import { Check } from "./components/check/check.js";

window.isEditMode = true;

let beingDragged = false;
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let positionX = 0;
let positionY = 0;
let gridsize = 200;

const check = document.querySelector("custom-check");

function toggleEditMode() {
  if (!window.isEditMode) {
    window.isEditMode = true;
    check.startEditmode(); //Testing

    console.log(check);
    console.log("EnterEditMode");
  } else {
    window.isEditMode = false;
    check.stopEditmode();
  }
}

window.toggleEditMode = toggleEditMode;

function beginDragging(element, event) {
  beingDragged = true;
  draggedElement = element;

  offsetX = event.clientX - element.offsetLeft;
  offsetY = event.clientY - element.offsetTop;

  element.style.position = "absolute";

  window.addEventListener("mousemove", dragging);
  window.addEventListener("mouseup", stopDragging);
}

function dragging(event) {
  if (beingDragged && draggedElement) {
    positionX = event.clientX - offsetX;
    positionY = event.clientY - offsetY;

    draggedElement.style.left = positionX + "px";
    draggedElement.style.top = positionY + "px";
  }
}

function stopDragging() {
  beingDragged = false;

  draggedElement.style.position = "static";
  draggedElement.style.gridColumn = Math.round(positionX / 200);
  draggedElement.style.gridRow = Math.round(positionY / 200);

  draggedElement = null;

  window.removeEventListener("mousemove", dragging);
  window.removeEventListener("mouseup", stopDragging);
}

const box = document.getElementById("box");
box.addEventListener("mousedown", (event) => beginDragging(box, event));

customElements.define("custom-check", Check);
