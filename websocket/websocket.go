package main

import (
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

		// Write message back to browser
		if err = ws.conn.WriteMessage(msgType, msg); err != nil {
			break
		}
	}
}
