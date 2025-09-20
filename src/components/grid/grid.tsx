import React from 'react';
import { Component } from 'react';
import './style.css';
import { GridSize } from '../../config';

import BaseModule from '../Modules/BaseModule/BaseModule';
import ToDoList from '../Modules/ToDoList/ToDoList';

type GridArea = {
  width: number,
  height: number,
  col: number,
  row: number
}

type props = {
  isEditMode: boolean
};

class Grid extends Component<props> {
  elementRefs: React.RefObject<BaseModule | null>[] = [];

  constructor(props: any) {
    super(props);

    this.elementRefs = [React.createRef<BaseModule>(), React.createRef<BaseModule>()];
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
          gridTemplateColumns: `repeat(auto-fill, ${GridSize}px)`,
          gridTemplateRows: `repeat(auto-fill, ${GridSize}px)`,
        }}
      >
        {
          <ToDoList
            elementKey={0}
            isEditMode={this.props.isEditMode}
            checkCollision={(area, key) => this.checkCollision(area, key)}
          />
        }
      </div>
    );
  }
}

export default Grid;