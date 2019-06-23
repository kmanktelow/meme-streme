package voice;

import com.nexmo.client.incoming.RecordEvent;
import com.nexmo.client.voice.ncco.Action;
import com.nexmo.client.voice.ncco.Ncco;
import com.nexmo.client.voice.ncco.TalkAction;
import spark.Route;
import spark.Spark;

public class AnswerController {

    private static final String THIS_APP_HOST = "ebd3525c.ngrok.io";
    private static final String GO_APP_HOST = "3772bf9d.ngrok.io";

    public static void main(String[] args) {
        /*
         * Route to answer and connect incoming calls with recording.
         */
        Route answerRoute = (req, res) -> {
            String[] params = req.queryString().split("&");
            String user_number = params[1].split("=")[1];

            TalkAction intro = TalkAction.builder(
                    "Hello, you have joined the call").build();

            Action websocketAction = getWebSocketAction(user_number);

            res.type("application/json");

            String ncco = new Ncco(intro, websocketAction).toJson();
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
            res.status(200);
            return "";
        };

        Route testRoute = (req, res) -> {
            return "It is working";
        };

        Spark.port(getPort());
        Spark.get("/webhooks/answer", answerRoute);
        Spark.post("/webhooks/event", eventRoute);
        Spark.post("/webhooks/recordings", recordingRoute);
        Spark.webSocket("/asr", ASREndpoint.class);
    }

    private static Action getWebSocketAction(String user_number) {
        String callback = "https://" + THIS_APP_HOST +"/asr";
        WebSocketHeader header = new WebSocketHeader(user_number, callback);

        WebSocketEndpoint endpoint = new WebSocketEndpoint();
        endpoint.setType("websocket");
        endpoint.setContent_type("audio/l16;rate=16000");
        endpoint.setUri("ws://"+ GO_APP_HOST + "/echo");
        endpoint.setHeaders(header);

        WebSocketAction action = new WebSocketAction();
        action.setAction("connect");
        action.setEndpoint(new WebSocketEndpoint[]{endpoint});
        return action;
    }

    private static int getPort() {
        try {
            System.out.println("port: " + System.getenv("PORT"));
            return Integer.valueOf(System.getenv("PORT"));
        } catch (Exception e) {
            System.out.println(e);
        }
        return 4000;
    }
}