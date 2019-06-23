package voice;

import com.nexmo.client.incoming.RecordEvent;
import com.nexmo.client.voice.ncco.Action;
import com.nexmo.client.voice.ncco.Ncco;
import com.nexmo.client.voice.ncco.RecordAction;
import com.nexmo.client.voice.ncco.TalkAction;
import org.apache.commons.lang3.StringUtils;
import spark.Route;
import spark.Spark;

public class AnswerController {

    private static final String JWT = "";
    private static String conversation_id = "";

    public static void main(String[] args) {
        /*
         * Route to answer and connect incoming calls with recording.
         */
        Route answerRoute = (req, res) -> {
            String[] params = req.queryString().split("&");
            String user_number = params[0].split("=")[1];
            String uuid = params[3].split("=")[1];
            if (StringUtils.isBlank(conversation_id)) {
                conversation_id = params[2].split("=")[1];
            }
            System.out.println("I am an uuid: " + uuid);
            System.out.println("conversation id: " + conversation_id);

            TalkAction intro = TalkAction.builder(
                    "Please leave a message after the tone, then press #. We will get back to you as soon as we can.").build();

            //TODO: create user too

            String conversationName = "";//TODO: get conversation

            //ConversationAction conversation = new ConversationAction.Builder(conversationName).build();


            Action websocketAction = getWebSocketAction(user_number);

            TalkAction outro = TalkAction.builder("Thank you for your message. Goodbye").build();

            res.type("application/json");

            String ncco = new Ncco(intro, websocketAction, outro).toJson();

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

    private static Action getWebSocketAction(String user_number) {
        String callback = "https://ebd3525c.ngrok.io/asr";
        WebSocketHeader header = new WebSocketHeader(user_number, callback);

        WebSocketEndpoint endpoint = new WebSocketEndpoint();
        endpoint.setType("websocket");
        endpoint.setContent_type("audio/l16;rate=16000");
        endpoint.setUri("ws://3772bf9d.ngrok.io/echo");
        endpoint.setHeaders(header);

        WebSocketAction action = new WebSocketAction();
        action.setAction("connect");
        action.setEndpoint(new WebSocketEndpoint[]{endpoint});
        return action;
    }
}