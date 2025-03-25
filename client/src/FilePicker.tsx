import React, { Component, ChangeEvent, MouseEvent } from "react";


type FilePickerProps = {
  createClick: (name: string) => void;
  existedFile: Array<string>;
  openClick: (name: string) => void;
};


type FilePickerState = {
  name: string;  // text in the name text box
};


/** Displays the list of created design files. */
export class FilePicker extends Component<FilePickerProps, FilePickerState> {

  constructor(props: FilePickerProps) {
    super(props);

    this.state = {name: ''};
  }

  render = (): JSX.Element => {
    // TODO: format list of files as links
    return (<div>
        <h3>Files</h3>
        <ul>
          {this.props.existedFile.map((fileName) => (
            <li key={fileName} value={fileName}>
              <a 
                href="#" 
                onClick={() => {
                  this.props.openClick(fileName);
                }}
              >
                {fileName}
              </a>
            </li>
          ))}
        </ul>

        <p>
          Name: <input type="text" value={this.state.name}
            onChange={this.doNameChange}/> 
            &nbsp; &nbsp;
          <button type="button" onClick={this.doCreateClick}>
              Create
            </button>
        </p>
          
      </div>);
  };

  // Updates our record with the name text being typed in
  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({name: evt.target.value});
  };

  // Updates the UI to show the file editor
  doCreateClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.createClick(this.state.name);
  };

}
