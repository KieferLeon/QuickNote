import React, { Component } from "react";
import './BaseComponent.css'
import { GridSize } from "../../config";

type Props = {};
type State = {
    isDragging: boolean;
    posX: number;
    posY: number;
    elementCol: number;
    elementRow: number;
};

class BaseComponent extends Component<Props, State>{
    offsetX: number = 0;
    offsetY: number = 0;

    constructor(props: Props) {
        super(props);

        const elementCol = 3;
        const elementRow = 1;

        this.state = {
            isDragging: false,
            elementCol: elementCol,
            elementRow: elementRow,
            posX: elementCol * GridSize,
            posY: elementRow * GridSize,
            
        };
    }

    beginmove = (event: React.MouseEvent<HTMLDivElement>) => {
        const element = event.currentTarget;
        const rect = element.getBoundingClientRect();

        this.offsetX = event.clientX - rect.left;
        this.offsetY = event.clientY - rect.top;

        this.setState({ isDragging: true });

        document.addEventListener("mousemove", this.moving);
        document.addEventListener("mouseup", this.endmove);
    }

    moving = (event: MouseEvent) => {
        if (!this.state.isDragging) return;

        const x = event.clientX - this.offsetX;
        const y = event.clientY - this.offsetY;

        this.setState({ posX: x, posY: y });
    }

    endmove = () => {
        this.setState({ isDragging: false });

        const newElementCol = Math.round(this.state.posX / GridSize);
        const newElementRow = Math.round(this.state.posY / GridSize);

        this.setState({
            elementCol: newElementCol,
            elementRow: newElementRow,
            posX: newElementCol * GridSize,
            posY: newElementRow * GridSize,
        });

        document.removeEventListener("mousemove", this.moving);
        document.removeEventListener("mouseup", this.endmove);
    }

    render() {
        const { isDragging, elementRow, elementCol, posX, posY } = this.state;
        const style = isDragging
            ? {
                position: 'absolute' as const,
                left: posX,
                top: posY,
                width: GridSize,
                height: GridSize,
                cursor: 'grabbing' as const,
                userSelect: 'none' as const,
                zIndex: 1000,
            }
            : {
                position: 'static' as const,
                gridRow: elementRow,
                gridColumn: elementCol,
                width: GridSize,
                height: GridSize,
                cursor: 'grab' as const,
                userSelect: 'none' as const,
            };

        return (
            <div
                className="BaseComponent"
                style={style}
                onMouseDown={this.beginmove}
            >
                This is a Base Component
            </div>
        );
    }
}

export default BaseComponent;