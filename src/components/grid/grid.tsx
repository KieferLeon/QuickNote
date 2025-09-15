import { Component } from 'react';
import './style.css';
import { GridSize } from '../../config';
import BaseComponent from '../BaseComponent/BaseComponent';
import React from 'react';

type GridArea = {
  width: number,
  height: number,
  col: number,
  row: number
}

class Grid extends Component {
  elementRefs: React.RefObject<BaseComponent | null>[] = [];

  constructor(props: any) {
    super(props);

    this.elementRefs = [React.createRef<BaseComponent>(), React.createRef<BaseComponent>()];
  }



  checkCollision(targetArea: GridArea, key: number): boolean {
    const targetEndX = targetArea.col + targetArea.width;
    const targetEndY = targetArea.row + targetArea.height;

    for (let i = 0; i < this.elementRefs.length; i++) {
      const element = this.elementRefs[i];
      if (!element.current) continue;

      const elementState = element.current.state;
      const elementEndX = elementState.elementCol + elementState.elementWidth;
      const elementEndY = elementState.elementRow + elementState.elementHeight;

      if (i === key) continue;

      if (
        targetArea.col < elementEndX &&
        targetEndX > elementState.elementCol &&
        targetArea.row < elementEndY &&
        targetEndY > elementState.elementRow
      ) {
        console.log("collision");
        return true;
      }
    }

    return false;
  }

  render() {
    return (
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(auto-fill, ${GridSize}px)`
        }}
      >
        {this.elementRefs.map((Element, index) => (
          <BaseComponent
            key={index}
            ref={Element}
            elementKey={index}
            isEditMode={true}
            checkCollision={(area, key) => this.checkCollision(area, key)}
          />
        )
        )
        }
      </div>
    );
  }
}

export default Grid;