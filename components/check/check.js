export class Check extends HTMLElement {
  beingDragged = false;
  beingResized = false;

  offsetX = 0;
  offsetY = 0;
  positionX = 0;
  positionY = 0;

  // Grid sizes
  elementHeight = 1;
  elementWidth = 1;

  // Grid Layout
  elementCol = 1;
  elementRow = 1;

  preview = document.createElement("div");

  // Edit Mode
  blocker = document.createElement("div");

  resizeLeft = document.createElement("div");
  resizeTop = document.createElement("div");
  resizeRight = document.createElement("div");
  resizeBottom = document.createElement("div");

  selectedEdge;

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

    this.preview.style.display = "block";
    this.preview.style.backgroundColor = "#444"; // Testing
    this.preview.style.width = "100%";
    this.preview.style.height = "100%";
    this.preview.style.borderRadius = "20px";

    this.style.display = "block";
    this.style.gridColumn = `${this.elementCol} / ${this.elementCol + this.elementWidth}`;
    this.style.gridRow = `${this.elementRow} / ${this.elementRow + this.elementHeight}`;
    this.style.width = `${this.elementWidth * 200 + 10 * (this.elementWidth - 1)}px`;
    this.style.height = `${this.elementHeight * 200 + 10 * (this.elementHeight - 1)}px`;
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

    this.resizes.forEach((resize) => {
      resize.style.zIndex = "2";
      resize.classList.add("handle");
      resize.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        this.beginResize(resize, e); // pass the event here
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

  beginResize = (element, event) => {
    this.beingResized = true;
    this.selectedEdge = element;

    window.addEventListener("mousemove", this.resizing);
    window.addEventListener("mouseup", this.stopResizing);
  };

  resizing = (event) => {
    if (!this.beingResized) return;

    this.positionX =
      event.clientX - this.selectedEdge.getBoundingClientRect().left;
    this.positionY =
      event.clientY - this.selectedEdge.getBoundingClientRect().top;

    //Preview
    let previewWidth = this.elementWidth;
    let previewHeight = this.elementHeight;

    let previewCol = this.elementCol;
    let previewRow = this.elementRow;

    if (this.selectedEdge.dataset.edge == "left") {
      const sizeChange = Math.round(this.positionX / 200);
      const widthChange = Math.abs(sizeChange);

      previewCol += sizeChange;
      previewWidth += widthChange;
    } else if (this.selectedEdge.dataset.edge == "top") {
      const sizeChange = Math.round(this.positionY / 200);
      const heightChange = Math.abs(sizeChange);

      previewRow += sizeChange;
      previewHeight += heightChange;
    } else if (this.selectedEdge.dataset.edge == "right") {
      const widthChange = Math.round(this.positionX / 200);

      previewWidth += widthChange;
    } else if (this.selectedEdge.dataset.edge == "bottom") {
      const heightChange = Math.round(this.positionY / 200);

      previewHeight += heightChange;
    } else {
      throw console.error("Error didnt recognize wich side is resized ");
    }

    this.preview.style.gridColumn = `${previewCol} / ${previewCol + previewWidth}`;
    this.preview.style.gridRow = `${previewRow} / ${previewRow + previewHeight}`;
    this.preview.style.width = `${previewWidth * 200 + 10 * (previewWidth - 1)}px`;
    this.preview.style.height = `${previewHeight * 200 + 10 * (previewHeight - 1)}px`;

    console.log(this.positionY);
  };

  stopResizing = (element) => {
    if (this.selectedEdge.dataset.edge == "left") {
      const sizeChange = Math.round(this.positionX / 200);
      const widthChange = Math.abs(sizeChange);

      this.elementCol += sizeChange;
      this.elementWidth += widthChange;
    } else if (this.selectedEdge.dataset.edge == "top") {
      const sizeChange = Math.round(this.positionY / 200);
      const heightChange = Math.abs(sizeChange);

      this.elementRow += sizeChange;
      this.elementHeight += heightChange;
    } else if (this.selectedEdge.dataset.edge == "right") {
      const widthChange = Math.round(this.positionX / 200);

      this.elementWidth += widthChange;
    } else if (this.selectedEdge.dataset.edge == "bottom") {
      const heightChange = Math.round(this.positionY / 200);

      this.elementHeight += heightChange;
    } else {
      throw console.error("Error didnt recognize wich side is resized ");
    }

    this.style.gridColumn = `${this.elementCol} / ${this.elementCol + this.elementWidth}`;
    this.style.gridRow = `${this.elementRow} / ${this.elementRow + this.elementHeight}`;
    this.style.width = `${this.elementWidth * 200 + 10 * (this.elementWidth - 1)}px`;
    this.style.height = `${this.elementHeight * 200 + 10 * (this.elementHeight - 1)}px`;

    this.beingResized = false;

    window.removeEventListener("mousemove", this.resizing);
    window.removeEventListener("mouseup", this.stopResizing);
  };

  beginDragging = (event) => {
    if (!window.isEditMode) return;

    if (!this.contains(event.target)) return;

    this.beingDragged = true;
    this.offsetX = event.clientX - this.offsetLeft;
    this.offsetY = event.clientY - this.offsetTop;
    this.style.position = "absolute";

    this.before(this.preview);

    window.addEventListener("mousemove", this.dragging);
    window.addEventListener("mouseup", this.stopDragging);
  };

  dragging = (event) => {
    if (!this.beingDragged) return;
    this.positionX = event.clientX - this.offsetX;
    this.positionY = event.clientY - this.offsetY;

    const colStart = Math.floor(this.positionX / 200) + 1;
    const colEnd = colStart + this.elementWidth;
    this.preview.style.gridColumn = `${colStart} / ${colEnd}`;

    this.elementCol = colStart;

    const rowStart = Math.floor(this.positionY / 200) + 1;
    const rowEnd = rowStart + this.elementHeight;
    this.preview.style.gridRow = `${rowStart} / ${rowEnd}`;

    this.style.left = this.positionX + "px";
    this.style.top = this.positionY + "px";
  };

  stopDragging = () => {
    this.beingDragged = false;
    this.style.position = "relative";

    const colStart = Math.floor(this.positionX / 200) + 1;
    const colEnd = colStart + 1;
    this.style.gridColumn = `${colStart} / ${colEnd}`;

    this.elementCol = colStart;

    const rowStart = Math.floor(this.positionY / 200) + 1;
    const rowEnd = rowStart + 0;
    this.style.gridRow = `${rowStart} / ${rowEnd}`;

    this.elementRow = rowStart;

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
