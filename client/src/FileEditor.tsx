import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Square, Path, replaceSquare, findSquare, split, solid, toColor } from './square';
import { SquareElem } from "./square_draw";
import { len, prefix } from "./list"


type FileEditorProps = {
  /** Initial state of the file. */
  initialState: Square;
  name: string;

  /** Called to ask parent to save file contents in server. */
  onSave: (name: string, root: Square) => void;
  onCancel: () => void;

  // TODO: may want to add more props
};


type FileEditorState = {
  /** The root square of all squares in the design */
  root: Square;

  /** Path to the square that is currently clicked on, if any */
  selected?: Path;
};


/** UI for editing square design page. */
export class FileEditor extends Component<FileEditorProps, FileEditorState> {

  constructor(props: FileEditorProps) {
    super(props);

    this.state = { root: props.initialState };
  }

  render = (): JSX.Element => {
    // TODO: add some editing tools here
    return <div>
      <SquareElem width={600n} height={600n}
                      square={this.state.root} selected={this.state.selected}
                      onClick={this.doSquareClick}></SquareElem>  
      <p style={{ fontSize: "20px", fontWeight: "bold" }}>
        &nbsp; &nbsp; Tools
      </p>
      <p>
        &nbsp; &nbsp; &nbsp; &nbsp; 
        {this.state.selected && (
          <>
            <button type="button" onClick={this.doSplitClick}>
              Split
            </button>
            &nbsp; &nbsp;
            <button type="button" onClick={this.doMergeClick}>
              Merge
            </button>
            &nbsp; &nbsp;
            <select value = {this.getSelectedColor()} onChange={this.doColorChange}>
              <option value="white">White</option>
              <option value="pink">Pink</option>
              <option value="orange">Orange</option>
              <option value="yellow">Yellow</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
            </select>
          </>
        )}
      </p>
      <p>
        &nbsp; &nbsp; &nbsp; &nbsp; 
        <button type="button" onClick={this.doSaveClick}>
          Save
          </button>
        &nbsp; &nbsp;
        <button type="button" onClick={this.doCancelClick}>
          Cancel
          </button>
      </p>
      

    </div>
    ;
  };

  getSelectedColor = (): string | undefined => {
    if (!this.state.selected) {
      return undefined;
    }
    const selectedSquare = findSquare(this.state.selected, this.state.root);
    if (selectedSquare.kind === "solid") {
      return selectedSquare.color;
    }
    return undefined;
  };

  doSquareClick = (path: Path): void => {
    this.setState({selected: path} )
  }

  doSplitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const selected = this.state.selected;
    const root = this.state.root;
    if (selected === undefined) {
      throw new Error ("impossible"); // Since the button is hidden if selected is undefined
    }
    const currentSquare = findSquare(selected, root);
    this.setState({selected: undefined, root: replaceSquare(selected, split(currentSquare, currentSquare, currentSquare, currentSquare), root)})
  };

  doMergeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const selected = this.state.selected;
    if (selected === undefined) {
      throw new Error ("impossible"); // Since the button is hidden if selected is undefined
    }
    if (selected.kind !== "nil") { // We could only merge if selected != nil, ie. root isn't a solid
      const root = this.state.root;
      const currentSquare = findSquare(selected, root);
      const pathToParent = prefix(len(selected)-1n, selected);
      this.setState({selected: undefined, root: replaceSquare(pathToParent, currentSquare, root)});
    }
    this.setState({selected: undefined})
  };

  doColorChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    if (this.state.selected === undefined) {
      throw new Error ("impossible")
    }
    this.setState({selected: undefined, root: replaceSquare(this.state.selected, solid(toColor(evt.target.value)), this.state.root)}) 
  };
  doSaveClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onSave(this.props.name, this.state.root);
  };
  doCancelClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onCancel();
  }
}
