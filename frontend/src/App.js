import React from 'react';
import './App.css';
import { format } from 'date-fns';

let client;
// client.binaryType = "arraybuffer";

let counter = 1;

const badgeColours = [ 'orange', 'green', 'yellow', 'pink', 'purple', 'blue' ];

export default class App extends React.Component {
  state = {
    imgs: [],
    users:[],
  };

  componentDidMount() {
    // this.openWebsocket();
  }

  componentDidUpdate() {
    setTimeout(this.scrollToBottom, 1000);
  }

  getMemes({ transcript, user }) {
    fetch(`/v1/gifs/translate?api_key=L4FOIq94aifdkHfbH0TIWbxEZ7XoOYfK&s=${transcript}`).then(response => {
      response.json().then(res => {
        if(res.data.length === 0) return;

        counter++;
        this.setState({
          imgs: [...this.state.imgs, { 
            img: res.data.images.original.url, 
            time: format(new Date(), 'HH:ss'), 
            user, 
            id: `image-${counter}`,
            title: res.data.title 
          }],
        });
      });
    });
  }

  getStickers({ transcript, user }, url) {
    fetch(`/v1/stickers/search?api_key=L4FOIq94aifdkHfbH0TIWbxEZ7XoOYfK&q=${transcript.split(' ')[0]}&limit=2`).then(response => {
      response.json().then(res => {
        if(res.data.length === 0) return;
        counter++;
        
        this.setState({
          imgs: [...this.state.imgs, { 
            img: res.data[0].images.original.url, 
            time: format(new Date(), 'HH:ss'), 
            user,
            id: `image-${counter}`,
            title: res.data[0].title 
          }],
        });
      }); 
    });
  }

  getImages = ({ transcript, conversationID }) => {
    let userIndex; 
      
    this.state.users.map((user, index) => {
      if (conversationID === user.name)  {
        userIndex = index;
      }
      return {};
    });
    let user;

    console.log(userIndex);

    if (! userIndex || userIndex < 0) {     
      userIndex = this.state.users.length;
      user = { name: conversationID, colour: badgeColours[userIndex], memes: 1, isMemes: true };
      this.setState({ users: [...this.state.users, user]});
      this.getMemes({ transcript, user });
    } else {
      user = this.state.users[userIndex];

      const containsSticker = transcript.indexOf("sticker") > -1;
      const containsMeme = transcript.indexOf("meme") > -1;

      const userUpdate = Array.from(this.state.users);

      if (user.isMemes && !containsSticker) {
        userUpdate[userIndex].memes = userUpdate[userIndex].memes + 1;
        this.setState({ users: userUpdate });
        this.getMemes({ transcript, user });
      } else if (user.isMemes && containsSticker) {
        userUpdate[userIndex].memes = userUpdate[userIndex].memes + 1;
        userUpdate[userIndex].isMemes = false;
        this.setState({ users: userUpdate });
        this.getStickers({ transcript, user });
      } else if (!user.isMemes && containsMeme) {
        userUpdate[userIndex].memes = userUpdate[userIndex].memes + 1;
        userUpdate[userIndex].isMemes = true;
        this.setState({ users: userUpdate });
        this.getMemes({ transcript, user });
      } else {
        userUpdate[userIndex].memes = userUpdate[userIndex].memes + 1;
        userUpdate[userIndex].isMemes = false;
        this.getStickers({ transcript, user });
      }
    }
  }

  add = () => {
    this.getImages({ transcript: 'sticker', conversationID: 'Test' });
  }

  addYours = () => {
    this.getImages({ transcript: 'it is me', conversationID: 'Joe' });
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

      if (parsedEvent.transcript.contains('stickers')) {
        this.getStickers(parsedEvent)
      } else {
        this.getMemes(parsedEvent);
      }
    };

    client.onerror = (error) => {
      console.log(`there is an error ${error}`);
    }
  }

  renderImage = (img, index) => {
    return (
      <div key={index} className="conversation">
        <div>
          <span className={`badge ${img.user.colour}`}>{img.user.name}</span><br />
          <span className="date">{img.time}</span>
          <img key={img.id} src={img.img} alt={img.title} />
        </div>
      </div>
    )
  }

  renderImages = () => {
    return this.state.imgs.map(this.renderImage);
  }

  renderUsers = () => {
    return this.state.users.sort((a, b) => b.memes - a.memes).map((user, index) => {
      return (
        <p key={index}>
          <span className={`badge ${user.colour}`}>{user.name}: {user.memes}</span><br />
        </p>
      );
    });
  }

  renderScreen = () => {
      return (
        <div className="main">
          <div className="content">
            <header>
              <h1>MemeStreme</h1>
              <button onClick={this.add}>Add giphy</button>
              <button onClick={this.addYours}>Add Your giphy</button>
            </header>
            <div className="scroll" ref={(el) => { this.scrollElm = el; }}>
              {this.renderImages()}
              <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }}>
              </div>
            </div>
          </div>
          <div className="sidebar">
            <p>Users in the conversation:</p>
            {this.renderUsers()}
          </div>
        </div>
      )
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  render () {
    return (
      <div className="App">
          {this.renderScreen()}
      </div>
    )
  };
};
