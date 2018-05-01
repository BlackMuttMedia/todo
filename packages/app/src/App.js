import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  state = {};
  // async componentDidMount() {
  //   const response = await axios.get("/api/v1/");
  //   const { greeting } = response.data;

  //   this.setState({ greeting });
  // }

  render() {
    const { greeting } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{greeting} </h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
