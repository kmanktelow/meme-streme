import React from 'react';
import './App.css';
import axios from 'axios';


export default class App extends React.Component {
  state = {
    othersImgs: [],
    yourImgs: [],
    callJoined: false,
    numberOfGifs: 0,
  };

  componentDidMount() {
    // this.getImages('hello');
  }

  getImages(searchText) {
    axios.get(`https://api.giphy.com/v1/gifs/translate?api_key=L4FOIq94aifdkHfbH0TIWbxEZ7XoOYfK&s=${searchText}`).then(res => {
      this.setState({
        othersImgs: [...this.state.othersImgs, res.data.data]
      });
    });
  }

  joinCall = () => {
    this.setState({ callJoined: true });
    this.getImages('hello');
  }

  leaveCall = () => {
    this.setState({ callJoined: false });
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
          <div>{this.renderScreen()}</div>
      </div>
    )
  };
};
