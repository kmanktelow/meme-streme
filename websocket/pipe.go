package main

import "log"

const (
	bufferSize = 100
)

type Pipe struct {
	pipe chan []byte
}

func NewPipe() *Pipe {
	return &Pipe{
		pipe: make(chan []byte, bufferSize),
	}
}

func (p *Pipe) Send(data []byte) {
	p.pipe <- data

	if len(p.pipe) > 0.9*bufferSize {
		log.Print("buffer is kinda big: drop 10%")
		for i := 0; i < 0.1*bufferSize; i++ {
			<-p.pipe
		}
	}
}

func (p *Pipe) Receive() []byte {
	return <-p.pipe
}
