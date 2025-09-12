import React, { Component } from "react";
import './BaseComponent.css'
import { GridSize, Gap } from "../../config";

type Props = {
    isEditMode: boolean;
};

type State = {
    isDragging: boolean;
    isResizing: boolean;

    posX: number;
    posY: number;
    elementCol: number;
    elementRow: number;
    elementWidth: number;
    elementHeight: number;

    previewCol: number;
    previewRow: number;
    previewWidth: number;
    previewHeight: number;
};

class BaseComponent extends Component<Props, State> {
    offsetX: number = 0;
    offsetY: number = 0;

    resizeX: number = 0;
    resizeY: number = 0;

    currentResizeSide: "top" | "right" | "bottom" | "left" | null = null;

    constructor(props: Props) {
        super(props);

        const elementCol = 3;
        const elementRow = 1;

        this.state = {
            isDragging: false,
            isResizing: false,
            posX: elementCol * GridSize,
            posY: elementRow * GridSize,

            elementCol: elementCol,
            elementRow: elementRow,
            elementWidth: 1,
            elementHeight: 1,

            previewCol: 1,
            previewRow: 1,
            previewWidth: 2,
            previewHeight: 1,
        };
    }

    beginmove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!this.props.isEditMode) return;
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


        this.setState({
            previewCol: Math.round(x / GridSize) + 1,
            previewRow: Math.round(y / GridSize) + 1
        });

        this.setState({ posX: x, posY: y });
    }

    endmove = (event: MouseEvent) => {
        if (!this.state.isDragging) return;

        const x = event.clientX - this.offsetX;
        const y = event.clientY - this.offsetY;

        const newElementCol = Math.round(x / GridSize) + 1;
        const newElementRow = Math.round(y / GridSize) + 1;

        console.log(x, y, newElementCol, newElementRow);

        this.setState({
            isDragging: false,
            elementCol: newElementCol,
            elementRow: newElementRow,
            posX: newElementCol * GridSize,
            posY: newElementRow * GridSize,
        });

        document.removeEventListener("mousemove", this.moving);
        document.removeEventListener("mouseup", this.endmove);
    }

    beginresizing = (side: "top" | "right" | "bottom" | "left", event: React.MouseEvent<HTMLDivElement>) => {
        if (!this.props.isEditMode) return;

        event.stopPropagation();
        event.preventDefault();

        console.log('beginresizing', side, event.clientX, event.clientY);

        this.currentResizeSide = side;
        this.setState({ isResizing: true });

        document.addEventListener("mousemove", this.resizing);
        document.addEventListener("mouseup", this.endResize);
    };

    resizing = (event: MouseEvent) => {
        if (!this.props.isEditMode || !this.currentResizeSide) return;

        this.resizeX = event.clientX;
        this.resizeY = event.clientY;

        const usePreview = true;
        this.updateResize(usePreview);
    };


    endResize = (event: MouseEvent) => {
        if (!this.props.isEditMode || !this.currentResizeSide) return;

        this.resizeX = event.clientX;
        this.resizeY = event.clientY;

        const usePreview = false;
        this.updateResize(usePreview);

        document.removeEventListener("mousemove", this.resizing);
        document.removeEventListener("mouseup", this.endResize);

        this.currentResizeSide = null;
        this.setState({ isResizing: false });
    };

    updateResize(usePreview = true) {
        if (!this.props.isEditMode || !this.currentResizeSide) return;

        const { elementCol, elementRow, elementWidth, elementHeight } = this.state;


        switch (this.currentResizeSide) {
            case "left": {
                const delta =
                    Math.round(this.resizeX / GridSize) + 1 - elementCol;

                if (usePreview) {
                    this.setState({
                        previewWidth: elementWidth + Math.abs(delta),
                        previewCol: elementCol - Math.abs(delta),
                    });
                } else {
                    this.setState({
                        elementWidth: elementWidth + Math.abs(delta),
                        elementCol: elementCol - Math.abs(delta),
                    });
                }
                break;
            }

            case "top": {
                const delta =
                    Math.round(this.resizeY / GridSize) + 1 - elementRow;

                if (usePreview) {
                    this.setState({
                        previewHeight: elementHeight + Math.abs(delta),
                        previewRow: elementRow - Math.abs(delta),
                    });
                } else {
                    this.setState({
                        elementHeight: elementHeight + Math.abs(delta),
                        elementRow: elementRow - Math.abs(delta),
                    });
                }
                break;
            }

            case "right": {
                const delta =
                    Math.round(this.resizeX / GridSize) + 1 - (elementCol + elementWidth);

                if (usePreview) {
                    this.setState({ previewWidth: elementWidth + delta });
                } else {
                    this.setState({ elementWidth: elementWidth + delta });
                }
                break;
            }

            case "bottom": {
                const delta =
                    Math.round(this.resizeY / GridSize) + 1 - (elementRow + elementHeight);

                if (usePreview) {
                    this.setState({ previewHeight: elementHeight + delta });
                } else {
                    this.setState({ elementHeight: elementHeight + delta });
                }
                break;
            }
        }
    }

    render() {
        const { isDragging, elementRow, elementCol, previewRow, previewCol, posX, posY } = this.state;

        console.log('render', { posX, posY, previewCol, previewRow });

        const style = isDragging
            ? {
                position: 'absolute' as const,
                left: posX,
                top: posY,
                width: GridSize * this.state.elementWidth + this.state.elementWidth * Gap,
                height: GridSize * this.state.elementHeight + this.state.elementHeight * Gap,
                cursor: 'grabbing' as const,
                userSelect: 'none' as const,
                zIndex: 1000,
            }
            : {
                position: 'relative' as const,
                gridRow: elementRow,
                gridColumn: elementCol,
                width: GridSize * this.state.elementWidth + (this.state.elementWidth - 1) * Gap,
                height: GridSize * this.state.elementHeight + (this.state.elementHeight - 1) * Gap,
                cursor: 'grab' as const,
                userSelect: 'none' as const,
            };

        const previewStyle = {
            position: 'absolute' as const,
            gridRow: previewRow,
            gridColumn: previewCol,
            width: this.state.previewWidth * GridSize + (this.state.previewWidth - 1) * Gap,
            height: this.state.previewHeight * GridSize + (this.state.previewHeight - 1) * Gap,
            background: 'rgba(0, 0, 255, 0.2)',
            outline: '2px dashed #00f',
            pointerEvents: 'none' as const,
            zIndex: this.state.isResizing ? 999 : 0,
        };

        return (
            <>
                {this.props.isEditMode && (
                    <div
                        className="BaseComponentPreview"
                        style={previewStyle}
                    />
                )}
                <div
                    className="BaseComponent"
                    style={style}
                    onMouseDown={this.beginmove}
                >
                    This is a Base Component
                    {this.props.isEditMode && (
                        <>
                            <div className="resize-handle top" onMouseDown={(e) => this.beginresizing("top", e)} />
                            <div className="resize-handle right" onMouseDown={(e) => this.beginresizing("right", e)} />
                            <div className="resize-handle bottom" onMouseDown={(e) => this.beginresizing("bottom", e)} />
                            <div className="resize-handle left" onMouseDown={(e) => this.beginresizing("left", e)} />
                        </>
                    )}
                </div>
            </>
        );
    }
}

export default BaseComponent;