package voice;

import com.fasterxml.jackson.databind.util.JSONPObject;
import com.nexmo.client.voice.ncco.Action;
import org.json.JSONArray;
import org.json.JSONObject;

public class Speech {
    private String[] uuid;
    private String language;
    private String[] context;

    private String event_url;

    private int end_on_silence;
    private boolean submit_on_hash;


    public Speech(String[] uuid, String language, String[] context)  {
        this.uuid = uuid;
        this.language = language;
        this.context = context;
        this.event_url = "http://08f4cab1.ngrok.io/webhooks/event";
        this.end_on_silence = 5;
        this.submit_on_hash = true;
    }

    public String[] getUuid() {
        return uuid;
    }

    public void setUuid(String[] uuid) {
        this.uuid = uuid;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String[] getContext() {
        return context;
    }

    public void setContext(String[] context) {
        this.context = context;
    }

    public String getEvent_url() {
        return event_url;
    }

    public void setEvent_url(String eventUrl) {
        this.event_url = eventUrl;
    }

    public int getEnd_on_silence() {
        return end_on_silence;
    }

    public void setEnd_on_silence(int end_on_silence) {
        this.end_on_silence = end_on_silence;
    }

    public boolean isSubmit_on_hash() {
        return submit_on_hash;
    }

    public void setSubmit_on_hash(boolean submit_on_hash) {
        this.submit_on_hash = submit_on_hash;
    }

    public String toJson() {
         JSONObject json = new JSONObject();
         JSONObject content = new JSONObject();
         content.put("language", this.language);
         content.put("uuid", this.uuid);
        JSONArray array = new JSONArray();
         if (this.context != null) {
             array.put(this.context);
         }
         content.put("context", array);
         json.put("speech", content);
         return json.toString();

    }
}
