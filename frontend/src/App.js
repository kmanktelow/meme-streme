import React from 'react';
import './App.css';
import axios from 'axios';
import { format } from 'date-fns';

let client;
// client.binaryType = "arraybuffer";

let counter = 1;

export default class App extends React.Component {
  state = {
    imgs: [],
    callJoined: false,
    numberOfGifs: 0,
    numberOfStickers: 0,
    totalGifCount: 0
  };

  componentDidMount() {
    // this.openWebsocket();
  }

  getMemes({ transcript, conversationID }) {
    console.log(`transcript ${transcript}`);
    console.log(`conversationID ${conversationID}`);
    axios.get(`https://api.giphy.com/v1/gifs/translate?api_key=L4FOIq94aifdkHfbH0TIWbxEZ7XoOYfK&s=${transcript}`).then(res => {
      counter++;
      this.setState({
        imgs: [...this.state.imgs, { 
          img: res.data.data.images.original.url, 
          time: format(new Date(), 'HH:ss'), 
          user: conversationID, 
          you: false,
          id: `image-${counter}`,
          title: res.data.data.title 
        }],
        numberOfStickers: this.state.numberOfStickers + 1,
        totalGifCount: this.state.totalGifCount + 1
      });
    });
  }

  getStickers({ transcript, conversationID }) {
    axios.get(`https://api.giphy.com/v1/stickers/search?api_key=L4FOIq94aifdkHfbH0TIWbxEZ7XoOYfK&q=${transcript.split(' ')[0]}&limit=2`).then(res => {
      counter++;
      console.log(res.data.data);
      if(res.data.data.length === 0) return;
      this.setState({
        imgs: [...this.state.imgs, { 
          img: res.data.data[0].images.original.url, 
          time: format(new Date(), 'HH:ss'), 
          user: conversationID, 
          you: true,
          id: `image-${counter}`,
          title: res.data.data[0].title 
        }],
        numberOfStickers: this.state.numberOfStickers + 1,
        totalGifCount: this.state.totalGifCount + 1
      });
    });
  }

  add = () => {
    this.getStickers({ transcript: 'another test', conversationID: 'Joe' });
  }

  addYours = () => {
    this.getMemes({ transcript: 'it is me', conversationID: 'Joe' });
  }

  openWebsocket = () => {
    //const { host } = window.location;
    client = new WebSocket('ws://lnft.eu:46711/subscribe'); 

    client.onopen = () => {
      console.log('It is open');
    };

    client.onmessage = (event) => {
      console.log(`event ${event.data}`);
      const parsedEvent = JSON.parse(event.data);

      console.log(parsedEvent);
      if (event.data instanceof ArrayBuffer) {
        this.getMemes(parsedEvent)
      } else {
        this.getMemes(parsedEvent);
      }
    };

    client.onerror = (error) => {
      console.log(`there is an error ${error}`);
    }
  }

  renderImage = (img, index) => {
    if (img.you) {
      return (
        <div className="conversation conversation--yours">
          <div className="yours" key={index}>
            <span className="badge">You</span><br />
            <span className="date">{img.time}</span>
            <img key={img.id} src={img.img} alt={img.title} width="200" />
          </div>
        </div>
      )
    } else {
      return (
        <div className="conversation conversation--others">
          <div className="others" key={index}>
            <div className="badge">{img.user}</div><br />
            <div className="date">{img.time}</div>
            <img key={img.id} src={img.img} alt={img.title} width="200" />
          </div>
        </div>
      )
    } 
  }

  renderImages = () => {
    return this.state.imgs.map(this.renderImage);
  }

  renderScreen = () => {
    // if (! this.state.callJoined) {
    //   return (
    //     <div>
    //       <button className="callButton" onClick={this.joinCall}>Join call</button>
    //     </div>
    //   )
    // } else {
      return (
        <div className="main">
          <div className="content">
            <header><h1>MemeStreme</h1></header>
            {/* <button className="callButton" onClick={this.leaveCall}>Leave call</button> */}
            <button onClick={this.add}>Add giphy</button>
            <button onClick={this.addYours}>Add Your giphy</button>
            <div className="scroll">
              {this.renderImages()}
            </div>
          </div>
          <div className="sidebar">
            <div><p>You have sent {this.state.numberOfGifs} gifs</p></div>
            <div><p>Total number of gifs send {this.state.totalGifCount}</p></div>
          </div>
        </div>
      )
    // }
  }

  render () {
    return (
      <div className="App">
          {this.renderScreen()}
      </div>
    )
  };
};
