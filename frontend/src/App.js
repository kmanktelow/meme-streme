import React from 'react';
import './App.css';
import { format } from 'date-fns';

let client;
// client.binaryType = "arraybuffer";

let counter = 1;

const badgeColours = [ 'blue', 'green', 'yellow', 'pink', 'purple', 'orange' ];

export default class App extends React.Component {
  state = {
    imgs: [],
    users:[],
  };

  componentDidMount() {
    // this.openWebsocket();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  getMemes({ transcript, conversationID }) {
    console.log(`transcript ${transcript}`);
    console.log(`conversationID ${conversationID}`);
    fetch(`/v1/gifs/translate?api_key=L4FOIq94aifdkHfbH0TIWbxEZ7XoOYfK&s=${transcript}`).then(response => {
      response.json().then(res => {
        let userIndex; 
      
        this.state.users.map((user, index) => {
          if (conversationID === user.name)  {
            userIndex = index;
          }
          return {};
        });
        
        if(!userIndex && userIndex !== 0) {
          userIndex = this.state.users.length;
          this.setState({ users: [...this.state.users, { name: conversationID, colour: badgeColours[userIndex], memes: 1 }]});
        } else {
          const userUpdate = Array.from(this.state.users);
          userUpdate[userIndex].memes = userUpdate[userIndex].memes + 1;
          this.setState({ users: userUpdate });
        }
        const user = this.state.users[userIndex];
        console.log(user);
        
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

  getStickers({ transcript, conversationID }, url) {
    fetch(`/v1/stickers/search?api_key=L4FOIq94aifdkHfbH0TIWbxEZ7XoOYfK&q=${transcript.split(' ')[0]}&limit=2`).then(response => {
      response.json().then(res => {
        counter++;
        if(res.data.length === 0) return;

        let userIndex; 
        
        this.state.users.map((user, index) => {
          if (conversationID === user.name)  {
            userIndex = index;
          }
          return {};
        });
      
        if(!userIndex && userIndex !== 0) {
          userIndex = this.state.users.length;
          this.setState({ users: [...this.state.users, { name: conversationID, colour: badgeColours[userIndex], memes: 1 }]});
        } else {
          const userUpdate = Array.from(this.state.users);
          userUpdate[userIndex].memes = userUpdate[userIndex].memes + 1;
          this.setState({ users: userUpdate });
        }
        const user = this.state.users[userIndex];
        console.log(userIndex);
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

  add = () => {
    this.getStickers({ transcript: 'hello', conversationID: 'Test' });
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
      <div className="conversation">
        <div key={index}>
          <span className={`badge ${img.user.colour}`}>{img.user.name}</span><br />
          <span className="date">{img.time}</span>
          <img key={img.id} src={img.img} alt={img.title} width="200" />
        </div>
      </div>
    )
  }

  renderImages = () => {
    return this.state.imgs.map(this.renderImage);
  }

  renderUsers = () => {
    return this.state.users.map((user, index) => {
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
            <div className="scroll">
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
