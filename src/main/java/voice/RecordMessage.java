package voice;

import com.nexmo.client.incoming.RecordEvent;
import com.nexmo.client.voice.ncco.Ncco;
import com.nexmo.client.voice.ncco.RecordAction;
import com.nexmo.client.voice.ncco.TalkAction;
import spark.Route;
import spark.Spark;

public class RecordMessage {
    public static void main(String[] args) {
        /*
         * Route to answer and connect incoming calls with recording.
         */
        Route answerRoute = (req, res) -> {
            System.out.println("I am a query string: " +req.queryString());


            String uuid = req.queryString().split("&")[3].split("=")[1];
            System.out.println("I am an uuid: " + uuid);

            String recordingUrl = String.format("%s://%s/webhooks/recordings", req.scheme(), req.host());

            TalkAction intro = TalkAction.builder(
                    "Please leave a message after the tone, then press #. We will get back to you as soon as we can.").build();

            RecordAction record = RecordAction.builder()
                    .eventUrl(recordingUrl)
                    .endOnSilence(3)
                    .endOnKey('#')
                    .beepStart(true)
                    .build();
            // Replace the above recording with the ASR stuff

             Speech speech = new Speech(new String[]{uuid}, "en-GB", new String[]{"one"});

             SpeechTwo speechTwo = new SpeechTwo(speech, "input");

            TalkAction outro = TalkAction.builder("Thank you for your message. Goodbye").build();

            res.type("application/json");

            String ncco = new Ncco(intro, speechTwo, outro).toJson();

            System.out.println("I am a ncco " + ncco);
            return ncco;
        };

        /*
         * Route which prints out the recording URL it is given to stdout.
         */
        Route recordingRoute = (req, res) -> {
            System.out.println("I am a recording: " + req.body());
            RecordEvent recordEvent = RecordEvent.fromJson(req.body());
            System.out.println(recordEvent.getUrl());

            res.status(204);
            return "";
        };

        Route eventRoute = (req, res) -> {
            System.out.println("I am an event: " + req.body());
            System.out.println("I am an event query string: " + req.queryString());
            res.status(200);
            return "";
        };

        Route testRoute = (req, res) -> {
            return "It is working";
        };

        Spark.port(4000);
        Spark.get("/webhooks/answer", answerRoute);
        Spark.post("/webhooks/event", eventRoute);
        Spark.post("/webhooks/recordings", recordingRoute);
        Spark.webSocket("/asr", ASREndpoint.class);
    }
}