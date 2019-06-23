package main

import (
	"log"
	"net/http"
)

func main() {
	log.Print("starting http server")
	http.HandleFunc("/echo", echo)
	http.HandleFunc("/subscribe", subscribe)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err.Error())
	}
}

func echo(w http.ResponseWriter, r *http.Request) {
	log.Print("received connection")
	ws := NewWebsocket(w, r)
	username, err := ws.ReadHeaders()
	if err != nil {
		log.Fatal(err)
	}

	// initialize Google
	asr := NewASR(username)

	// Send the initial configuration message.
	if err := asr.sendInitialMessage(); err != nil {
		log.Fatal(err)
	}

	// receive stuff from google
	go asr.ForwardResults(resultPipe)

	// receive websocket and send to google
	pipe := NewPipe()

	go asr.Send(pipe)
	ws.ForwardAudioIntoPipe(pipe)

	// close asr if no more audio
	asr.Close()
	log.Print("finished connection")
}

var resultPipe = NewPipe()

func subscribe(w http.ResponseWriter, r *http.Request) {
	log.Print("received connection to sub")
	ws := NewWebsocket(w, r)

	for {
		ws.ForwardTextFromPipe(resultPipe)
	}
}
