import { type ReactNode } from 'react';
import './style.css';
import { GridSize } from '../../config';

type GridProps = {
  children: ReactNode;
};

const Grid = ({ children }: GridProps) => {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${GridSize}px)`
      }}
    >
      {children}
    </div>
  );
};

export default Grid;