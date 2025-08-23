export class Check extends HTMLElement {
  constructor() {
    super();

    let items = [
      ["item1", "item2", "item3", "item4", "item5"],
      ["item1", "item2", "item3", "item4", "item5"],
    ];

    let maxItems = items.length >= 6;

    let height = 1;
    let width = 2;

    this.style.display = "block";
    this.style.gridColumn = "3 / 5";
    this.style.gridRow = "1";
    this.style.width = "100%";
    this.style.height = "100%";
    this.style.display = "block";

    this.innerHTML = `
        <style>
            .check { 
              background: rgba(39, 39, 39, 1); 
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;

              border-radius: 20px;
            }
            .checkmark{
                display: flex;
                flex-direction: column;
            }
            .add-button{
                height: 20px;
                width: 100%
            }
            .check-box{
              appearance: none;     
              -webkit-appearance: none;  
              -moz-appearance: none;     

              width: 20px;
              height: 20px;
              border-radius: 50%;        
              border: 2px solid white;
              background: transparent;
              cursor: pointer;
            }
            .check-box:checked {
              background: limegreen;     
            }

            .lists{
              display: flex;
            }
        </style>
        <div class="check">
            <h1>name</h1>
            <div class="lists"> </div>
            </div>   
        </div>
    `;
    const checkmarkContainer = this.querySelector(".lists");

    items.forEach((checkmark) => {
      const checkmarkWrapper = document.createElement("div");
      checkmarkWrapper.classList.add("checkmark");
      checkmarkContainer.appendChild(checkmarkWrapper);

      checkmark.forEach((checkmark, index) => {
        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("check-box");

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${checkmark}`));
        checkmarkWrapper.appendChild(label);
      });
      if (!maxItems) {
        const addButton = document.createElement("button");
        addButton.classList.add("add-button");
        addButton.textContent = "add";

        checkmarkWrapper.appendChild(addButton);
      }
    });
  }

  beginDragging(element, event) {
    beingDragged = true;
    draggedElement = element;

    offsetX = event.clientX - element.offsetLeft;
    offsetY = event.clientY - element.offsetTop;

    element.style.position = "absolute";

    window.addEventListener("mousemove", dragging);
    window.addEventListener("mouseup", stopDragging);
  }

  dragging(event) {
    if (beingDragged && draggedElement) {
      positionX = event.clientX - offsetX;
      positionY = event.clientY - offsetY;

      draggedElement.style.left = positionX + "px";
      draggedElement.style.top = positionY + "px";
    }
  }

  stopDragging() {
    beingDragged = false;

    draggedElement.style.position = "static";
    draggedElement.style.gridColumn = Math.round(positionX / 200);
    draggedElement.style.gridRow = Math.round(positionY / 200);

    draggedElement = null;

    window.removeEventListener("mousemove", dragging);
    window.removeEventListener("mouseup", stopDragging);
  }
}
