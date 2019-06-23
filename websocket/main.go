package main

import (
	"log"
	"net/http"
)

func main() {
	log.Print("starting http server")
	http.HandleFunc("/echo", echo)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err.Error())
	}
}

func echo(w http.ResponseWriter, r *http.Request) {
	log.Print("received connection")
	ws := NewWebsocket(w, r)

	// initialize Google
	asr := NewASR()

	// Send the initial configuration message.
	if err := asr.sendInitialMessage(); err != nil {
		log.Fatal(err)
	}

	// pipe

	// receive stuff from google
	go asr.PrintResults()

	// receive websocket and send to google
	pipe := NewPipe()

	go asr.Send(pipe)
	ws.ForwardAudioIntoPipe(pipe)

	// close asr if no more audio
	asr.Close()
	log.Print("finished connection")
}
