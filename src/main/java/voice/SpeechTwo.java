package voice;

import com.nexmo.client.voice.ncco.Action;

public class SpeechTwo implements Action {
    private Speech speech;

    private String action;


    public SpeechTwo(Speech speech, String action) {
        this.speech = speech;
        this.action = action;
    }

    public Speech getSpeech() {
        return speech;
    }

    public void setSpeech(Speech speech) {
        this.speech = speech;
    }



    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
