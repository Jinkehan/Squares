import React, { Component } from "react";
import { solid, Square, toJson, fromJson } from './square';
import { FilePicker } from "./FilePicker";
import { FileEditor } from "./FileEditor"


/** Describes set of possible app page views */
// NOTE: the enum here has much more detail than what we showed in the
// walkthrough video. The same principle applies, here we just gave you
// more guidance :)
type Page = 
  // Loading list of file names
  {kind: "load-list"} |
  // Displaying list of file names
  {kind: "show-list", names: Array<string>} |
  // Loading an individual file's contents
  {kind: "load-file", name: string} |
  // Editing an individual file
  {kind: "edit-file", name: string, initialState: Square};

type AppState = {
  show: Page;   // Stores state for the current page of the app to show
};

/**
 * Displays the square application containing either a list of files names
 * to pick from or an editor for files files
 */
export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);

    // TODO: change to correct starting view once it's implemented
    
    this.state = {show: {kind: "load-list"}}; // to be changed
    this.updateFileList();
  }

  
  render = (): JSX.Element => {
    // Render a loading screen if app is accessing data from the server
    // or display file list page or editor page appropraitely
    if (this.state.show.kind === "load-list") {
      return <p>Loading file names...</p>;

    } else if (this.state.show.kind === "show-list") {
      return <FilePicker createClick={this.doCreateClick} existedFile={this.state.show.names} openClick={this.doOpenClick}/>;

    } else if (this.state.show.kind === "load-file") {
      return <p>Loading {this.state.show.name}...</p>;

    } else {
      return <FileEditor initialState={this.state.show.initialState} name={this.state.show.name} onSave={this.doSaveClick} onCancel={this.doCancelClick} />;

    }
  };

  doOpenClick = (name: string): void => {
    fetch(`/api/loadContent?name=${name}`, {
      method: "GET",
      headers: {"Content-Type": "application/json"}
    })
      .then(this.doOpenResp)
      .catch(() => this.doOpenError("failed to connect to server"));
  }

  doOpenResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then((res) => {
        this.setState({show: {kind: "edit-file", name: res.name, initialState: fromJson(res.content)}})
      })
        .catch(() => this.doOpenError("200 response is not valid JSON"));
    } else {
      res.text().then(this.doOpenError)
        .catch(() => this.doOpenError("error response is not text"));
    }
  };
  doOpenError = (msg: string): void => {
    console.error(`Error fetching /api/loadContent: ${msg}`);
  };

  doSaveClick = (name: string, root: Square): void => {
    let args = {content: toJson(root)};
    fetch(`/api/saveContent?name=${name}`, {
      method: "POST",
      body: JSON.stringify(args),
      headers: {"Content-Type": "application/json"}
    })
      .then(this.doSaveResp)
      .catch(() => this.doSaveError("failed to connect to server"));
  }
  doSaveResp = (res: Response): void => {
    if (res.status === 200) {
      alert("Saved Successfully");
      return;
    } else {
      res.text().then(this.doSaveError)
        .catch(() => this.doSaveError("error response if not text"));
    }
  }
  doSaveError = (msg: string): void => {
    console.error(`Error fetching /api/saveContent: ${msg}`);
  }

  doCancelClick = (): void => {
    this.setState({show: {kind: "load-list"}})
    this.updateFileList(); // to be changed
  }

  updateFileList = (): void => {
    fetch("/api/listFiles")
      .then((res) => {
        if (res.status !== 200) {
          console.error("Error fetching /api/listFiles: status not 200");
          this.setState({show: {kind: "show-list", names: []}});
        } else {
          res.json().then((data) => {
            const names: Array<string> = data.keys || [];
            this.setState({show: {kind: "show-list", names:names}});
          }).catch(() => {
            console.error("Error parsing /api/listFiles response");
            this.setState({show: {kind: "show-list", names: []}});
          });
        }
      })
      .catch(() => {
        console.error("Error fetching /api/listFiles: failed to connect");
        this.setState({show: {kind: "show-list", names: []}});
      });
  };

  doCreateClick = (name: string): void => {
    if (!name.trim()) {
      alert("File name cannot be empty.");
      return;
    }
    this.setState({show: {kind: "edit-file", name: name, initialState: solid("yellow")}});
  }
}
