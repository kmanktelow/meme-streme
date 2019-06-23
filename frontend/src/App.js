import React from 'react';
import './App.css';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from "websocket";

let client;
// client.binaryType = "arraybuffer";

export default class App extends React.Component {
  state = {
    othersImgs: [],
    yourImgs: [],
    callJoined: false,
    numberOfGifs: 0,
  };

  componentWillMount() {
    // this.openWebsocket();
  }

  getImages(searchText) {
    axios.get(`https://api.giphy.com/v1/gifs/translate?api_key=L4FOIq94aifdkHfbH0TIWbxEZ7XoOYfK&s=${searchText}`).then(res => {
      this.setState({
        othersImgs: [...this.state.othersImgs, res.data.data]
      });
    });
  }

  joinCall = () => {
    client.send("joined");
    this.setState({ callJoined: true });
    this.getImages('hello');
  }

  leaveCall = () => {
    this.setState({ callJoined: false });
  }

  openWebsocket = () => {
    const { host } = window.location;
    client = new W3CWebSocket(`ws://${host}/ws/asr`); 

    client.onopen = (message) => {
      console.log(`Is it open ${client.OPEN}`);
      console.log(message);
    };

    client.onmessage = (message) => {
      console.log(message);
    };

    client.onerror = (error) => {
      console.log(`there is an error ${error}`);
    }
  }

  closeWebsocket = () => {
    client.close();
  }

  renderOthersImages = () => {
    return this.state.othersImgs.map((img) => {
      return (
        <img key={img.id} src={img.images.original.url} alt={img.title} />
      )
    }); 
  }

  renderYourImages = () => {
    return this.state.yourImgs.map((img) => {
        return (
          <img key={img.id} src={img.images.original.url} alt={img.title} />
        )
    }); 
  }

  renderScreen = () => {
    if (! this.state.callJoined) {
      return (
        <div>
          <button className="callButton" onClick={this.joinCall}>Join call</button>
        </div>
      )
    } else {
      return (
        <div>
          <button className="callButton" onClick={this.leaveCall}>Leave call</button>
          <div><p>You have sent {this.state.numberOfGifs} gifs</p></div>
          <div className="conversation">
            <div>
              {this.renderOthersImages()}
            </div>
            <div>
              {this.renderYourImages()}
            </div>
          </div>
        </div>
      )
    }
  }

  render () {
    return (
      <div className="App">
          <header>Meme Streme</header>
          <button onClick={this.openWebsocket}>Open websocket</button>
          <button onClick={this.closeWebsocket}>Close websocket</button>
          <div>{this.renderScreen()}</div>
      </div>
    )
  };
};
