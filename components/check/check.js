export class Check extends HTMLElement {
  beingDragged = false;

  offsetX = 0;
  offsetY = 0;
  positionX = 0;
  positionY = 0;

  // Grid sizes
  elementHeight = 1;
  elementWidth = 1;

  blocker = document.createElement("div");

  constructor() {
    super();

    let items = [
      ["item1", "item2", "item3", "item4", "item5"],
      ["item1", "item2", "item3", "item4", "item5"],
    ];

    let maxItems = items.length >= 6;

    this.addEventListener("mousedown", this.beginDragging);

    this.style.display = "block";
    this.style.gridColumn = "3 / 5";
    this.style.gridRow = "1";
    this.style.width = "410px"; //Placholder
    this.style.height = "200px"; //Placholder
    this.style.display = "block";
    this.style.position = "relative";

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

  beginDragging = (event) => {
    if (!window.isEditMode) return;

    if (!this.contains(event.target)) return;

    this.beingDragged = true;
    this.offsetX = event.clientX - this.offsetLeft;
    this.offsetY = event.clientY - this.offsetTop;
    this.style.position = "absolute";

    window.addEventListener("mousemove", this.dragging);
    window.addEventListener("mouseup", this.stopDragging);
  };

  dragging = (event) => {
    if (!this.beingDragged) return;
    this.positionX = event.clientX - this.offsetX;
    this.positionY = event.clientY - this.offsetY;

    this.style.left = this.positionX + "px";
    this.style.top = this.positionY + "px";
  };

  stopDragging = () => {
    this.beingDragged = false;
    this.style.position = "relative";

    let rect = this.getBoundingClientRect();

    const colStart = Math.floor(this.positionX / 200) + 1;
    const colEnd = colStart + 1;
    this.style.gridColumn = `${colStart} / ${colEnd}`;

    const rowStart = Math.floor(this.positionY / 200) + 1;
    const rowEnd = rowStart + 0;
    this.style.gridRow = `${rowStart} / ${rowEnd}`;

    this.style.left = "";
    this.style.top = "";

    window.removeEventListener("mousemove", this.dragging);
    window.removeEventListener("mouseup", this.stopDragging);
  };

  overlayBlocker() {
    let blocker = this.blocker;
    blocker.style.position = "absolute";
    blocker.style.top = "0";
    blocker.style.left = "0";
    blocker.style.width = "100%";
    blocker.style.height = "100%";
    blocker.style.background = "transparent";
    blocker.style.zIndex = "1000";
    blocker.style.pointerEvents = "auto";
    blocker.style.userSelect = "none";
    blocker.style.webkitUserSelect = "none";
    blocker.style.mozUserSelect = "none";
    blocker.style.msUserSelect = "none";

    this.appendChild(blocker);
  }
  removeBlocker() {
    this.blocker.remove();
  }
}
