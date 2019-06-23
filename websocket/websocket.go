package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	gorilla "github.com/gorilla/websocket"
)

type Websocket struct {
	conn *gorilla.Conn
}

// 2 MB buffer per connection bc why not
const (
	wsBufferSize = 1024 * 1024
)

var upgrader = gorilla.Upgrader{
	ReadBufferSize:  wsBufferSize,
	WriteBufferSize: wsBufferSize,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// NewWebsocket is a constructor bla bla
func NewWebsocket(w http.ResponseWriter, r *http.Request) *Websocket {
	conn, err := upgrader.Upgrade(w, r, nil) // error ignored for sake of simplicity
	if err != nil {
		log.Fatal(err)
	}

	return &Websocket{
		conn: conn,
	}
}

func (ws *Websocket) ReadHeaders() (string, error) {
	msgType, msg, err := ws.conn.ReadMessage()
	if err != nil {
		return "", err
	}

	switch msgType {
	case gorilla.TextMessage:
		var objmap map[string]*json.RawMessage
		err := json.Unmarshal(msg, &objmap)
		if err != nil {
			return "", err
		}

		_, ok := objmap["name"]
		if !ok {
			return "", errors.New("name not found")
		}

		var name string
		err = json.Unmarshal(*objmap["name"], &name)
		if err != nil {
			return "", errors.New("name failed to unmarshal: " + err.Error())
		}
		return name, nil
	default:
		return "", errors.New("first message not text, 'ets die")
	}
}

func (ws *Websocket) ForwardAudioIntoPipe(pipe *Pipe) {
	for {
		// Read message from browser
		msgType, msg, err := ws.conn.ReadMessage()
		if err != nil {
			break
		}

		// Print text messages and forward binary ones (audio)
		switch msgType {
		case gorilla.TextMessage:
			log.Printf(string(msg))
		case gorilla.BinaryMessage:
			pipe.Send(msg)
		}
		/*
			// Write message back to browser
			if err = ws.conn.WriteMessage(msgType, msg); err != nil {
				break
			}*/
	}
}

func (ws *Websocket) ForwardTextFromPipe(pipe *Pipe) {
	for {
		if err := ws.conn.WriteMessage(gorilla.TextMessage, pipe.Receive()); err != nil {
			break
		}
	}
}
