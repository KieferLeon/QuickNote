export class Check extends HTMLElement {
  beingDragged = false;
  beingResized = false;

  offsetX = 0;
  offsetY = 0;
  positionX = 0;
  positionY = 0;

  // Grid sizes
  elementHeight = 1;
  elementWidth = 3;

  // Grid Layout
  elementCol = 1;
  elementRow = 1;

  // Edit Mode
  blocker = document.createElement("div");

  resizeLeft = document.createElement("div");
  resizeTop = document.createElement("div");
  resizeRight = document.createElement("div");
  resizeBottom = document.createElement("div");

  redraw;

  resizes = [
    this.resizeLeft,
    this.resizeTop,
    this.resizeRight,
    this.resizeBottom,
  ];

  constructor() {
    super();

    let items = [
      ["item1", "item2", "item3", "item4", "item5"],
      ["item1", "item2", "item3", "item4", "item5"],
    ];

    let maxItems = items.length >= 6;

    this.addEventListener("mousedown", this.beginDragging);

    this.style.display = "block";
    this.style.gridColumn = `${this.elementCol} / ${this.elementCol + this.elementWidth}`;
    this.style.gridRow = `${this.elementRow} / ${this.elementRow + this.elementHeight}`;
    this.style.width = `${this.elementWidth * 200 + 10 * (this.elementWidth - 1)}px`;
    this.style.height = `${this.elementHeight * 200 + 10 * (this.elementHeight - 1)}px`;
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

            .handle {
              position: absolute;
              width: 12px;
              height: 12px;
              background: white;
              border: 1px solid #333;
              border-radius: 50%;
            }

            .handle.left   { left: -6px; top: 50%; transform: translateY(-50%); cursor: ew-resize; }
            .handle.top    { top: -6px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
            .handle.right  { right: -6px; top: 50%; transform: translateY(-50%); cursor: ew-resize; }
            .handle.bottom { bottom: -6px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
        </style>
        <div class="check">
            <h1>name</h1>
            <div class="lists"> </div>
        </div>   
        
    `;
    const checkmarkContainer = this.querySelector(".lists");

    this.resizeLeft.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      this.beginResize(e);
    });

    this.resizes.forEach((resize) => {
      resize.style.zIndex = "2";
      resize.classList.add("handle");
      resize.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        this.beginResize(resize);
      });
    });

    this.resizeLeft.classList.add("left");
    this.resizeLeft.setAttribute("data-edge", "left");

    this.resizeTop.classList.add("top");
    this.resizeTop.setAttribute("data-edge", "top");

    this.resizeRight.classList.add("right");
    this.resizeRight.setAttribute("data-edge", "right");

    this.resizeBottom.classList.add("bottom");
    this.resizeBottom.setAttribute("data-edge", "bottom");

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

  beginResize = (element) => {
    this.beingResized = true;
    this.redraw = element;

    console.log(element);
    window.addEventListener("mousemove", this.resizing);
    window.addEventListener("mouseup", this.stopRezising);
  };

  resizing = (event) => {
    if (!this.beingResized) return;

    this.positionX = event.clientX - this.offsetX;
    this.positionY = event.clientY - this.offsetY;
    console.log("2");
  };

  stopRezising = (element) => {
    if (this.redraw.dataset.edge == "left") {
      let newStart = Math.round(this.positionX / 200) + 1;
      let endCol = this.elementCol + this.elementWidth;

      this.elementWidth = endCol - newStart;

      this.elementCol = newStart;
      console.log("col" + this.elementCol);

      this.style.width = `${this.elementWidth * 200 + 10 * (this.elementWidth - 1)}px`;

      this.style.gridColumn = `${this.elementCol} / ${this.elementCol + this.elementWidth}`;
    } else if (this.redraw.dataset.edge == "top") {
      let newStart = Math.round(this.positionY / 200);
      let endRow = this.elementRow + this.elementHeight;

      this.elementHeight = endRow - newStart;

      this.elementRow = newStart;

      this.style.height = `${this.elementHeight * 200 + 10 * (this.elementHeight - 1)}px`;

      this.style.gridRow = `${this.elementRow} / ${this.elementRow + this.elementHeight}`;
    } else if (this.redraw.dataset.edge == "right") {
      console.log("right");

      let endCol = Math.round(this.positionX / 200) + 1;

      this.elementWidth = endCol - this.elementCol;

      this.style.width = `${this.elementWidth * 200 + 10 * (this.elementWidth - 1)}px`;
      this.style.gridColumn = `${this.elementCol} / ${this.elementCol + this.elementWidth}`;
    } else if (this.redraw.dataset.edge == "bottom") {
      let endRow = Math.round(this.positionY / 200) + 1;

      this.elementHeight = endRow - this.elementRow;

      console.log(this.elementHeight);
      console.log(this.elementRow);
      this.style.height = `${this.elementHeight * 200 + 10 * (this.elementHeight - 1)}px`;
      this.style.gridRow = `${this.elementRow} / ${this.elementRow + this.elementHeight}`;
    } else {
      throw console.error("Error didnt recognize wich side is resized ");
    }

    this.beingResized = false;

    window.removeEventListener("mousemove", this.resizing);
    window.removeEventListener("mouseup", this.stopRezising);
  };

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

  overlayResize() {
    this.resizes.forEach((resize) => {
      resize.style.display = "block";
      this.appendChild(resize);
    });
  }

  removeResize() {
    this.resizes.forEach((resize) => {
      resize.style.display = "none";
      this.removeChild(resize);
    });
  }

  overlayBlocker() {
    let blocker = this.blocker;
    blocker.style.position = "absolute";
    blocker.style.top = "0";
    blocker.style.left = "0";
    blocker.style.width = "100%";
    blocker.style.height = "100%";
    blocker.style.background = "transparent";
    blocker.style.pointerEvents = "auto";
    blocker.style.userSelect = "none";
    blocker.style.webkitUserSelect = "none";
    blocker.style.mozUserSelect = "none";
    blocker.style.msUserSelect = "none";

    blocker.style.zIndex = "1";

    this.appendChild(blocker);
  }
  removeBlocker() {
    this.blocker.remove();
  }

  startEditmode() {
    this.overlayBlocker();
    this.overlayResize();
  }
  stopEditmode() {
    this.removeBlocker();
    this.removeResize();
  }
}
