import { GridSize } from '../../../config';
import BaseComponent from '../BaseModule/BaseModule';

class CheckMark {
    checked: boolean = false;
    content: string = '';

    constructor(checked: boolean, content: string) {
        this.checked = checked;
        this.content = content;
    }
}

class ToDoContent {
    titel: string;
    Checkmarks: CheckMark[] = [new CheckMark(false, "Test1"), new CheckMark(true, "Test2"), new CheckMark(false, "Test3"), new CheckMark(false, "Test4"), new CheckMark(true, "Test5"), new CheckMark(false, "Test6")];

    constructor(titel: string) {
        this.titel = titel;
    }
}

class ToDoList extends BaseComponent {

    toDoContents: ToDoContent[] = [new ToDoContent("Test1"), new ToDoContent("Test2"), new ToDoContent("Test3"), new ToDoContent("Test4"), new ToDoContent("Test5"), new ToDoContent("Test6")];
    length: number = 5;

    constructor(props: any) {
        super(props);
    }

    renderContent() {

        if (this.toDoContents.length >= this.state.elementWidth)
            this.toDoContents = [...this.toDoContents.slice(0, this.state.elementWidth)];
        else
            this.toDoContents = [...this.toDoContents, ...Array(this.state.elementWidth - this.toDoContents.length).fill(new ToDoContent("Test"))];

        this.toDoContents.forEach(element => {
            if (element.Checkmarks.length > this.state.elementHeight * 5)
                element.Checkmarks = [...element.Checkmarks.slice(0, this.state.elementHeight * 5)];
            else
                element.Checkmarks = [...element.Checkmarks, ...Array(this.state.elementHeight * 5 - element.Checkmarks.length).fill(new CheckMark(false, "Test"))];
        });

        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                {this.toDoContents.map(element => {
                    return (
                        <div style={{
                            width: `${100 / this.state.elementWidth}%`,
                            height: '100%',
                            boxSizing: 'border-box',
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <div style={{
                                height: "30px",
                                width: "100%",
                                marginTop: "10px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <p style={{
                                    color: "black",
                                    textAlign: "center",
                                    fontSize: "20px",
                                    margin: "0px",
                                }}>
                                    {element.titel}
                                </p>
                            </div>
                            <div style={{
                                flexGrow: 1,
                            }}>
                                {element.Checkmarks.map(checkmark => {
                                    return (
                                        <div style={{
                                            height: "30px",
                                            width: "100%",
                                            marginTop: "10px",
                                            display: "flex",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                        }}>
                                            <input type="checkbox" checked={checkmark.checked} onChange={() => { checkmark.checked = !checkmark.checked; this.forceUpdate(); }} />
                                            <p style={{
                                                color: "black",
                                                textAlign: "center",
                                                fontSize: "16px",
                                                margin: "0px 0px 0px 10px",
                                            }}>
                                                {checkmark.content}
                                            </p>
                                        </div>
                                    );
                                })}

                            </div>

                        </div>
                    );
                })}
            </div>
        );
    }
}

export default ToDoList;