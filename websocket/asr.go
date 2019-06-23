package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"

	speech "cloud.google.com/go/speech/apiv1"
	speechpb "google.golang.org/genproto/googleapis/cloud/speech/v1"
)

type ASR struct {
	stream   speechpb.Speech_StreamingRecognizeClient
	username string
}

func NewASR(username string) *ASR {
	ctx := context.Background()
	client, err := speech.NewClient(ctx)
	if err != nil {
		log.Fatal(err)
	}

	stream, err := client.StreamingRecognize(ctx)
	if err != nil {
		log.Fatal(err)
	}

	return &ASR{
		stream:   stream,
		username: username,
	}
}

func (asr *ASR) sendInitialMessage() error {
	return asr.stream.Send(&speechpb.StreamingRecognizeRequest{
		StreamingRequest: &speechpb.StreamingRecognizeRequest_StreamingConfig{
			StreamingConfig: &speechpb.StreamingRecognitionConfig{
				Config: &speechpb.RecognitionConfig{
					Encoding:        speechpb.RecognitionConfig_LINEAR16,
					SampleRateHertz: 16000,
					LanguageCode:    "en-US",
				},
			},
		},
	})
}

// Send sends audio data to google (16khz)
func (asr *ASR) Send(pipe *Pipe) error {
	for {
		if err := asr.stream.Send(&speechpb.StreamingRecognizeRequest{
			StreamingRequest: &speechpb.StreamingRecognizeRequest_AudioContent{
				AudioContent: pipe.Receive(),
			},
		}); err != nil {
			log.Printf("Could not send audio: %v", err)
			return err
		}
	}
	return nil
}

// Close closes streaming connection with Google
func (asr *ASR) Close() {
	if err := asr.stream.CloseSend(); err != nil {
		log.Fatalf("Could not close stream: %v", err)
	}
}

type tempResult struct {
	Transcript     string `json:"transcript"`
	ConversationID string `json:"conversationID"`
}

func (asr *ASR) ForwardResults(pipe *Pipe) {
	for {
		resp, err := asr.stream.Recv()
		if err == io.EOF {
			break
		}

		if err != nil {
			log.Fatalf("Cannot stream results: %v", err)
		}

		if err := resp.Error; err != nil {
			// Workaround while the API doesn't give a more informative error.
			if err.Code == 3 || err.Code == 11 {
				log.Print("WARNING: Speech recognition request exceeded limit of 60 seconds.")
			}
			log.Fatalf("Could not recognize: %+v", err)
			break
		}

		for _, result := range resp.Results {
			if len(result.Alternatives) == 0 {
				continue
			}

			output := tempResult{
				Transcript:     result.Alternatives[0].Transcript,
				ConversationID: asr.username,
			}

			data, err := json.Marshal(output)
			if err != nil {
				log.Printf("error in forward results: ", err)
				return
			}

			fmt.Printf("Result: %+v\n", string(data))
			pipe.Send(data)
		}
	}
}
